import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: '14-01', val: 10 }, { name: '13-01', val: 45 }, { name: '12-01', val: 20 },
  { name: '11-01', val: 5 }, { name: '10-01', val: 0 }
];

export default function Overview() {
  return (
    <div style={{direction: 'rtl'}}>
      <h2 style={{marginBottom: '20px'}}>نظرة عامة</h2>
      <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
        <div style={cardStyle}><span>عدد الأعضاء</span><h3>52</h3></div>
        <div style={cardStyle}><span>الدخول/المغادرة</span><h3>4/00</h3></div>
        <div style={cardStyle}><span>الرسائل</span><h3>0000</h3></div>
      </div>
      <div style={{backgroundColor: '#2b2d31', padding: '20px', borderRadius: '10px'}}>
        <h4 style={{marginBottom: '15px'}}>تدفق الأعضاء</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <Area type="monotone" dataKey="val" stroke="#5865f2" fill="#5865f2" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = { flex: 1, backgroundColor: '#2b2d31', padding: '20px', borderRadius: '10px', textAlign: 'center' };
