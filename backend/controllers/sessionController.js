import Session from '../models/Session.js';
import User from "../models/User.js";

const _sessions = async (req, res) => {
    try {
        const sessions = await Session.find({ status: true });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const _my_sessions = async (req, res) => {
    try {
        const username = 'saulGoodman';
        const user = await User.findOne({ username: username })
        const sessions = await Session.find({ userId: user._id });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const _my_sessions_id = async (req, res) => {
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
};

const _my_sessions_save_draft = async (req, res) => {
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
};

const _my_sessions_publish = async (req, res) => {
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
};

export default {_sessions, _my_sessions, _my_sessions_id, _my_sessions_save_draft, _my_sessions_publish};