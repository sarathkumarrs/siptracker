// frontend/src/components/SIPForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createSip } from '../apiService'; // Import the API function

const SIPForm: React.FC = () => {
  const { session, user } = useAuth();
  const [schemeName, setSchemeName] = useState<string>('SBI Nifty 50 Index Fund');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(1000);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!session) {
      setError('You must be logged in to create a SIP plan.');
      return;
    }

    try {
      const newSip = await createSip(session, {
        scheme_name: schemeName,
        monthly_amount: monthlyAmount,
        start_date: startDate,
      });
      setMessage(`SIP "${newSip.scheme_name}" created successfully!`);
      // Optionally clear form or add to a list here
      console.log('Created SIP:', newSip);
    } catch (err: any) {
      setError(err.message || 'Failed to create SIP plan.');
      console.error('Create SIP Error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Create New SIP Plan</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="schemeName">Scheme Name:</label>
          <input
            type="text"
            id="schemeName"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="monthlyAmount">Monthly Amount:</label>
          <input
            type="number"
            id="monthlyAmount"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(parseFloat(e.target.value))}
            required
            min="1"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add SIP Plan
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default SIPForm;