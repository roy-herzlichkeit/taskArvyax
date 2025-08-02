import { Link, useNavigate } from 'react-router-dom';
import assets from '../utils/assets';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="sticky top-1 z-50 p-4 bg-green-300 border-2 rounded-full mt-3 mx-4 backdrop-blur-sm bg-opacity-95">
            <div className="flex justify-between items-center">
                <Link to={`/`} className='text-3xl font2 py-2 px-2 flex items-center gap-2'>
                    <img src={assets.icon} alt="ZenFlow" className="w-8 h-8" />
                    <span className="hidden sm:inline">
                        ZenFlow
                    </span>
                </Link>
                <div className="flex gap-2 sm:gap-4">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="zen-button border-2 border-black bg-[#00ED64] flex items-center">
                                <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">
                                    Dashboard
                                </span>
                                <span className="sm:hidden">
                                    <img src={assets.dashboard} alt="dashboard" className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link to="/my-sessions" className="zen-button border-2 border-black bg-[#00ED64] flex items-center">
                                <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">
                                    Sessions
                                </span>
                                <span className="sm:hidden">
                                    <img src={assets.mySessions} alt="my sessions" className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link to="/session-editor" className="hidden sm:flex zen-button border-2 border-black bg-[#00ED64] items-center">
                                <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">
                                    Create
                                </span>
                                <span className="sm:hidden">
                                    <img src={assets.create} alt="create" className="w-5 h-5" />
                                </span>
                            </Link>
                            <button onClick={handleLogout} className="zen-button mr-3 border-2 border-black bg-red-400 flex items-center hover:cursor-pointer">
                                <span className="hidden sm:inline p-1 h-full text-center text-red-950">
                                    Logout
                                </span>
                                <span className="sm:hidden">
                                    <img src={assets.logout} alt="logout" className="w-5 h-5" />
                                </span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="zen-button border-2 border-black bg-[#00ED64] flex items-center">
                                <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">Login</span>
                                <span className="sm:hidden">
                                    <img src={assets.login} alt="login" className="w-5 h-5" />
                                </span>
                            </Link>
                            <Link to="/signup" className="zen-button border-2 mr-3 border-black bg-[#B1FF05] flex items-center">
                                <span className="hidden sm:inline p-1 h-full text-center text-[#00684A]">Sign Up</span>
                                <span className="sm:hidden">
                                    <img src={assets.signup} alt="sign up" className="w-5 h-5" />
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;