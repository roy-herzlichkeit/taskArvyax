import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <div className="text-6xl mb-4">🤔</div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/dashboard"
                        className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go to Dashboard
                    </Link>

                    <Link
                        to="/my-sessions"
                        className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        View My Sessions
                    </Link>

                    <Link
                        to="/"
                        className="block w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    <p>Need help? Contact support or check our documentation.</p>
                </div>
            </div>
        </main>
    );
};

export default NotFound;