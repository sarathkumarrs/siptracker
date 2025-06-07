// frontend/src/components/SignIn.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx'; // Ensure path is correct, now imports from .tsx

const SignIn = () => {
  const [email, setEmail] = useState<string>(''); // Explicitly type
  const [password, setPassword] = useState<string>(''); // Explicitly type
  const [error, setError] = useState<string | null>(null); // Type as string or null
  const [message, setMessage] = useState<string | null>(null); // Type as string or null
  const { signIn, session, user } = useAuth(); // useAuth now returns correctly typed context

  const handleSignIn = async (e: React.FormEvent) => { // Type event
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const data = await signIn(email, password); // signIn return type handled by AuthContext
      if (data?.user && data?.session) { // Check for data before accessing
        setMessage('Signed in successfully!');
        setEmail('');
        setPassword('');
        console.log('Frontend Sign In Success - User:', data.user, 'Session:', data.session);
      } else {
        setError('Sign in failed: No user or session data.');
      }
    } catch (err: any) { // Catch error of any type, then check its message
      setError(err.message || 'An unknown error occurred');
      console.error('Frontend Sign In Error:', err);
    }
  };

  // 'session' and 'user' are now correctly typed as Session | null and User | null
  if (session && user) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3>Logged In!</h3>
        <p>Welcome, {user.email || user.id}</p>
        <p>User ID (Supabase UUID): {user.id}</p>
        <p>JWT (shortened): {session.access_token.substring(0, 30)}...</p>
        {/* We'll add a Sign Out button later */}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign In</button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default SignIn;