import express from "express";
import { adduser, loginuser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/adduser', adduser)
userRouter.post('/loginuser', loginuser)




export default userRouter;