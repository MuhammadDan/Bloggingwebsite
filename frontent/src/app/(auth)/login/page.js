// src/app/(auth)/login/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// ─── Zod Validation Schema ────────────────────────────────────────────────────
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ─── Simple Toast Component ───────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === "error" ? "#fee2e2" : "#dcfce7";
  const color = type === "error" ? "#dc2626" : "#16a34a";
  const border = type === "error" ? "#fca5a5" : "#86efac";
  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px", zIndex: 9999,
      backgroundColor: bg, color, border: `1px solid ${border}`,
      borderRadius: "10px", padding: "14px 20px", maxWidth: "340px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "14px", fontWeight: "500",
      display: "flex", alignItems: "center", gap: "10px"
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: "none", border: "none",
        cursor: "pointer", color, fontSize: "18px", lineHeight: 1
      }}>×</button>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        data
      );

      showToast(response.data.message || "Login successful!", "success");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      showToast(
        error.response?.data?.error || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="login-card" style={styles.card}>

        {/* Left: Form */}
        <div className="login-form-section" style={styles.formSection}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Please enter your details to log in</p>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="mike@timetoprogram.com"
                {...register("email")}
                style={styles.input}
              />
              {errors.email && (
                <span style={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 Characters"
                  {...register("password")}
                  style={{ ...styles.input, paddingRight: "46px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span style={styles.errorText}>{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.loginBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <p style={styles.signupText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={styles.signupLink}>
              SignUp
            </Link>
          </p>
        </div>

        {/* Right: Image */}
        <div className="login-image-section" style={styles.imageSection}>
          <img src="/login.png" alt="Login Visual" style={styles.sideImage} />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .login-card {
            flex-direction: column !important;
            max-width: 420px !important;
            min-height: auto !important;
          }
          .login-form-section {
            width: 100% !important;
            padding: 40px 28px !important;
          }
          .login-image-section {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "1100px",
    minHeight: "600px",
  },
  formSection: {
    width: "550px",
    flexShrink: 0,
    padding: "72px 56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 36px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "1px solid #dde1e7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #29abe2, #0d8fd1)",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "1px",
    border: "none",
    borderRadius: "8px",
    marginTop: "8px",
    transition: "opacity 0.2s",
  },
  signupText: {
    fontSize: "13px",
    color: "#555",
    marginTop: "20px",
  },
  signupLink: {
    color: "#29abe2",
    textDecoration: "none",
    fontWeight: "500",
  },
  errorText: {
    fontSize: "12px",
    color: "#dc2626",
    marginTop: "2px",
  },
  imageSection: {
    flex: 1,
    background: "linear-gradient(135deg, #e8f4fd 0%, #c9e8f8 40%, #ddd6f3 80%, #f5e6ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  sideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};