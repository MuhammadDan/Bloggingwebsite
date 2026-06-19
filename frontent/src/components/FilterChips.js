// src/components/FilterChips.js
"use client";
import { useState } from "react";

const filters = ["All", "Technology", "Startup", "Lifestyle", "Finance", "AI"];

export default function FilterChips() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          style={{
            padding: "10px 24px",
            borderRadius: "30px",
            border: activeFilter === filter ? "none" : "1px solid #dde0f5",
            background: activeFilter === filter ? "#2155cd" : "#fff",
            color: activeFilter === filter ? "#fff" : "#555",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            fontWeight: activeFilter === filter ? "600" : "500",
            transition: "all 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}