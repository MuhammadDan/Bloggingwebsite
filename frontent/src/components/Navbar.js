"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("User data parse error");
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          height: "80px",
          background: "#ffffff",
          borderBottom: "1px solid #e8e8f0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Image
          src="/BlogOverflow_logo-removebg.png"
          alt="Blogoverflow"
          width={200}
          height={50}
          style={{ objectFit: "contain", cursor: "pointer" }}
          onClick={() => router.push("/")}
          priority
        />

        {/* Desktop right side — hidden on mobile */}
        <div ref={dropdownRef} style={{ position: "relative" }} className="navbar-desktop-right">
          {user ? (
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "30px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: "40px", height: "40px" }}>
                <img
                  src={
                    user.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=2155cd&color=fff&size=40`
                  }
                  alt={user.name || "User"}
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=2155cd&color=fff&size=40`;
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e1e2e", fontFamily: "'DM Sans', sans-serif" }}>
                  {user.name || "User"}
                </span>
                <span style={{ fontSize: "18px", color: "#666" }}>▼</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "#2155cd", color: "#fff",
                border: "none", borderRadius: "30px",
                padding: "12px 32px", fontSize: "15px",
                fontWeight: "600", cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#1740a8")}
              onMouseLeave={(e) => (e.target.style.background = "#2155cd")}
            >
              Login →
            </button>
          )}

          {user && showDropdown && (
            <div style={{
              position: "absolute", top: "58px", right: "0",
              background: "#fff", border: "1px solid #ddd",
              borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              width: "160px", overflow: "hidden", zIndex: 200,
            }}>
              {/* Dashboard */}
              <div
                onClick={() => { router.push("/dashboard"); setShowDropdown(false); }}
                style={{ padding: "14px 20px", color: "#1e1e2e", cursor: "pointer", fontWeight: "500", borderBottom: "1px solid #f0f0f8" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Dashboard
              </div>
              {/* Logout */}
              <div
                onClick={handleLogout}
                style={{ padding: "14px 20px", color: "#e74c3c", cursor: "pointer", fontWeight: "500" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Logout
              </div>
            </div>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: "block", width: "22px", height: "2px", background: "#1e1e2e", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "#1e1e2e", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "#1e1e2e", borderRadius: "2px" }} />
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-drawer"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "12px",
            background: "#fff",
            borderBottom: "1px solid #e8e8f0",
            padding: "16px 24px",
          }}
        >
          {user ? (
            <>
              {/* User info row */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid #f0f0f8" }}>
                <img
                  src={
                    user.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=2155cd&color=fff&size=40`
                  }
                  alt={user.name || "User"}
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=2155cd&color=fff&size=40`;
                  }}
                />
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e1e2e", fontFamily: "'DM Sans', sans-serif" }}>
                  {user.name || "User"}
                </span>
              </div>
              {/* Dashboard button */}
              <button
                onClick={() => { router.push("/dashboard"); setMobileMenuOpen(false); }}
                style={{
                  width: "100%", background: "#f8f9ff", color: "#1e1e2e",
                  border: "1px solid #e8e8f0", borderRadius: "12px",
                  padding: "13px", fontSize: "15px", fontWeight: "600",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Dashboard
              </button>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", background: "#fff5f5", color: "#e74c3c",
                  border: "1px solid #fde0e0", borderRadius: "12px",
                  padding: "13px", fontSize: "15px", fontWeight: "600",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { router.push("/login"); setMobileMenuOpen(false); }}
              style={{
                width: "100%", background: "#2155cd", color: "#fff",
                border: "none", borderRadius: "12px",
                padding: "13px", fontSize: "15px", fontWeight: "600",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Login →
            </button>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .navbar-desktop-right { display: none !important; }
          .navbar-hamburger     { display: flex !important; }
          .navbar-mobile-drawer { display: flex !important; }
          nav { padding: 18px 20px !important; }
        }
      `}</style>
    </>
  );
}