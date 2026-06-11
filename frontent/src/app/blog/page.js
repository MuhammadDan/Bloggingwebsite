"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [tags, setTags] = useState(["All"]);

  const LIMIT = 12;
  const router = useRouter();

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Build tags dynamically from fetched blogs
  useEffect(() => {
    if (allBlogs.length > 0) {
      const uniqueTags = [
        "All",
        ...Array.from(
          new Set(
            allBlogs
              .map((b) => b.category)
              .filter(Boolean)
              .map((c) => c.trim())
          )
        ),
      ];
      setTags(uniqueTags);
    }
  }, [allBlogs]);

  // Filter by search + tag
  useEffect(() => {
    let filtered = allBlogs;

    if (activeTag !== "All") {
      filtered = filtered.filter(
        (b) => b.category?.trim().toLowerCase() === activeTag.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.author?.name?.toLowerCase().includes(q)
      );
    }

    setBlogs(filtered);
  }, [searchQuery, activeTag, allBlogs]);

  const fetchBlogs = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:4000/api/blog/articles?page=${pageNum}&limit=${LIMIT}`,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      const fetchedBlogs = Array.isArray(data.rows)
        ? data.rows
        : Array.isArray(data.data)
        ? data.data
        : data;

      setBlogs(fetchedBlogs);
      setAllBlogs(fetchedBlogs);
      setPage(pageNum);

      if (data.count || data.total) {
        const total = data.count || data.total;
        setTotalBlogs(total);
        setTotalPages(Math.ceil(total / LIMIT));
      } else if (fetchedBlogs.length < LIMIT) {
        setTotalPages(pageNum);
      }
    } catch (err) {
      setError("Unable to load articles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchBlogs(newPage);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f8ff; font-family: 'DM Sans', sans-serif; }
        .search-input:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        .blog-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .blog-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .tag-btn { transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
        .tag-btn:hover { border-color: #7c3aed !important; color: #7c3aed !important; }
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 40px;
        }
        @media (max-width: 640px) {
          .page-wrapper { padding: 0 16px !important; }
          .header-row { flex-direction: column; align-items: flex-start !important; gap: 4px; }
          .search-bar { height: 44px !important; font-size: 0.875rem !important; }
        }
      `}</style>

      <Navbar />

      <div
        className="page-wrapper"
        style={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <section style={{ width: "100%", paddingTop: "48px", paddingBottom: "80px" }}>

          {/* Header */}
          <div
            className="header-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "#111827" }}>
              All Articles
            </h2>
            {totalBlogs > 0 && (
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                {totalBlogs} articles
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <span style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)", color: "#9ca3af", fontSize: "1.1rem",
              pointerEvents: "none",
            }}>
              🔍
            </span>
            <input
              type="text"
              className="search-input search-bar"
              placeholder="Search by title, category, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: "52px",
                paddingLeft: "48px",
                paddingRight: "20px",
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                backgroundColor: "#fff",
                fontSize: "0.95rem",
                color: "#111827",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>

          {/* Tags Row */}
          <div className="tags-row">
            {tags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  className="tag-btn"
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    border: isActive ? "2px solid #2563eb" : "1.5px solid #e5e7eb",
                    backgroundColor: isActive ? "#2563eb" : "#fff",
                    color: isActive ? "#fff" : "#374151",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? "600" : "500",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
              Loading articles...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#f87171" }}>
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : activeTag !== "All"
                ? `No articles in "${activeTag}"`
                : "No articles found."}
            </div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "24px",
                marginBottom: "60px",
              }}>
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="blog-card"
                    onClick={() => router.push(`/blog/${blog.slug}`)}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #f3f4f6",
                      cursor: "pointer",
                    }}
                  >
                    {/* Image */}
                    <div style={{ width: "100%", height: "192px", backgroundColor: "#f3f4f6", overflow: "hidden" }}>
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.25rem", color: "#d1d5db" }}>
                          📝
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: "16px 20px" }}>
                      {blog.category && (
                        <span style={{ fontSize: "0.7rem", color: "#7c3aed", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          #{blog.category}
                        </span>
                      )}
                      <h3 style={{
                        fontSize: "0.9rem", fontWeight: "600", color: "#111827",
                        marginTop: "4px", marginBottom: "8px", lineHeight: "1.4",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {blog.title}
                      </h3>
                      <p style={{
                        fontSize: "0.75rem", color: "#6b7280", marginBottom: "16px",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {blog.content?.replace(/<[^>]+>/g, "").slice(0, 80)}...
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          backgroundColor: "#7c3aed", display: "flex", alignItems: "center",
                          justifyContent: "center", color: "#fff", fontSize: "0.75rem",
                          fontWeight: "700", flexShrink: 0,
                        }}>
                          {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", fontWeight: "500", color: "#374151" }}>
                            {blog.author?.name || "Unknown"}
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && !searchQuery && activeTag === "All" && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "48px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    style={{
                      padding: "8px 16px", border: "1.5px solid #e5e7eb",
                      borderRadius: "10px", backgroundColor: "#fff",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      opacity: page === 1 ? 0.4 : 1, fontSize: "0.875rem",
                    }}
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        fontWeight: "500", fontSize: "0.875rem", cursor: "pointer",
                        border: p === page ? "none" : "1.5px solid #e5e7eb",
                        backgroundColor: p === page ? "#7c3aed" : "#fff",
                        color: p === page ? "#fff" : "#374151",
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    style={{
                      padding: "8px 16px", border: "1.5px solid #e5e7eb",
                      borderRadius: "10px", backgroundColor: "#fff",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      opacity: page === totalPages ? 0.4 : 1, fontSize: "0.875rem",
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}