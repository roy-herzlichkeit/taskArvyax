import { useState } from "react";
import axios from 'axios';

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
            const res = await axios.post('http://127.0.0.1:5000/login', formData);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (e) {
            setError(e.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main id="login">
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="Password">Password: </label>
                <input
                    type="password"
                    name="Password"
                    id="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="p-2 border-2 border-black"
                >
                    {loading ? 'Logging in' : 'Login'}
                </button>
            </form>
        </main>
    );
};

export default Login