import { useState, useEffect } from 'react';

export default function RepairHelp() {
  const [handymen, setHandymen] = useState([]);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(''); 
  
  const [crimeLocation, setCrimeLocation] = useState('');

  useEffect(() => {
    async function fetchPartnerData() {
      try {
        const res = await fetch('/api/partner/handymen');
        
        if (!res.ok) {
          setError('Witness directory is unavailable right now. Try again shortly.');
          return;
        }
        
        const { data, stale, asof } = await res.json();
        setHandymen(data || []);
        
        if (stale) {
          const time = new Date(asof).toLocaleTimeString();
          setBanner(`Serving cached witness directory from ${time}. Upstream registry is unreachable.`);
        }
      } catch (err) {
        setError('Witness directory is unavailable right now. Try again shortly.');
      }
    }
    
    fetchPartnerData();
  }, []);

  // Filter contractor records based on location search
  const potentialWitnesses = handymen.filter(person => {
    const loc = person.location || person.area || person.city || '';
    return loc.toLowerCase().includes(crimeLocation.toLowerCase());
  });

  return (
    <div style={{ padding: '20px', marginTop: '80px' }}>

      <h2 style={{ color: '#f8fafc', marginBottom: '8px' }}>On-Site Witness Registry</h2>
      <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: '20px' }}>
        Cross-reference active contractors and site personnel near incident locations.
      </p>
      
      {error && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>}
      
      {banner && (
        <div style={{ backgroundColor: '#422006', color: '#fef08a', padding: '10px', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ca8a04' }}>
          <strong>Resilience Notice:</strong> {banner}
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>
          Search Crime Scene Location:
        </label>
        <input 
          type="text" 
          placeholder="Enter location (e.g., Upper Hill, Westlands...)" 
          value={crimeLocation}
          onChange={(e) => setCrimeLocation(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '420px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc' }}
        />
      </div>
      
      {!error && handymen.length === 0 && <p style={{ color: '#cbd5e1' }}>Loading live witness registry...</p>}

      {!error && handymen.length > 0 && potentialWitnesses.length === 0 && (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No registered personnel logged at this specific location.</p>
      )}
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {potentialWitnesses.map((person, idx) => (
          <div key={person.id || idx} style={{ border: '1px solid #334155', padding: '15px', borderRadius: '8px', minWidth: '260px', backgroundColor: '#0f172a' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>{person.name || person.handymanName || 'On-Site Worker'}</h3>
            <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Role / Trade:</strong> {person.serviceCategory || person.service || 'Contractor'}</p>
            <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Assigned Site:</strong> {person.location || person.area || person.city || 'N/A'}</p>
            <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Contact Info:</strong> {person.phone || person.contact || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}