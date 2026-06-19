// src/components/HeroSection.js
import HeroBadge from "./HeroBadge";
import SearchBar from "./SearchBar";
import FilterChips from "./FilterChips";

export default function HeroSection() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 24px 80px",     // zyada padding top
        background:
          "linear-gradient(160deg, #f0f2ff 0%, #f8f0ff 50%, #f0f8ff 100%)",
        minHeight: "calc(100vh - 80px)", // navbar height ke hisaab se
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HeroBadge />

      <h1
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "clamp(38px, 6vw, 62px)",   // bada heading
          fontWeight: "700",
          color: "#1e1e2e",
          lineHeight: "1.15",
          marginBottom: "24px",
        }}
      >
        Your own <span style={{ color: "#2155cd" }}>blogging</span>
        <br />
        platform.
      </h1>

      <p
        style={{
          fontSize: "17px",                    // text bada kiya
          color: "#555",
          maxWidth: "560px",
          lineHeight: "1.75",
          marginBottom: "48px",
        }}
      >
        This is your space to think out loud, to share what matters, and to
        write without filters. Whether it&apos;s one word or a thousand, your story
        starts right here.
      </p>

      <SearchBar />
      <FilterChips />
    </div>
  );
}