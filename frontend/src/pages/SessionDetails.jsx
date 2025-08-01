import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionAPI } from '../utils/api';

const SessionDetails = () => {
    const { id } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await sessionAPI.getSession(id);
                setSession(response.data);
            } catch (err) {
                setError('Failed to load session details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSession();
        }
    }, [id]);

    if (loading) return <div className="p-4">Loading session...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!session) return <div className="p-4">Session not found</div>;

    return (
        <main className="p-4 max-w-4xl mx-auto">
            <div className="mb-4">
                <Link to="/my-sessions" className="text-blue-500 hover:underline">
                    ← Back to My Sessions
                </Link>
            </div>

            <div className="bg-white border rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <h1 className="text-3xl font-bold break-words">{session.title}</h1>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${session.status ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                            {session.status ? 'Published' : 'Draft'}
                        </span>
                        <Link to={`/session-editor?id=${session._id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Edit Session
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {session.tags?.length ? (
                                session.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm break-words">
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500">No tags</span>
                            )}
                        </div>
                    </div>

                    {session.jsonFileUrl && (
                        <div>
                            <h3 className="font-medium text-gray-700">Session File:</h3>
                            <a href={session.jsonFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline">
                                {session.jsonFileUrl}
                            </a>
                        </div>
                    )}

                    <div className="text-sm text-gray-500">
                        <p>Created: {new Date(session.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(session.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SessionDetails;