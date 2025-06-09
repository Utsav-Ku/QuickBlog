import express from 'express';
import { adminLogin } from '../controllers/adminController.js';

const adminRouter = express.Router();

console.log("Admin Routes Loaded");

adminRouter.post('/login', adminLogin);

export default adminRouter;