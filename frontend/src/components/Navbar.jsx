import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="p-4 bg-gray-100">
            <div className="flex justify-between items-center">
                <Link to={`/`} className='text-xl font-bold'>
                    Arvyax
                </Link>
                <div className="flex gap-4">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="px-3 py-1 bg-blue-500 text-white rounded">Dashboard</Link>
                            <Link to="/my-sessions" className="px-3 py-1 bg-green-500 text-white rounded">My Sessions</Link>
                            <Link to="/session-editor" className="px-3 py-1 bg-purple-500 text-white rounded">Create</Link>
                            <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
                            <Link to="/signup" className="px-3 py-1 bg-green-500 text-white rounded">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;