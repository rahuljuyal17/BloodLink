const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requiredBloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    urgency: { type: String, enum: ['Normal', 'Urgent'], required: true },
    hospitalName: { type: String, required: true },
    reason: { type: String, required: true },
    district: { type: String, required: true },

    // Geospatial Location of the emergency/hospital
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },

    status: { type: String, enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'], default: 'Pending' },
    matchedDonor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

}, { timestamps: true });

// Geospatial index for locating requests near donors
requestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', requestSchema);
