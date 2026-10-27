import { useState, useEffect } from 'react';

export default function RepairHelp() {
  const [handymen, setHandymen] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPartnerData() {
      try {
        // Calling your own backend route, NOT Team 7 directly
        const res = await fetch('/api/partner/handymen');
        
        if (!res.ok) {
          setError('Partner data is unavailable right now');
          return;
        }
        
        const data = await res.json();
        setHandymen(data);
      } catch (err) {
        // This handles the partner being down gracefully
        setError('Partner data is unavailable right now');
      }
    }
    
    fetchPartnerData();
  }, []);

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}>


    <h2>Available Handymen</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      {!error && handymen.length === 0 && <p>Loading...</p>}
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {handymen.map((person) => (
          <div key={person.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', minWidth: '250px' }}>
            <h3>{person.name}</h3>
            <p><strong>Service:</strong> {person.serviceCategory}</p>
            <p><strong>Location:</strong> {person.location}</p>
            <p><strong>Phone:</strong> {person.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}