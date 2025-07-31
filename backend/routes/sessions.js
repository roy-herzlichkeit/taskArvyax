import { Router } from "express";
import auth from '../middlewares/authMiddleware.js';
import sessionController from "../controllers/sessionController.js";

const sessionRouter = Router();

sessionRouter.get('/sessions', auth._requireAuth, sessionController._sessions);
sessionRouter.get('/my-sessions', auth._requireAuth, sessionController._my_sessions);
sessionRouter.get('/my-sessions/:id', auth._requireAuth, sessionController. _my_sessions_id);
sessionRouter.post('/my-sessions/save-draft', auth._requireAuth, sessionController._my_sessions_save_draft);
sessionRouter.post('/my-sessions/publish', auth._requireAuth, sessionController._my_sessions_publish);

export default sessionRouter;