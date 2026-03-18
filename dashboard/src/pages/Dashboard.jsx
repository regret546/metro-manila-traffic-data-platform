import React, { useEffect } from "react";

import DashboardFilters from "../components/filters/DashboardFilters";
import SummaryCards from "../components/cards/SummaryCards";
import CityBarChart from "../components/charts/CityBarChart";
import IncidentsTrendChart from "../components/charts/IncidentsTrendChart";
import SeverityChart from "../components/charts/SeverityChart";
import WeatherBarChart from "../components/charts/WeatherBarChart";
import CausePieChart from "../components/charts/CausePieChart";
import IncidentHeatmap from "../components/map/IncidentHeatmap";
import DashboardLayout from "../components/layout/DashboardLayout";
import Header from "../components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { useDashboardData } from "../hooks/useDashboardData";

const Dashboard = () => {
  const { filters, setFilters, data, status, refresh } = useDashboardData();

  useEffect(() => {
    refresh(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <Header />

      <div className="mt-5">
        <Card>
          <CardContent className="pt-5">
            <DashboardFilters
              filters={filters}
              setFilters={setFilters}
              onApply={refresh}
              cityOptions={data.cityOptions}
            />
            {status.error ? (
              <div className="mt-3 text-sm text-[color:var(--color-accent-orange)] tracking-normal">
                {status.error}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <SummaryCards items={data.kpis} />
      </div>

      <div className="mt-4">
        <IncidentsTrendChart
          title="Incidents by Hour"
          data={data.timeSeries}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CityBarChart data={data.incidentsByCity} />
        <CausePieChart data={data.causeBreakdown} />
        <div className="lg:col-span-2">
          <SeverityChart data={data.severityBreakdown} />
        </div>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Incident Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <IncidentHeatmap hotspots={data.hotspots ?? []} />
            {(!data.hotspots || data.hotspots.length === 0) && (
              <div className="mt-2 text-sm text-fg/60 tracking-normal">
                No coordinates found for the selected filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WeatherBarChart data={data.weatherBreakdown} />
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Cause (Top)</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {data.causeBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="text-fg/70 tracking-normal">{c.name}</span>
                    <span className="text-fg/60 tracking-normal">{c.value?.toLocaleString?.() ?? c.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
