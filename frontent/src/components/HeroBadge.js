// src/component/HeroBadge.js
export default function HeroBadge() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "#fff",
        border: "1px solid #d6d8f5",
        borderRadius: "24px",
        padding: "7px 18px",
        fontSize: "13px",
        color: "#534ab7",
        marginBottom: "28px",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          background: "#534ab7",
          borderRadius: "50%",
          display: "inline-block",
        }}
      />
      New: AI feature integrated ✦
    </div>
  );
}