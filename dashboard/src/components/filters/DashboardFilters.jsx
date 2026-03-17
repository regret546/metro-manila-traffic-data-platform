import React from "react";

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="min-w-[180px]">
      <div className="sr-only">{label}</div>
      <select
        className={[
          "w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-fg",
          "shadow-sm outline-none ring-0",
          "focus:border-primary/60 focus:ring-4 focus:ring-primary/10",
        ].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function DashboardFilters({ filters, setFilters, onApply }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSelect
        label="City"
        value={filters.city}
        onChange={(city) => setFilters((s) => ({ ...s, city }))}
        options={[
          { value: "all", label: "City" },
          { value: "quezon-city", label: "Quezon City" },
          { value: "manila", label: "Manila" },
          { value: "caloocan", label: "Caloocan" },
          { value: "makati", label: "Makati" },
          { value: "pasig", label: "Pasig" },
        ]}
      />

      <FilterSelect
        label="Severity"
        value={filters.severity}
        onChange={(severity) => setFilters((s) => ({ ...s, severity }))}
        options={[
          { value: "all", label: "Severity" },
          { value: "minor", label: "Minor" },
          { value: "serious", label: "Serious" },
          { value: "fatal", label: "Fatal" },
        ]}
      />

      <FilterSelect
        label="Weather"
        value={filters.weather}
        onChange={(weather) => setFilters((s) => ({ ...s, weather }))}
        options={[
          { value: "all", label: "Weather" },
          { value: "clear", label: "Clear" },
          { value: "rain", label: "Rain" },
          { value: "fog", label: "Fog" },
        ]}
      />

      <div className="flex items-center gap-2 rounded-lg border border-border bg-base px-3 py-2 shadow-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3v3M17 3v3M4 8h16M6 12h4M6 16h4M14 12h4M14 16h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <input
          className="w-[280px] bg-transparent text-sm text-fg outline-none placeholder:text-fg/40 sm:w-[320px] md:w-[380px]"
          type="text"
          value={filters.dateRange}
          onChange={(e) => setFilters((s) => ({ ...s, dateRange: e.target.value }))}
          placeholder="March 21, 2025 — March 22, 2026"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="min-w-[140px]">
          <div className="sr-only">Days</div>
          <select
            className={[
              "w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-fg",
              "shadow-sm outline-none ring-0",
              "focus:border-primary/60 focus:ring-4 focus:ring-primary/10",
            ].join(" ")}
            value={filters.days}
            onChange={(e) => setFilters((s) => ({ ...s, days: e.target.value }))}
          >
            <option value="7">Days: 7</option>
            <option value="14">Days: 14</option>
            <option value="30">Days: 30</option>
            <option value="90">Days: 90</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onApply}
          className={[
            "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm",
            "hover:brightness-95 active:brightness-90",
          ].join(" ")}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
