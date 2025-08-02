import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionAPI } from '../utils/api';
import assets from '../utils/assets';

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
            <div className="flex justify-between items-center mb-4 mt-20">
                <h1 className="text-3xl sm:text-4xl font2 mr-3 ml-1">
                    My Wellness Sessions
                </h1>
                <Link to={'/session-editor'} className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] flex space-x-2 justify-center items-center">
                    <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">
                        Create
                    </span>
                    <span className="">
                        <img src={assets.create} alt="create" className="w-5 h-5" />
                    </span>
                </Link>
            </div>
            <div className="grid gap-4 w-full justify-center mt-20">
                {
                    sessions.length === 0 ?
                        <div className="text-center p-8 mb-10">
                            <p className="text-[#00684A] mb-4">
                                You haven't created any sessions yet.
                            </p>
                            <Link to={'/session-editor'} className='zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center'>
                                Create Your First Session
                            </Link>
                        </div> :
                        sessions.map(session => (
                            <div key={session._id} className="p-4 rounded-xl border-2 shadow w-[290px] border-black sm:w-xl md:w-2xl lg:w-4xl xl:w-5xl bg-[#00684A] text-[#00ED64]">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-lg truncate" title={session.title}>
                                            {session.title.length > 30 ? `${session.title.substring(0, 30)}...` : session.title}
                                        </h3>
                                        <p className="text-[#00ED64] text-sm">
                                            Status: {' '}
                                            <span className={`font2 ${session.status ? 'text-[#00ED64] font-medium' : 'text-[#B1FF05] font-medium'}`}>
                                                {session.status ? 'Published' : 'Draft'}
                                            </span>
                                        </p>
                                        <div className="text-[#00ED64] text-sm mt-1">
                                            <span className="font-medium text-[#B1FF05]">Tags:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {session.tags?.length ? (
                                                    session.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="px-2 py-0.5 bg-[#00ED64] text-[#00684A] text-xs whitespace-nowrap">
                                                            {tag.length > 12 ? `${tag.substring(0, 12)}...` : tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[#00ED64] text-xs">No tags</span>
                                                )}
                                                {session.tags?.length > 3 && (
                                                    <span className="text-[#00ED64] text-xs"> +{session.tags.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Link to={`/my-sessions/${session._id}`}
                                            className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center">
                                            <img src={assets.view} alt="view" className="w-5 h-5" />
                                        </Link>
                                        <Link to={`/session-editor?id=${session._id}`}
                                            className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center">
                                            <img src={assets.edit} alt="edit" className="w-5 h-5" />
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