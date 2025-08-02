import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionAPI } from '../utils/api';
import assets from '../utils/assets';

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

    if (loading) return <div className="p-4 text-[#00684A]">Loading session...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!session) return <div className="p-4 text-red-500">Session not found</div>;

    return (
        <main className="p-4 max-w-4xl mx-auto">
            <div className="mb-4">
                <Link to="/my-sessions" className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center">
                    ← Back to My Sessions
                </Link>
            </div>

            <div className="bg-[#00684A] text-[#00ED64] border-2 border-black rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                        <h1 className="text-3xl font-bold break-words">{session.title}</h1>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-lg flex items-center justify-center text-center text-sm font-medium border-2 border-black ${session.status ? 'bg-[#00ED64] text-[#00684A]' : 'bg-[#B1FF05] text-[#00684A]'
                            }`}>
                            <div>
                                {session.status ? 'Published' : 'Draft'}
                            </div>
                        </span>
                        <Link to={`/session-editor?id=${session._id}`}
                            className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center">
                            <img src={assets.edit} alt="edit" className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2 text-[#B1FF05]">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {session.tags?.length ? (
                                session.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-0.5 bg-[#00ED64] text-[#00684A] text-xs whitespace-nowrap">
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span>No tags</span>
                            )}
                        </div>
                    </div>

                    {session.jsonFileUrl && (
                        <div>
                            <h3 className="font-medium text-[#00ED64]">Session File:</h3>
                            <a href={session.jsonFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#B1FF05] hover:text-[#00ED64] font-medium transition-colors duration-300 hover:underline">
                                {session.jsonFileUrl}
                            </a>
                        </div>
                    )}

                    <div className="text-sm text-[#B1FF05]">
                        <p>Created: {new Date(session.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(session.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SessionDetails;