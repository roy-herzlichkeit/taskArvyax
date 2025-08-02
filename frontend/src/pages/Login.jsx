import { useState } from "react";
import { userAPI } from '../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await userAPI.login(formData);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (e) {
            setError(e.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="login" className="flex justify-center items-center mt-20 mb-48 px-4">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="username" className="font2 text-2xl">Username: </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                            className="w-full bg-green-100 border-2 border-black rounded-full py-3 px-4 focus:border-[#2fa460] focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="password" className="font2 text-2xl">Password: </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="w-full bg-green-100 border-2 border-black rounded-full py-3 px-4 focus:border-[#2fa460] focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-3 zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] py-3 transition-all duration-300 ${loading ? 'hover:cursor-progress' : 'hover:cursor-pointer'}`}                    >
                        {loading ? 'Logging in' : 'Login'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;