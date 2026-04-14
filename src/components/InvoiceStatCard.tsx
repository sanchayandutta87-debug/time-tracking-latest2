import React from 'react';

interface InvoiceStatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  key?: any;
}

export default function InvoiceStatCard({ title, value, change, isPositive, icon, iconBg, iconColor }: InvoiceStatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
        <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
        <span className="text-sm text-gray-400">Last month</span>
      </div>
    </div>
  );
}
