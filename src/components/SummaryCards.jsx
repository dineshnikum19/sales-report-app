import React from "react";

const iconPaths = {
  records:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  min: "M19 14l-7 7m0 0l-7-7m7 7V3",
  max: "M5 10l7-7m0 0l7 7m-7-7v18",
  slot: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
};

const SummaryCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Records",
      value: stats.totalRecords ?? 0,
      valueClass: "text-slate-800",
      icon: "records",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      label: "Min Amount",
      value: `$${stats.minAmount ?? "0.00"}`,
      valueClass: "text-red-600",
      icon: "min",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Max Amount",
      value: `$${stats.maxAmount ?? "0.00"}`,
      valueClass: "text-emerald-600",
      icon: "max",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`card p-4 sm:p-5 transition-all duration-200 ${
            card.colSpan ? "col-span-2 md:col-span-1" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="section-title mb-2 text-gray-500">{card.label}</p>
              <p
                className={`text-xl sm:text-2xl font-bold tabular-nums ${card.valueClass}`}
                title={card.title}
              >
                {card.value}
              </p>
            </div>
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg} ${card.iconColor}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={iconPaths[card.icon]}
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
