export default function StatsCards({ data }) {
  const stats = [
    { label: 'Total Posts', value: data?.totalPosts ?? 0 },
    { label: 'Published', value: data?.publishedPosts ?? 0 },
    { label: 'Total Views', value: data?.totalViews ?? 0 },
    { label: 'Total Likes', value: data?.totalLikes ?? 0 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-6 py-5 ${
              i < 3 ? 'border-r border-slate-100' : ''
            } ${i < 2 ? 'border-b border-slate-100 md:border-b-0' : ''}`}
          >
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                {value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}