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
                                <h3 className="font-bold text-lg truncate mb-2" title={session.title}>
                                    {session.title.length > 30 ? `${session.title.substring(0, 30)}...` : session.title}
                                </h3>
                                <div className="text-gray-600 text-sm">
                                    <span className="font-medium">Tags:</span>
                                    <div className="flex flex-wrap gap-1 mt-1 mb-3">
                                        {session.tags?.length ? (
                                            session.tags.slice(0, 4).map((tag, index) => (
                                                <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                                    {tag.length > 12 ? `${tag.substring(0, 12)}...` : tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs">No tags</span>
                                        )}
                                        {session.tags?.length > 4 && (
                                            <span className="text-gray-400 text-xs">+{session.tags.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
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