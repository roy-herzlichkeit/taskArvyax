import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log('HEIL1')
        try {
        console.log('HEIL2')
            const res = await axios.post('http://127.0.0.1:5000/register', formData);
        console.log('HEIL3')
            console.log(res);
            window.location.href = '/login';
        } catch (e) {
            console.log(e);
            setError(e.response?.data?.message || 'SignUp Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="sign-up" className="flex justify-center items-center mt-20 mb-48 px-4">
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
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00684A] focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font2 text-2xl">Email: </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Email"
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00684A] focus:outline-none transition-colors duration-300"
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
                            className="w-full border-2 border-black rounded-full py-3 px-4 focus:border-[#00684A] focus:outline-none transition-colors duration-300"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 zen-button text-lg border-2 border-black bg-[#00ED64] text-[#00684A] py-3 transition-all duration-300"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default SignUp;