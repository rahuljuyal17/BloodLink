const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, age, bloodGroup, phoneNumber, district, latitude, longitude } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create location point if provided
        let location = {
            type: 'Point',
            coordinates: [0, 0]
        };

        if (longitude && latitude) {
            location.coordinates = [parseFloat(longitude), parseFloat(latitude)];
        }

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            age,
            bloodGroup,
            phoneNumber,
            district,
            location
        });

        const savedUser = await newUser.save();

        // Create JWT Token
        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                bloodGroup: savedUser.bloodGroup,
                district: savedUser.district,
                phoneNumber: savedUser.phoneNumber,
                age: savedUser.age
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                district: user.district,
                phoneNumber: user.phoneNumber,
                age: user.age
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
