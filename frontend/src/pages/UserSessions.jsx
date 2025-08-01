import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionAPI } from '../utils/api';

const UserSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMySessions = async () => {
            try {
                const res = await sessionAPI.getMySessions();
                setSessions(res.data);
            } catch (e) {
                setError('Failed to Fetch your sessions');
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchMySessions();
    }, []);

    if (loading)
        return <div className="p-4">Loading your sessions...</div>;

    if (error)
        return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <main className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    My Wellness Sessions
                </h1>
                <Link to={'/session-editor'} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create New Session
                </Link>
            </div>
            <div className="grid gap-4">
                {
                    sessions.length === 0 ?
                        <div className="text-center p-8">
                            <p className="text-gray-600 mb-4">
                                You haven't created any sessions yet.
                            </p>
                            <Link to={'/session-editor'} className='px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                                Create Your First Session
                            </Link>
                        </div> :
                        sessions.map(session => (
                            <div key={session._id} className="p-4 border rounded shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {session.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            Status:
                                            <span className={session.status ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                                                {session.status ? 'Published' : 'Draft'}
                                            </span>
                                        </p>
                                        <p className="text-gray-600">
                                            Tags: {session.tags?.join(', ') || 'No tags'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/my-sessions/${session._id}`}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                            View
                                        </Link>
                                        <Link to={`/session-editor?id=${session._id}`}
                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>
        </main>
    );
};

export default UserSessions;