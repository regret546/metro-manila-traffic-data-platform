import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <div className="mb-1 text-xs font-medium text-fg/70 tracking-normal">{label}</div>
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
    </div>
  );
}

function SearchableSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    const measure = () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setPanelPos({
        top: r.bottom + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    const onDocMouseDown = (e) => {
      const el = rootRef.current;
      const panelEl = panelRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      if (panelEl && panelEl.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [open]);

  return (
    <div className="flex flex-col" ref={rootRef}>
      <div className="mb-1 text-xs font-medium text-fg/70 tracking-normal">{label}</div>

      <button
        type="button"
        ref={buttonRef}
        className={[
          "w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-fg shadow-sm",
          "flex items-center justify-between gap-2",
          "focus:outline-none focus:ring-4 focus:ring-primary/10",
        ].join(" ")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">
          {selected?.label ?? "All"}
        </span>
        <span className="text-fg/60">▾</span>
      </button>

      {open
        ? createPortal(
            <div
              ref={panelRef}
              className="rounded-lg border border-border bg-base shadow-lg"
              style={{
                position: "absolute",
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
                zIndex: 200000,
              }}
            >
              <div className="p-2">
                <input
                  className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-fg outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingLeft: 4,
                  paddingRight: 4,
                  paddingBottom: 8,
                  touchAction: "pan-y",
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {filtered.length ? (
                  filtered.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={[
                        "w-full rounded-md px-3 py-2 text-left text-sm",
                        opt.value === value ? "bg-primary/15 text-fg" : "hover:bg-fg/5 text-fg",
                      ].join(" ")}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                        onChange(opt.value);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-fg/60">No results</div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export default function DashboardFilters({ filters, setFilters, onApply, cityOptions = [] }) {
  const presets = [
    {
      id: "all-2025",
      label: "All 2025",
      dateRange: "January 1, 2025 — December 31, 2025",
    },
    {
      id: "q1-2025",
      label: "Q1 2025 (Jan–Mar)",
      dateRange: "January 1, 2025 — March 31, 2025",
    },
    {
      id: "q2-2025",
      label: "Q2 2025 (Apr–Jun)",
      dateRange: "April 1, 2025 — June 30, 2025",
    },
    {
      id: "q3-2025",
      label: "Q3 2025 (Jul–Sep)",
      dateRange: "July 1, 2025 — September 30, 2025",
    },
    {
      id: "q4-2025",
      label: "Q4 2025 (Oct–Dec)",
      dateRange: "October 1, 2025 — December 31, 2025",
    },
  ];

  const currentPreset =
    presets.find((p) => p.dateRange === filters.dateRange)?.id ?? "all-2025";

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SearchableSelect
        label="City"
        value={filters.city}
        onChange={(city) => {
          const next = { ...filters, city };
          setFilters(next);
          onApply(next);
        }}
        options={[
          { value: "all", label: "All" },
          ...Array.from(new Set((Array.isArray(cityOptions) ? cityOptions : []).filter(Boolean))).map((c) => ({
            value: c,
            label: c,
          })),
        ]}
      />

      <FilterSelect
        label="Severity"
        value={filters.severity}
        onChange={(severity) => {
          const next = { ...filters, severity };
          setFilters(next);
          onApply(next);
        }}
        options={[
          { value: "all", label: "All" },
          { value: "minor", label: "Minor" },
          { value: "major", label: "Major" },
          { value: "fatal", label: "Fatal" },
          { value: "unknown", label: "Unknown" },
        ]}
      />

      <FilterSelect
        label="Weather"
        value={filters.weather}
        onChange={(weather) => {
          const next = { ...filters, weather };
          setFilters(next);
          onApply(next);
        }}
        options={[
          { value: "all", label: "All" },
          { value: "clear", label: "Clear" },
          { value: "rain", label: "Rain" },
          { value: "fog", label: "Fog" },
        ]}
      />

      <FilterSelect
        label="Timeframe"
        value={currentPreset}
        onChange={(presetId) => {
          const preset = presets.find((p) => p.id === presetId);
          if (!preset || !preset.dateRange) return;
          const next = { ...filters, dateRange: preset.dateRange };
          setFilters(next);
          onApply(next);
        }}
        options={presets.map((p) => ({ value: p.id, label: p.label }))}
      />
    </div>
  );
}
