"use client";

export default function Dashboard({ data }) {
  // If data has more than 50 items, maybe slice it so we don't overwhelm the DOM
  const displayData = data.slice(0, 50);

  return (
    <div className="glass-card fade-in" style={{ marginTop: '2rem' }}>
      <h2 className="card-title">Categorization Intelligence <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>({data.length} records)</span></h2>
      <p className="card-subtitle">Review your automatically predicted spending categories below.</p>
      
      <div className="dashboard-grid">
        {displayData.map((item, idx) => {
          // Identify text column
          const desc = item['Transaction Description'] || item['Description'] || item['text'] || 'Unknown Transaction';
          const cat = item['Predicted Category'] || 'Uncategorized';
          
          return (
            <div key={idx} className="result-item">
              <p className="result-text">"{desc}"</p>
              <div className="badge">{cat}</div>
            </div>
          );
        })}
      </div>
      
      {data.length > 50 && (
        <p style={{textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)'}}>
          Showing top 50 transactions out of {data.length}.
        </p>
      )}
    </div>
  );
}
