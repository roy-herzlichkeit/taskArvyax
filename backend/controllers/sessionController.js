import Session from '../models/Session.js';

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
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id;
        const sessions = await Session.find({ userId: userId });
        res.json(sessions);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const _my_sessions_id = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id;
        const { id } = req.params;
        const session = await Session.findOne({ _id: id, userId: userId });
        if (!session)
            return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (e) {
        console.log(`Server Error: ${e}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const _my_sessions_save_draft = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, tags, jsonFileUrl, sessionId } = req.body;
        const userId = req.user._id;

        if (sessionId) {
            const session = await Session.findOneAndUpdate(
                { _id: sessionId, userId: userId },
                { title, tags, jsonFileUrl, status: false, updatedAt: new Date() },
                { new: true }
            );
            
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            
            return res.status(200).json({ 
                message: 'Draft updated successfully',
                session: session 
            });
        } else {
            const session = await Session.create({
                userId: userId,
                title: title,
                tags: tags,
                jsonFileUrl: jsonFileUrl,
                status: false
            });
            
            return res.status(201).json({ 
                message: 'Draft created successfully',
                session: session 
            });
        }
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ message: 'Server error during draft save' });
    }
};

const _my_sessions_publish = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, tags, jsonFileUrl, sessionId } = req.body;
        const userId = req.user._id;

        if (sessionId) {
            const session = await Session.findOneAndUpdate(
                { _id: sessionId, userId: userId },
                { title, tags, jsonFileUrl, status: true, updatedAt: new Date() },
                { new: true }
            );
            
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            
            return res.status(200).json({ 
                message: 'Session published successfully',
                session: session 
            });
        } else {
            const session = await Session.create({
                userId: userId,
                title: title,
                tags: tags,
                jsonFileUrl: jsonFileUrl,
                status: true
            });
            
            return res.status(201).json({ 
                message: 'Session published successfully',
                session: session 
            });
        }
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ message: 'Server error during publish' });
    }
};

export default { _sessions, _my_sessions, _my_sessions_id, _my_sessions_save_draft, _my_sessions_publish };