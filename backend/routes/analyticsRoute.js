import express from 'express';
import {getUserAnalytics} from '../controllers/analyticsController.js'
import {anotherAuth} from "../middleware/anotherAuth.js";

const analyticsRouter = express.Router();
analyticsRouter.get('/analytics', anotherAuth, getUserAnalytics)

export default analyticsRouter; 