// src/app/page.js
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import LatestBlogs from "../components/LatestBlog";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background: #f8f8ff; 
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <Navbar />
      <HeroSection />

      <div style={{
        maxWidth: "1024px",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}>
        <LatestBlogs />
      </div>
    </>
  );
}