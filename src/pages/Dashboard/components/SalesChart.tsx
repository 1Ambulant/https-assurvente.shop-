import React from 'react';

const SalesChart: React.FC = () => {
  // This is a placeholder for a real chart implementation
  // In a real application, you would use a charting library like Chart.js, Recharts, etc.
  return (
    <div className="h-60 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-500">This Month</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-300 mr-1"></div>
            <span className="text-xs text-gray-500">Last Month</span>
          </div>
        </div>
        <select className="text-sm border rounded p-1">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
      
      <div className="flex-1 flex items-end">
        {/* Mock Bar Chart */}
        <div className="flex-1 h-full flex items-end space-x-2">
          {[65, 40, 80, 50, 45, 75, 60].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full flex space-x-1">
                <div 
                  className="flex-1 bg-blue-500 rounded-t" 
                  style={{ height: `${height}%` }}
                ></div>
                <div 
                  className="flex-1 bg-blue-300 rounded-t" 
                  style={{ height: `${Math.max(30, height - 15)}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;