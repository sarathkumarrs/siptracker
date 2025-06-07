// frontend/src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './components/SignIn';
import SIPForm from './components/SIPForm'; // <-- Import SIPForm
import SIPSummaryList from './components/SIPSummaryList'; // <-- Import SIPSummaryList

// Component that conditionally renders based on authentication
const AppContent: React.FC = () => {
  const { session, loading, user, signOut } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading authentication...</div>;
  }

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', margin: '20px', textAlign: 'center' }}>
      <h1>SIP Tracker Frontend</h1>
      
      {!session && <SignIn />}

      {session && user && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #007bff', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
          <h3>Authentication Info (from Frontend)</h3>
          <p><strong>Logged in as:</strong> {user.email || user.id}</p>
          <p><strong>Supabase User ID (UUID):</strong> {user.id}</p>
          <p><strong>JWT (Access Token):</strong> <span style={{ wordBreak: 'break-all', fontSize: '0.8em', color: '#555' }}>{session.access_token}</span></p>
          <p style={{color:'green', fontWeight:'bold'}}>✅ You've got the JWT! Now use it to test API calls.</p>
          <button
            onClick={signOut}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Authenticated content section */}
      {session && user && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', textAlign: 'left' }}>
          <h2>SIP Features (Authenticated)</h2>
          <SIPForm /> {/* Render the SIPForm component */}
          <SIPSummaryList /> {/* Render the SIPSummaryList component */}
        </div>
      )}

      {!session && <p style={{ marginTop: '20px', color: '#888' }}>Sign in to access SIP features.</p>}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;