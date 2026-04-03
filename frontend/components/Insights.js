"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ['#00A86B', '#39FF14', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#ecfdf5', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function Insights({ data }) {
  if (!data || !data.category_totals || Object.keys(data.category_totals).length === 0) {
    return null;
  }

  const pieData = Object.entries(data.category_totals).map(([name, value], index) => ({
    name,
    value: parseFloat(value.toFixed(2))
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="glass-card fade-in" style={{ marginTop: '2rem' }}>
      <h2 className="card-title">Financial Intelligence Insights</h2>
      <p className="card-subtitle">AI-powered analytics detailing your spending behavior.</p>

      <div className="insights-grid">
        <div className="insights-panel">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Total Analyzed Spend: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              ${data.total_spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </h3>

          {data.smart_insights && data.smart_insights.length > 0 && (
            <div className="smart-insights-box">
              {data.smart_insights.map((insight, idx) => (
                <div key={idx} className="insight-row">
                  {insight}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-panel" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(0,0,0,0.5)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value}`}
                contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(0, 168, 107, 0.3)', borderRadius: '8px' }}
                itemStyle={{ color: '#39FF14' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-panel" style={{ height: '350px', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Category Spending Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pieData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
            <YAxis dataKey="name" type="category" width={120} stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              formatter={(value) => `$${value}`}
              contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: '8px' }}
              itemStyle={{ color: '#00A86B' }}
            />
            <Bar dataKey="value" fill="#39FF14" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
