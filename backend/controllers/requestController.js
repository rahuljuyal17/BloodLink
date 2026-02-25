const Request = require('../models/Request');
const User = require('../models/User');

// Create a new Blood Request
exports.createRequest = async (req, res) => {
    try {
        const { requiredBloodGroup, urgency, hospitalName, reason, district, latitude, longitude } = req.body;
        const patientId = req.user; // From authMiddleware

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Location (latitude and longitude) is required' });
        }

        const newRequest = new Request({
            patientId,
            requiredBloodGroup,
            urgency,
            hospitalName,
            reason,
            district,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: 'Blood request created successfully',
            request: savedRequest
        });

        // Note: Emitting socket events for matching donors will be handled by a dedicated service/socket logic later

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get all requests for a specific user (Patient's view)
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ patientId: req.user }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Find matching requests for a Donor
// This will return requests within 5km for Urgent, and within the district for Normal
exports.getMatchingRequests = async (req, res) => {
    try {
        const donorId = req.user;
        const donor = await User.findById(donorId);

        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        if (donor.role !== 'Donor') return res.status(403).json({ message: 'Only donors can access matching requests' });

        const donorCoords = donor.location.coordinates;
        const donorDistrict = donor.district;
        const donorBloodGroup = donor.bloodGroup;

        // 1. Find Urgent Requests within 5km (5000 meters)
        const urgentNearRequests = await Request.find({
            status: 'Pending',
            requiredBloodGroup: donorBloodGroup,
            urgency: 'Urgent',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: donorCoords
                    },
                    $maxDistance: 5000 // 5km
                }
            }
        });

        // 2. Find Normal Requests within the same district
        const normalDistrictRequests = await Request.find({
            status: 'Pending',
            requiredBloodGroup: donorBloodGroup,
            urgency: 'Normal',
            district: donorDistrict
        });

        res.json({
            urgentRequests: urgentNearRequests,
            normalRequests: normalDistrictRequests
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Accept a Request
exports.acceptRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const donorId = req.user;

        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.status !== 'Pending') {
            return res.status(400).json({ message: 'This request is no longer pending' });
        }

        request.status = 'Accepted';
        request.matchedDonor = donorId;
        await request.save();

        res.json({ message: 'Request accepted successfully', request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
