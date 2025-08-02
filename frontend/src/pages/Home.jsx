import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <main className="bg-white mt-20 w-full">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-20 my-10">
          <div className="text-center mb-16">
            <h1 className="text-7xl sm:text-8xl font-bold text-gray-800 mb-6 font2">
              ZenFlow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your personal wellness session platform.
              <br />
              Create and share mindfulness sessions with ease.
            </p>

            {token ? (
              <div className="flex flex-col sm:flex-row justify-center items-center text-center space-y-2 sm:space-x-4 sm:space-y-0">
                <Link
                  to="/dashboard"
                  className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/session-editor"
                  className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center"
                >
                  Create Session
                </Link>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center text-center space-x-2 sm:space-x-4 ">
                <Link
                  to="/login"
                  className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="zen-button text-lg border-2 border-black bg-[#B1FF05] text-[#00684A] inline-block items-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#00684A] p-6 text-center border-2 border-black rounded-xl">
              <h3 className="text-xl font-semibold text-[#B1FF05] mb-2 font2">Create Sessions</h3>
              <p className="text-[#00ED64]">Design your own wellness and mindfulness sessions with our intuitive editor.</p>
            </div>

            <div className="bg-[#00684A] p-6 text-center border-2 border-black rounded-xl">
              <h3 className="text-xl font-semibold text-[#B1FF05] mb-2 font2">Auto-Save</h3>
              <p className="text-[#00ED64]">Never lose your work with our auto-save feature that preserves your progress.</p>
            </div>

            <div className="bg-[#00684A] p-6 text-center border-2 border-black rounded-xl">
              <h3 className="text-xl font-semibold text-[#B1FF05] mb-2 font2">Share & Publish</h3>
              <p className="text-[#00ED64]">Share your sessions with the community or keep them private as drafts.</p>
            </div>
          </div>
        </div>

        {!token && (
          <div className="max-w-4xl mx-auto px-4 text-center bg-white p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-gray-600 mb-6">
              Join the users creating and sharing mindfulness sessions.
            </p>
            <Link
              to="/signup"
              className="zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] inline-block items-center"
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