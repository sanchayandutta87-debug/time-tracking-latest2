import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  color: string;
  data: any[];
  icon: React.ReactNode;
  key?: any;
}

export default function StatCard(props: StatCardProps) {
  const { title, value, change, color, data, icon } = props;
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden h-40">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↗' : '↘'} {change.replace('+', '').replace('-', '')}
            </span>
          </div>
        </div>
        <div className="p-2 rounded-lg" style={{ backgroundColor: color }}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorValue-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#colorValue-${title})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
