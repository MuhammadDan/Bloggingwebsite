"use client";
import { useState } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <div
        className="searchbar-wrapper"
        style={{
          display: "flex",
          maxWidth: "520px",
          width: "100%",
          margin: "0 auto 40px",
          background: "#fff",
          border: "1px solid #dde0f5",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 6px 25px rgba(33, 85, 205, 0.10)",
        }}
      >
        <input
          type="text"
          placeholder="Search for blogs, topics, or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            minWidth: 0,          /* prevents overflow in flex container */
            border: "none",
            outline: "none",
            padding: "18px 16px",
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            background: "transparent",
            color: "#333",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            flexShrink: 0,        /* never squish the button */
            width: "100px",       /* fixed width — text stays centered always */
            background: "#2155cd",
            color: "#fff",
            border: "none",
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#1740a8")}
          onMouseLeave={(e) => (e.target.style.background = "#2155cd")}
        >
          Search
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .searchbar-wrapper {
            margin-left: 16px !important;
            margin-right: 16px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}