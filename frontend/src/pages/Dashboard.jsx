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
            <h1 className="text-3xl sm:text-5xl mt-20 font-bold mb-4 w-full text-center font2">
                Public Wellness Sessions
            </h1>
            <div className="grid gap-4 w-full justify-center mt-20">
                {
                    sessions.length === 0 ?
                        <p className='w-full font2 italic text-center mt-24 text-lg sm:text-xl'>No Public Sessions available</p> :
                        sessions.map(session => (
                            <div key={session._id} className="p-4 rounded-xl border-2 shadow w-[290px] border-black sm:w-xl md:w-2xl lg:w-4xl xl:w-5xl bg-[#00684A] text-[#00ED64]">
                                <h3
                                    className="text-lg mb-2 break-words"
                                    title={session.title}
                                >
                                    {session.title}
                                </h3>

                                <div className="text-[#B1FF05] text-sm">
                                    <span className="font-medium">Tags:</span>

                                    <div className="flex flex-nowrap gap-1 mt-1 mb-3 overflow-x-auto">
                                        {session.tags?.length ? (
                                            session.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-[#00ED64] text-[#00684A] text-xs whitespace-nowrap"
                                                >
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[#00ED64] text-xs">No tags</span>
                                        )}
                                    </div>
                                </div>
                                {session.jsonFileUrl && (
                                    <a href={session.jsonFileUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-[#00ED64] hover:text-[#B1FF05] transition-colors duration-300 hover:underline">
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