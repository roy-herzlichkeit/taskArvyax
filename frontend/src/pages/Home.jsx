import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">Arvyax</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal wellness session platform. Create, manage, and share mindfulness sessions with ease.
          </p>

          {token ? (
            <div className="space-x-4">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/session-editor"
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block"
              >
                Create Session
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Sessions</h3>
            <p className="text-gray-600">Design your own wellness and mindfulness sessions with our intuitive editor.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Auto-Save</h3>
            <p className="text-gray-600">Never lose your work with our intelligent auto-save feature that preserves your progress.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Share & Publish</h3>
            <p className="text-gray-600">Share your sessions with the community or keep them private as drafts.</p>
          </div>
        </div>

        {!token && (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of users creating and sharing mindfulness sessions.
            </p>
            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all inline-block"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;