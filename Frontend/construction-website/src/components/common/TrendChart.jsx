import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function TrendChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            type: "line",
            label: "Revenue",
            data: data.map(d => d.revenue),
            borderColor: "#378ADD",
            backgroundColor: "rgba(55,138,221,0.08)",
            borderWidth: 2,
            pointBackgroundColor: "#378ADD",
            pointRadius: 4,
            fill: true,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Bookings",
            data: data.map(d => d.bookings),
            backgroundColor: "rgba(29,158,117,0.25)",
            borderColor: "#1D9E75",
            borderWidth: 1.5,
            borderRadius: 4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.label === "Revenue") {
                  const v = ctx.raw;
                  if (v >= 1_000_000) return ` Revenue: Rs. ${(v / 1_000_000).toFixed(1)}M`;
                  if (v >= 1_000)     return ` Revenue: Rs. ${(v / 1_000).toFixed(0)}K`;
                  return ` Revenue: Rs. ${v}`;
                }
                return ` Bookings: ${ctx.raw}`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: "#888" } },
          y: {
            position: "left",
            ticks: {
              color: "#378ADD",
              callback: v => v >= 1_000_000 ? `Rs.${(v/1_000_000).toFixed(1)}M` : `Rs.${(v/1_000).toFixed(0)}K`,
            },
          },
          y1: {
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: { color: "#1D9E75", stepSize: 1 },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  if (!data?.length) return (
    <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
      No trend data available.
    </div>
  );

  return (
    <div>
      <div className="flex gap-4 mb-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{background:"#378ADD"}}/>Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{background:"#1D9E75"}}/>Bookings
        </span>
      </div>
      <div className="relative h-48">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}