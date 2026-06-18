// src/app/blog/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const router = useRouter();
  const { slug } = useParams();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/blog/articles/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 401 || res.status === 403) {
        window.location.href = "http://localhost:3000/login";
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Article not found");

      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
      const isRecent = data.createdAt && new Date(data.createdAt).getTime() >= twoDaysAgo;
      if (!isRecent && !token) {
        window.location.href = "http://localhost:3000/login";
        return;
      }

      setBlog(data);
      setLikesCount(data.likesCount || 0);

      // Like state localStorage se check karo
      const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
      setLiked(likedArticles.includes(data.id));

      fetchComments(data.id);
    } catch (err) {
      setError(err.message || "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/blog/comments/${articleId}`);
      const data = await res.json();
      if (res.ok) setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Comments fetch error:", err);
    }
  };

  const handleLike = async () => {
    if (!token) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    const action = liked ? "unlike" : "like";
    try {
      const res = await fetch(`http://localhost:4000/api/blog/articles/${blog.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setLikesCount(data.likesCount);
        setLiked(data.liked);
        const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
        if (data.liked) {
          localStorage.setItem("likedArticles", JSON.stringify([...likedArticles, blog.id]));
        } else {
          localStorage.setItem("likedArticles", JSON.stringify(likedArticles.filter(id => id !== blog.id)));
        }
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!token) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/blog/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment, articleId: blog.id }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(blog.id);
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/blog/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchComments(blog.id);
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  // JWT se userId nikalo
  const getMyUserId = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split('.')[1]))?.id;
    } catch { return null; }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f8ff; font-family: 'DM Sans', sans-serif; }
        .blog-content img { max-width: 100%; border-radius: 12px; margin: 16px 0; }
        .blog-content p { margin-bottom: 16px; line-height: 1.8; color: #444; }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-family: 'Sora', sans-serif; margin: 24px 0 12px; color: #1e1e2e;
        }
        .blog-content ul, .blog-content ol { padding-left: 24px; margin-bottom: 16px; color: #444; }
        .blog-content li { margin-bottom: 8px; line-height: 1.7; }
        .blog-content blockquote {
          border-left: 4px solid #7c3aed; padding: 12px 20px; margin: 20px 0;
          background: #f5f3ff; border-radius: 0 8px 8px 0; color: #555; font-style: italic;
        }
        .blog-content a { color: #7c3aed; text-decoration: underline; }
        .blog-content code { background: #f1f0ff; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .blog-content pre {
          background: #1e1e2e; color: #cdd6f4; padding: 20px;
          border-radius: 12px; overflow-x: auto; margin: 16px 0;
        }
        .like-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; padding: 6px 12px; border-radius: 20px; transition: all 0.2s; }
        .like-btn:hover { background: #f5f3ff; }
        .like-btn.liked { color: #7c3aed; }
        .like-btn.unliked { color: #9ca3af; }
        .stat-item { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #6b7280; }
        .comment-box { background: #fff; border: 1px solid #f3f4f6; border-radius: 16px; padding: 20px; margin-bottom: 12px; }
        .comment-textarea { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #e5e7eb; font-size: 14px; font-family: 'DM Sans', sans-serif; resize: vertical; outline: none; transition: border-color 0.2s; }
        .comment-textarea:focus { border-color: #7c3aed; }
        .post-btn { background: #7c3aed; color: #fff; padding: 9px 22px; border-radius: 10px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .post-btn:hover { background: #6d28d9; }
        .post-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .delete-btn { background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 2px 6px; border-radius: 6px; }
        .delete-btn:hover { background: #fef2f2; }
      `}</style>

      <Navbar />

      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading article...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => router.push("/blog")} className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to Articles
            </button>
          </div>
        ) : blog ? (
          <>
            {/* Back */}
            <button
              onClick={() => router.push("/blog")}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm mb-8 flex items-center gap-1"
            >
              ← Back to Articles
            </button>

            {/* Category */}
            {blog.category && (
              <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                #{blog.category}
              </span>
            )}

            {/* Title */}
            <h1 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: "700", color: "#1e1e2e",
              lineHeight: "1.2", margin: "12px 0 20px",
            }}>
              {blog.title}
            </h1>

            {/* Author + Date */}
            <div className="flex items-center gap-3 mb-6">
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#7c3aed", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "14px",
              }}>
                {blog.author?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  {blog.author?.name || "Unknown"}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* ✅ Stats Bar — Views, Likes, Comments */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 0", marginBottom: "32px",
              borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6",
            }}>
              {/* Views */}
              <div className="stat-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{blog.views || 0} views</span>
              </div>

              <span style={{ color: "#e5e7eb" }}>•</span>

              {/* ❤️ Like Button */}
              <button
                onClick={handleLike}
                className={`like-btn ${liked ? "liked" : "unliked"}`}
              >
                <svg width="16" height="16"
                  fill={liked ? "#7c3aed" : "none"}
                  stroke={liked ? "#7c3aed" : "#9ca3af"}
                  strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span style={{ fontWeight: liked ? "600" : "400" }}>
                  {likesCount} {liked ? "Liked" : "Like"}
                </span>
              </button>

              <span style={{ color: "#e5e7eb" }}>•</span>

              {/* 💬 Comments count */}
              <div className="stat-item">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="w-full rounded-2xl overflow-hidden mb-10" style={{ maxHeight: "420px" }}>
                <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Blog Content */}
            <div
              className="blog-content"
              style={{ fontSize: "16px", lineHeight: "1.8", color: "#444" }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* ✅ Comments Section */}
            <div style={{ marginTop: "60px" }}>
              <h3 style={{
                fontFamily: "'Sora', sans-serif", fontSize: "22px",
                fontWeight: "700", color: "#1e1e2e", marginBottom: "24px",
              }}>
                💬 Comments ({comments.length})
              </h3>

              {/* Comment Input */}
              <div style={{ marginBottom: "32px" }}>
                <textarea
                  className="comment-textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={token ? "Comment" : "Comment karne ke liye login karein"}
                  disabled={!token}
                  rows={3}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                  {token ? (
                    <button
                      className="post-btn"
                      onClick={handleAddComment}
                      disabled={commentLoading || !newComment.trim()}
                    >
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </button>
                  ) : (
                    <button
                      className="post-btn"
                      onClick={() => window.location.href = "http://localhost:3000/login"}
                    >
                      Login to Comment
                    </button>
                  )}
                </div>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "32px 0" }}>
                  No comments right now. Comment first!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-box">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "50%",
                            background: "#7c3aed", display: "flex", alignItems: "center",
                            justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "700",
                          }}>
                            {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                              {comment.user?.name || "Unknown"}
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Sirf apna comment delete kar sako */}
                        {getMyUserId() === comment.user?.id && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            🗑 Delete
                          </button>
                        )}
                      </div>

                      <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.7", paddingLeft: "44px" }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}