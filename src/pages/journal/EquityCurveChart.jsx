export default function EquityCurveChart({ data }) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 100;
  const height = 100;
  const barGap = 0.6;
  const barWidth = width / data.length - barGap;

  return (
    <div className="equity-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="equity-chart-svg">
        {data.map((point, i) => {
          const barHeight = ((point.value - min) / range) * (height - 4);
          const x = i * (width / data.length) + barGap / 2;
          const y = height - barHeight;
          const isUp = i === 0 || point.value >= data[i - 1].value;
          return (
            <rect
              key={point.label}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 0.5)}
              className={isUp ? 'bar-positive' : 'bar-negative'}
            >
              <title>{`${point.label}: ${point.value.toLocaleString()}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="equity-chart-labels">
        <span>{data[0].label}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
