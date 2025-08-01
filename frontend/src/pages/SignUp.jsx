/* eslint-disable no-unused-vars */
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
    }

    return (
        <main id="sign-up">
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
                <label htmlFor="email">Email: </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br />
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />
                {error && <p className='text-red-500'>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="p-2 border-2 border-black"
                >
                    {loading ? 'Signing up' : 'Sign Up'}
                </button>
            </form>
        </main>
    )
}

export default SignUp
