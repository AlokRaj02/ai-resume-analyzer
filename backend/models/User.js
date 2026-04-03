import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    resetOtp: { 
        type: String 
    },
    otpExpiry: { 
        type: Date 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
