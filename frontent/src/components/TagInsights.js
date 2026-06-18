'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#38bdf8', '#60a5fa', '#93c5fd', '#bfdbfe', '#7dd3fc'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-sm">
        <span className="font-semibold text-slate-800">#{payload[0].name}</span>
        <span className="text-slate-500 ml-2">{payload[0].value} posts</span>
      </div>
    );
  }
  return null;
};

export default function TagInsights({ tagInsights }) {
  if (!tagInsights?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-center min-h-64">
        <p className="text-slate-400 text-sm">No tag data yet. Publish posts with tags!</p>
      </div>
    );
  }

  const top5 = tagInsights.slice(0, 5);
  const otherCount = tagInsights.slice(5).reduce((s, t) => s + t.count, 0);
  const chartData = [
    ...top5.map(t => ({ name: t.name, value: t.count })),
    ...(otherCount > 0 ? [{ name: 'Others', value: otherCount }] : []),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Tag Insights</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={86}
                dataKey="value"
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: pills + legend */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {tagInsights.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${COLORS[i % COLORS.length]}18`,
                  color: COLORS[i % COLORS.length],
                  borderColor: `${COLORS[i % COLORS.length]}35`,
                }}
              >
                #{tag.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}