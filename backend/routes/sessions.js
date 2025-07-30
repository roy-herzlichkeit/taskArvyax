import { Router } from "express";
import Session from '../models/Session.js';
import User from "../models/User.js";

const sessionRouter = Router();

// GET /sessions Public wellness sessions
// GET /my-sessions User’s own sessions (draft + published)
// GET /my-sessions/:id View a single user session
// POST /my-sessions/save-draft Save or update a draft session
// POST /my-sessions/publish Publish a session

sessionRouter.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({ status: true });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
});

sessionRouter.get('/my-sessions', async (req, res) => {
    try {
        const username = 'saulGoodman';
        const user = await User.findOne({ username: username })
        const sessions = await Session.find({ userId: user._id });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
});

sessionRouter.get('/my-sessions/:id', async (req, res) => {
    try {
        const username = 'heisenberg';
        const user = await User.findOne({ username: username })
        const { id } = req.params;
        const sessions = await Session.findById({ _id: id, userId: user._id });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
});

sessionRouter.post('/my-sessions/save-draft', async (req, res) => {
    try {
        const { title, tags, jsonFileUrl } = req.body;
        const username = 'heisenberg';
        const user = await User.findOne({ username: username });
        console.log(user.id);
        const session = await Session.create({
            userId: user._id,
            title: title,
            tags: tags,
            jsonFileUrl: jsonFileUrl,
            status: false
        });
        return res.status(200).json({ message: 'Meditation Session saved as draft' });
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ message: 'Server error during Server' });
    }
});

sessionRouter.post('/my-sessions/publish', async (req, res) => {
    try {
        const { title, tags, jsonFileUrl } = req.body;
        const username = 'jesse';
        const user = await User.findOne({ username: username });
        console.log(user.id);
        const session = await Session.create({
            userId: user._id,
            title: title,
            tags: tags,
            jsonFileUrl: jsonFileUrl,
            status: true
        });
        return res.status(200).json({ message: 'Meditation Session published' });
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ message: 'Server error during Server' });
    }
});

export default sessionRouter;