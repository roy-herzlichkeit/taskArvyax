import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-7xl sm:text-9xl font-bold text-black font2">404</h1>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-6 px-2">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col space-y-4 px-2">
                    <Link
                        to="/dashboard"
                        className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] block text-center py-3"
                    >
                        Go to Dashboard
                    </Link>

                    <Link
                        to="/my-sessions"
                        className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] block text-center py-3"
                    >
                        View My Sessions
                    </Link>

                    <Link
                        to="/"
                        className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] block text-center py-3"
                    >
                        Go Home
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-500 px-2">
                    <p>Need help? Contact support or check our documentation.</p>
                </div>
            </div>
        </main>
    );
};

export default NotFound;