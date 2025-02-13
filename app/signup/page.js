'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Something went wrong.');
            } else {
                setSuccess('User registered successfully!');
                // Redirect to sign in page after a short delay
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during signup.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', color: 'black' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', color: 'black' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', color: 'black' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>Sign Up</button>
            </form>
        </div>
    );
}
