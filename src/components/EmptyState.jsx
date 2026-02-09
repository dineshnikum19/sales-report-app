import React from "react";

const EmptyState = () => {
  return (
    <div className="card flex flex-col items-center justify-center py-20 px-6 max-w-lg mx-auto bg-gradient-to-b from-white to-slate-50">
      <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-400 mb-6 ring-4 ring-blue-50">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">
        No Data Available
      </h3>
      <p className="text-slate-500 text-center text-sm">
        No data found in{" "}
        <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          data.json
        </span>
        . Add records to see the dashboard.
      </p>
    </div>
  );
};

export default EmptyState;
