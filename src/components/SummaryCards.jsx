import React from "react";
import { formatHourRangeToAMPM } from "../utils/dataProcessing";

const SummaryCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Total Records
        </p>
        <p className="text-2xl font-bold text-gray-800">
          {stats.totalRecords || 0}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Min Amount
        </p>
        <p className="text-2xl font-bold text-red-600">
          ${stats.minAmount || "0.00"}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Max Amount
        </p>
        <p className="text-2xl font-bold text-green-600">
          ${stats.maxAmount || "0.00"}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 col-span-2 md:col-span-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Lowest Slot
        </p>
        <p
          className="text-sm font-semibold text-orange-600 truncate"
          title={stats.lowestSlot}
        >
          {stats.lowestSlot || "-"}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
