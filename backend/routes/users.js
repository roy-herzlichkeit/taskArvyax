import { Router } from "express";
import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post('/register', userController._register);
userRouter.post('/login', userController._login);
userRouter.post('/delete', userController._delete);
userRouter.get('/logout', userController._logout);

export default userRouter;