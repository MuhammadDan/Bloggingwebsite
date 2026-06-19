// src/components/LatestBlogs.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LatestBlogs() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:4000/api/blog/articles", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        let blogs = [];
        if (Array.isArray(data)) blogs = data;
        else if (data && Array.isArray(data.rows)) blogs = data.rows;
        else if (data && Array.isArray(data.data)) blogs = data.data;

        const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
        const recent = blogs.filter((b) => {
          try { return new Date(b.createdAt).getTime() >= twoDaysAgo; }
          catch (e) { return false; }
        });
        setLatestBlogs(recent.slice(0, 8));
      } else {
        throw new Error(data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Unable to load blogs from server");
      setLatestBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ width: "100%", paddingTop: "32px", paddingBottom: "80px" }}>
      
      {/* Header — stacked, centered */}
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
          Latest Articles
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "24px" }}>
          Discover our most recent stories and updates
        </p>
        <Link
          href="/dashboard/articles/new"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "#fff",
            backgroundColor: "#2563eb",
            fontSize: "0.875rem",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          + Write new post
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
          Loading latest stories...
        </div>
      ) : latestBlogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
          No recent articles found.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {latestBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => router.push(`/blog/${blog.slug}`)}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: "#7c3aed", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#fff", fontSize: "0.75rem",
                    fontWeight: "700", flexShrink: 0,
                  }}>
                    {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                    {blog.author?.name || "Unknown"}
                  </p>
                </div>

                <h3 style={{
                  fontSize: "1rem", fontWeight: "700", color: "#111827",
                  marginBottom: "8px", lineHeight: "1.4",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {blog.title}
                </h3>

                {blog.category && (
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>
                    {blog.category}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#9ca3af", marginTop: "12px" }}>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                  <span>12 min to read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Articles */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "64px", marginBottom: "32px" }}>
        <button
          onClick={() => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
              if (typeof window !== "undefined") window.location.href = "http://localhost:3000/login";
              else router.push("/login");
              return;
            }
            router.push("/blog?showAll=1");
          }}
          style={{
            padding: "10px 24px",
            backgroundColor: "#111827",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: "500",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
          }}
        >
          View all articles
        </button>
      </div>

      {error && <p style={{ textAlign: "center", color: "#d97706", marginTop: "24px" }}>{error}</p>}
    </section>
  );
}