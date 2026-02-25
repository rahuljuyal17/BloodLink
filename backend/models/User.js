const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Donor', 'Patient', 'Admin'], required: true },
    age: { type: Number, required: true },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    phoneNumber: { type: String, required: true },
    district: { type: String, required: true },

    // Geospatial Location (GeoJSON Point)
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },

    // Donor specific fields
    isAvailable: { type: Boolean, default: true },
    reputationScore: { type: Number, default: 0 },
    donationsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Create a 2dsphere index for geospatial queries (finding nearby donors)
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
