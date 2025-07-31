import { Router } from "express";
import sessionController from "../controllers/sessionController.js";

const sessionRouter = Router();

sessionRouter.get('/sessions', sessionController._sessions);
sessionRouter.get('/my-sessions', sessionController._my_sessions);
sessionRouter.get('/my-sessions/:id',sessionController. _my_sessions_id);

sessionRouter.post('/my-sessions/save-draft', sessionController._my_sessions_save_draft);
sessionRouter.post('/my-sessions/publish', sessionController._my_sessions_publish);

export default sessionRouter;