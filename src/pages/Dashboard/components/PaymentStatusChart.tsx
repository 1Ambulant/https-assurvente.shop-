import React from 'react';

const PaymentStatusChart: React.FC = () => {
  // This is a placeholder for a real chart implementation
  const statuses = [
    { label: 'Paid', value: 68, color: 'bg-green-500' },
    { label: 'Pending', value: 24, color: 'bg-blue-500' },
    { label: 'Overdue', value: 8, color: 'bg-red-500' }
  ];
  
  return (
    <div className="h-60 flex items-center justify-center">
      <div className="w-full max-w-xs">
        {/* Donut Chart Visualization */}
        <div className="relative h-40 w-40 mx-auto">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="3"></circle>
            
            {/* Paid section (68%) */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.91549430918954" 
              fill="transparent"
              stroke="#10b981" 
              strokeWidth="3"
              strokeDasharray="68, 100"
              strokeDashoffset="25"
              className="transition-all duration-1000 ease-out"
            ></circle>
            
            {/* Pending section (24%) */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.91549430918954" 
              fill="transparent"
              stroke="#3b82f6" 
              strokeWidth="3"
              strokeDasharray="24, 100"
              strokeDashoffset="-43"
              className="transition-all duration-1000 ease-out"
            ></circle>
            
            {/* Overdue section (8%) */}
            <circle 
              cx="18" 
              cy="18" 
              r="15.91549430918954" 
              fill="transparent"
              stroke="#ef4444" 
              strokeWidth="3"
              strokeDasharray="8, 100"
              strokeDashoffset="-67"
              className="transition-all duration-1000 ease-out"
            ></circle>
            
            <text x="18" y="17" textAnchor="middle" className="text-3xl font-semibold" fill="#374151">68%</text>
            <text x="18" y="22" textAnchor="middle" className="text-xs" fill="#6b7280">Current</text>
          </svg>
        </div>
        
        <div className="flex justify-between mt-6">
          {statuses.map((status) => (
            <div key={status.label} className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${status.color} mb-1`}></div>
              <span className="text-xs text-gray-600">{status.label}</span>
              <span className="text-sm font-medium">{status.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusChart;