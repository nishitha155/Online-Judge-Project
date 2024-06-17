import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        dateOfBirth: '',
        fullName: '',
        github: '',
        linkedIn: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, dateOfBirth, fullName, github, linkedIn } = formData;

        if (!email || !password || !dateOfBirth || !fullName || !github || !linkedIn) {
            setMessage('All fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/register', {
                email,
                password,
                dateOfBirth,
                fullName,
                socialLogin: { github, linkedIn }
            });
            setMessage('Registration successful');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            setMessage('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div>
                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                    <label>GitHub:</label>
                    <input type="url" name="github" value={formData.github} onChange={handleChange} required />
                </div>
                <div>
                    <label>LinkedIn:</label>
                    <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
