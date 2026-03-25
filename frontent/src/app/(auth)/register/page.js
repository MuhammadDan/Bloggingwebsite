"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// ─── Zod Validation Schema ───────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  adminToken: z.string().optional(),
});

// ─── Simple Toast Component ──────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === "error" ? "#fee2e2" : "#dcfce7";
  const color = type === "error" ? "#dc2626" : "#16a34a";
  const border = type === "error" ? "#fca5a5" : "#86efac";
  return (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999,
      backgroundColor: bg, color, border: `1px solid ${border}`,
      borderRadius: "10px", padding: "14px 20px", maxWidth: "340px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "14px", fontWeight: "500",
      display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none",
        cursor: "pointer", color, fontSize: "18px", lineHeight: 1 }}>×</button>
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const fileInputRef = useRef(null);

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
    defaultValues: { name: "", email: "", password: "", adminToken: "" },
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ─── Cloudinary Upload ───────────────────────────────────────────────────────
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_app_present");
    formData.append("folder", "blog_app/avatars");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url; // ✅ Cloudinary URL return hoga
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = null;

      // Agar image select ki hai toh pehle Cloudinary pe upload karo
      if (avatarFile) {
        setImageUploading(true);
        imageUrl = await uploadToCloudinary(avatarFile);
        setImageUploading(false);
      }

      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        { ...data, imageUrl }  // ✅ imageUrl backend ko bhejo
      );

      showToast(response.data.message || "Account created!", "success");

      if (response.data.tempToken) {
        localStorage.setItem("tempToken", response.data.tempToken);
        localStorage.setItem("emailForVerify", data.email);
        window.location.href = "/verifyotp";
      }
    } catch (error) {
      setImageUploading(false);
      showToast(
        error.response?.data?.error || error.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      {/* Main card */}
      <div style={styles.card}>
        {/* Left: Form */}
        <div style={styles.formSection}>
          <h2 style={styles.title}>Create an Account</h2>
          <p style={styles.subtitle}>Join us today by entering your details below.</p>

          {/* Avatar Upload */}
          <div style={styles.avatarWrapper}>
            <div style={styles.avatarCircle} onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" style={styles.avatarImg} />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#60b8f5" />
                  <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#60b8f5" />
                </svg>
              )}
            </div>
            <button
              type="button"
              style={styles.uploadBtn}
              onClick={handleAvatarClick}
              aria-label="Upload avatar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            {/* Row 1 */}
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John"
                  {...register("name")}
                  style={styles.input}
                />
                {errors.name && (
                  <span style={styles.errorText}>{errors.name.message}</span>
                )}
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  style={styles.input}
                />
                {errors.email && (
                  <span style={styles.errorText}>{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 Characters"
                    {...register("password")}
                    style={{ ...styles.input, paddingRight: "42px" }}
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

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Admin Invite Token</label>
                <input
                  type="number"
                  placeholder="6 Digit Code"
                  {...register("adminToken")}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                ...styles.signupBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {imageUploading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Uploading Image...
                </span>
              ) : loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </p>
        </div>

        {/* Right: Image panel */}
        <div style={styles.imageSection}>
          <img src="/Signup.png" alt="Signup Visual" style={styles.sideImage} />
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
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
    flex: 1,
    padding: "52px 52px 40px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#666",
    margin: "0 0 20px",
  },
  avatarWrapper: {
    position: "relative",
    width: "64px",
    marginBottom: "24px",
  },
  avatarCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#dff0fc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    border: "2px solid #b3ddf9",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  uploadBtn: {
    position: "absolute",
    bottom: "0",
    right: "-4px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "#29abe2",
    border: "2px solid white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    transform: "rotate(-90deg)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: 1,
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  fieldGroup: {
    flex: 1,
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
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
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  signupBtn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(90deg, #29abe2, #0d8fd1)",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "1px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.2s",
  },
  loginText: {
    fontSize: "13px",
    color: "#555",
    marginTop: "16px",
    textAlign: "left",
  },
  loginLink: {
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
    width: "420px",
    background: "linear-gradient(135deg, #e8f4fd 0%, #c9e8f8 40%, #ddd6f3 80%, #f5e6ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },
  sideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};