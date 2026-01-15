import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// بيانات تجريبية تحاكي الرسوم البيانية في الصورة
const data = [
  { name: '14-01', members: 45, joins: 5, messages: 10 },
  { name: '13-01', members: 50, joins: 22, messages: 85 },
  { name: '12-01', members: 20, joins: 2, messages: 40 },
  { name: '11-01', members: 0, joins: 0, messages: 0 },
  { name: '10-01', members: 0, joins: 0, messages: 0 },
];

export default function Overview() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>نظرة عامة</h2>
      
      {/* البطاقات العلوية الثلاثة */}
      <div style={styles.statsRow}>
        <StatCard title="عدد الأعضاء" value="52" icon="👥" color="#7289da" />
        <StatCard title="الدخول/المغادرة" subTitle="في آخر 24 ساعة" value="4/00" icon="👤+" color="#f0b232" />
        <StatCard title="الرسائل الجديدة" subTitle="في آخر 24 ساعة" value="0000" icon="💬" color="#5865f2" />
      </div>

      {/* الرسوم البيانية */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>تدفق الأعضاء</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}><Area type="monotone" dataKey="members" stroke="#5d3fd3" fill="#5d3fd3" fillOpacity={0.6} /></AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>الدخول / المغادرة</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}><Area type="monotone" dataKey="joins" stroke="#23a559" fill="#23a559" fillOpacity={0.6} /></AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{...styles.chartBox, marginTop: '20px'}}>
        <h4 style={styles.chartTitle}>عدد الرسائل ( باستثناء البوتات )</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}><Area type="monotone" dataKey="messages" stroke="#b11d5d" fill="#b11d5d" fillOpacity={0.6} /></AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// مكون البطاقة الإحصائية
function StatCard({ title, subTitle, value, icon, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLeft}>
        <div style={styles.statTitle}>{title}</div>
        {subTitle && <div style={styles.statSub}>{subTitle}</div>}
        <div style={styles.statValue}>{value}</div>
      </div>
      <div style={{...styles.statIcon, color: color}}>{icon}</div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#313338', minHeight: '100vh', direction: 'rtl' },
  title: { color: 'white', borderBottom: '1px solid #444', paddingBottom: '15px', marginBottom: '30px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statCard: { flex: 1, backgroundColor: '#2b2d31', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #383a40' },
  statTitle: { color: 'white', fontSize: '16px', fontWeight: 'bold' },
  statSub: { color: '#949ba4', fontSize: '11px' },
  statValue: { color: 'white', fontSize: '24px', marginTop: '10px', fontWeight: 'bold', textAlign: 'left' },
  statIcon: { fontSize: '30px', backgroundColor: '#1e1f22', padding: '10px', borderRadius: '10px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  chartBox: { backgroundColor: '#2b2d31', padding: '20px', borderRadius: '12px', border: '1px solid #383a40' },
  chartTitle: { color: 'white', marginBottom: '15px', fontSize: '14px', textAlign: 'left' }
};
