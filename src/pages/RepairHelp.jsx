import { useState, useEffect } from 'react';

export default function RepairHelp() {
  const [handymen, setHandymen] = useState([]);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(''); // New state for the fallback banner

  useEffect(() => {
    async function fetchPartnerData() {
      try {
        const res = await fetch('/api/partner/handymen');
        
        if (!res.ok) {
          setError('Partner data is unavailable right now. Try again in a minute.');
          return;
        }
        
        // Backend now sends { data, stale, asof } instead of a bare list
        const { data, stale, asof } = await res.json();
        setHandymen(data);
        
        // If the data is from our cache, show the warning banner
        if (stale) {
          const time = new Date(asof).toLocaleTimeString();
          setBanner(`Showing saved data from ${time}. The partner is not responding.`);
        }
      } catch (err) {
        setError('Partner data is unavailable right now. Try again in a minute.');
      }
    }
    
    fetchPartnerData();
  }, []);

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}>

      <h2>Available Handymen</h2>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      {/* Renders the fallback banner if stale data is returned */}
      {banner && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ffeeba' }}>
          <strong>Notice:</strong> {banner}
        </div>
      )}
      
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