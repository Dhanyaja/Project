import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://dhanyaja2003:Dha_2003@cluster0.coau0dy.mongodb.net/StudySpace").then(() => console.log("DB Connected"));
}

export default connectDB;