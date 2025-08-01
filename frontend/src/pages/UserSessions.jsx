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
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-lg truncate" title={session.title}>
                                            {session.title.length > 30 ? `${session.title.substring(0, 30)}...` : session.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Status: {' '}
                                            <span className={session.status ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                                                {session.status ? 'Published' : 'Draft'}
                                            </span>
                                        </p>
                                        <div className="text-gray-600 text-sm mt-1">
                                            <span className="font-medium">Tags:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {session.tags?.length ? (
                                                    session.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                                            {tag.length > 12 ? `${tag.substring(0, 12)}...` : tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No tags</span>
                                                )}
                                                {session.tags?.length > 3 && (
                                                    <span className="text-gray-400 text-xs">+{session.tags.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
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