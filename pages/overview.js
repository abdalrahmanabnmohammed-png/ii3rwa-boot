import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// بيانات افتراضية للرسم البياني
const data = [
  { name: '14-01', val: 10 }, 
  { name: '13-01', val: 45 }, 
  { name: '12-01', val: 20 },
  { name: '11-01', val: 5 }, 
  { name: '10-01', val: 0 }
];

export default function Overview() {
  const [mounted, setMounted] = useState(false);

  // تأكيد أن المكون يعمل في المتصفح فقط لمنع أخطاء Vercel Build
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ direction: 'rtl', color: 'white' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>نظرة عامة</h2>
      
      {/* صف البطاقات الإحصائية */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>👥 عدد الأعضاء</span>
          <h3 style={styles.statValue}>52</h3>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>👤+ الدخول/المغادرة</span>
          <h3 style={styles.statValue}>4/00</h3>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>💬 الرسائل الجديدة</span>
          <h3 style={styles.statValue}>0000</h3>
        </div>
      </div>

      {/* منطقة الرسم البياني */}
      <div style={styles.chartContainer}>
        <h4 style={{ marginBottom: '20px', color: '#949ba4' }}>تدفق الأعضاء (آخر 5 أيام)</h4>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5865f2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5865f2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1f22', border: 'none', borderRadius: '5px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#5865f2" 
                fillOpacity={1} 
                fill="url(#colorVal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: '1 1 200px',
    backgroundColor: '#2b2d31',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #383a40',
    textAlign: 'center'
  },
  statLabel: {
    color: '#b5bac1',
    fontSize: '14px',
    display: 'block',
    marginBottom: '10px'
  },
  statValue: {
    fontSize: '28px',
    margin: 0,
    fontWeight: 'bold'
  },
  chartContainer: {
    backgroundColor: '#2b2d31',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #383a40'
  }
};
