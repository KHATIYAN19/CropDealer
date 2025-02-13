
import React from 'react';

const DailyDataBoxes = () => {
  const dailyData = [
    { date: "2025-01-11", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-12", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-13", totalAmount: 100, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-14", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-15", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-16", totalAmount: 5500, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-17", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-18", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-19", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-20", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-21", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-22", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-23", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-24", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-25", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-26", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-27", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-28", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-29", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-30", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-01-31", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-01", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-02", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-03", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-04", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-05", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-06", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-07", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-08", totalAmount: 8, totalQuantity: 2, totalRequests: 2, totalAccepts: 1, totalRejects: 0 },
    { date: "2025-02-09", totalAmount: 0, totalQuantity: 0, totalRequests: 2, totalAccepts: 1, totalRejects: 0 }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Last 30Days Sales</h1>

      {/* Grid of Boxes */}
      <div className=" sm:w-[40%]  mx-auto bg-white shadow-lg p-10 rounded-lg grid grid-cols-7 gap-1 mb-8">
        {dailyData.map((data, index) => {
          const opacity = data.totalAmount > 0 ? Math.min(data.totalAmount / 100, 1) : 0;
           
          return (
            <div
              key={index}
              className="relative flex justify-center items-center cursor-pointer transition-all border-black border-2 text-black  transform hover:scale-105 rounded-md shadow-md"
              style={{
                backgroundColor: `rgba(34, 197, 94, ${opacity})`,
                color:`black`,
                width: "2.5rem",
                height: "2.5rem"
              }}
              title={`Date: ${data.date}\nTotal Amount: $${data.totalAmount}`}
            >
              <span className="text-white text-xs font-bold">{data.totalAmount > 0 ? data.totalAmount :0}</span>
            </div>
          );
        })}
      </div>

      {/* Table of Data */}
      <table className="table-auto w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Total Amount</th>
            <th className="px-4 py-2 border">Total Quantity</th>
            <th className="px-4 py-2 border">Total Requests</th>
            <th className="px-4 py-2 border">Total Accepts</th>
            <th className="px-4 py-2 border">Total Rejects</th>
          </tr>
        </thead>
        <tbody>
          {dailyData.map((data, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{data.date}</td>
              <td className="px-4 py-2 border">${data.totalAmount}</td>
              <td className="px-4 py-2 border">{data.totalQuantity}</td>
              <td className="px-4 py-2 border">{data.totalRequests}</td>
              <td className="px-4 py-2 border">{data.totalAccepts}</td>
              <td className="px-4 py-2 border">{data.totalRejects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyDataBoxes;
