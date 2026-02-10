import React from "react";

const iconPaths = {
  records:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  min: "M19 14l-7 7m0 0l-7-7m7 7V3",
  max: "M5 10l7-7m0 0l7 7m-7-7v18",
  avg: "M3 10h4l3-7 4 14 3-7h4",
  slot: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
};

const SummaryCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Records",
      value: stats.totalRecords ?? 0,
      icon: "records",
      gradient: "from-slate-500 to-slate-700",
      iconBg: "bg-white/20",
    },
    {
      label: "Avg Amount",
      value: `$${stats.avgAmount ?? "0.00"}`,
      icon: "avg",
      gradient: "from-blue-500 to-blue-700",
      iconBg: "bg-white/20",
    },
    {
      label: "Min Amount",
      value: `$${stats.minAmount ?? "0.00"}`,
      icon: "min",
      gradient: "from-rose-500 to-red-600",
      iconBg: "bg-white/20",
    },
    {
      label: "Max Amount",
      value: `$${stats.maxAmount ?? "0.00"}`,
      icon: "max",
      gradient: "from-emerald-500 to-emerald-700",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${card.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
                {card.label}
              </p>
              <p
                className={`font-bold tabular-nums text-white ${
                  card.smallText
                    ? "text-sm sm:text-base leading-tight"
                    : "text-xl sm:text-2xl"
                }`}
                title={String(card.value)}
              >
                {card.value}
              </p>
            </div>
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}
            >
              <svg
                className="w-5 h-5 text-white"
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
