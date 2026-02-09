import React from "react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg
        className="w-24 h-24 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-xl font-medium text-gray-600 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-500">No data found in data.json file</p>
    </div>
  );
};

export default EmptyState;
