// src/components/BlogCard.js
"use client";

import { useRouter } from "next/navigation";

export default function BlogCard({ blog }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    const isRecent =
      blog?.createdAt && new Date(blog.createdAt).getTime() >= twoDaysAgo;

    if (!isRecent && !token) {
      if (typeof window !== "undefined")
        window.location.href = "http://localhost:3000/login";
      else router.push("/login");
      return;
    }

    router.push(`/blog/${blog.slug}`);
  };

  return (
    <a
      onClick={handleClick}
      href={`/blog/${blog.slug}`}
      className="group block mx-auto max-w-lg w-full"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={blog.featuredImage || blog.image || "/placeholder.jpg"}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #Blog
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold leading-tight mb-3 text-gray-900 group-hover:text-blue-600 transition">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-3 mb-6 text-[15px]">
            {blog.content?.substring(0, 160)}...
          </p>

          {/* Author & Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {blog.author?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-medium text-sm">
                {blog.author?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
