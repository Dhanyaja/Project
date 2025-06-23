import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true, minlength: 6},
    studyStreak: {type: Number, default: 0},
    totalCardsStudied: {type: Number, default: 0},
    lastStudyDate: {type: Date}
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;