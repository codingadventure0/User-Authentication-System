const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const user = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: false },
    gender: {
        type: String, 
        default: "PLEASE SELECT",
        required: true,
        enum: ["MALE", "FEMALE", "OTHER"],
        set: function(value) {
            return value.toUpperCase(); // Capitalize the gender value
        }
    },
    role: {
        type: String,
        default: "STUDENT",
        required: false,
        enum: ["STUDENT", "ADMIN", "TEACHER"]
    },
    profilePictureUrl: { 
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaj0ucKVpTNbey2YUj2f0V_MDQ1G6jBiwt2w&usqp=CAU"
    },
}, { timestamps: true });


// Define a pre-save middleware to capitalize the value before saving
user.pre('save', function(next) {
    if (this.name && typeof this.name === 'string') {
        this.name = this.name.toUpperCase();
    }
    if (this.gender && typeof this.gender === 'string') {
        this.gender = this.gender.toUpperCase();
    }
    next();
});

// Define the comparePassword method
user.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('user', user);
