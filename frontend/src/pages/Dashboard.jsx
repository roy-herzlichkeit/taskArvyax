import { useState, useEffect } from 'react';
import { sessionAPI } from '../utils/api';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await sessionAPI.getSessions();
                setSessions(res.data);
            } catch (e) {
                setError('Failed to Fetch');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    if (loading)
        return <div className="p-4">Loading Sessions</div>

    if (error)
        return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Public Wellness Sessions
            </h1>
            <div className="grid gap-4">
                {
                    sessions.length === 0 ?
                        <p>No Public Sessions available</p> :
                        sessions.map(session => (
                            <div key={session._id} className="p-4 border rounded shadow">
                                <h3 className="font-bold text-lg">
                                    {session.title}
                                </h3>
                                <p className="text-gray-600">
                                    Tags: {session.tags?.join(', ') || 'No tags'}
                                </p>
                                {session.jsonFileUrl && (
                                    <a href={session.jsonFileUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-500 underline">
                                        View Session File
                                    </a>
                                )}
                            </div>
                        ))
                }
            </div>
        </main>
    )
};

export default Dashboard;