// frontend/src/components/SIPSummaryList.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSipSummary } from '../apiService'; // getSipSummary is a runtime function, so normal import
import type { SipSummary } from '../apiService';  // <-- Fix: Use 'import type' for SipSummary interface

const SIPSummaryList: React.FC = () => {
  const { session, user } = useAuth();
  const [summary, setSummary] = useState<SipSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!session) {
        setLoading(false);
        return; // Don't fetch if not logged in
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getSipSummary(session);
        setSummary(data);
        console.log('SIP Summary:', data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch SIP summary.');
        console.error('Fetch SIP Summary Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    // Re-fetch when session changes (e.g., after login) or user changes
  }, [session, user]);

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading SIP summary...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
  }

  if (summary.length === 0) {
    return <div style={{ textAlign: 'center', color: '#888' }}>No SIP plans found yet.</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Your SIP Summary</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {summary.map((item) => (
          <li key={item.scheme_name} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
            <p><strong>Scheme:</strong> {item.scheme_name}</p>
            <p><strong>Total Invested:</strong> ₹{item.total_invested.toFixed(2)}</p>
            <p><strong>Months Invested:</strong> {item.months_invested}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SIPSummaryList;