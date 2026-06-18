const GRADIENTS = [
  'from-purple-400 to-pink-500',
  'from-blue-400 to-cyan-500',
  'from-indigo-400 to-purple-500',
];

export default function TopPosts({ topPosts }) {
  if (!topPosts?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-center min-h-64">
        <p className="text-slate-400 text-sm">No posts yet. Start writing!</p>
      </div>
    );
  }

  const maxViews = Math.max(...topPosts.map(p => p.views ?? 0), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
      <h2 className="text-base font-semibold text-gray-900 mb-5">Top Posts</h2>

      <div className="space-y-5">
        {topPosts.slice(0, 3).map((post, i) => {
          const viewPct = Math.max(Math.round(((post.views ?? 0) / maxViews) * 100), 4);
          return (
            <div key={post.id ?? i} className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} shrink-0 flex items-center justify-center text-white font-bold text-sm`}>
                {post.title?.charAt(0)?.toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug no-underline block"
                >
                  {post.title}
                </a>

                {/* Progress bar */}
                <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: `${viewPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-400">{(post.views ?? 0).toLocaleString()} views</span>
                  <span className="text-xs text-gray-400">♡ {post.likes ?? 0} likes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}