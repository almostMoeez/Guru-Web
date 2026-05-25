import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      <Navbar />
      <Hero />
      {/* Floating Action Button (Mobile Only) */}
      <a
        aria-label="Order Now"
        className="md:hidden fixed bottom-6 right-6 z-40 text-on-primary p-4 rounded-full shadow-lg glow-button flex items-center justify-center"
        href="#order"
        style={{ backgroundColor: "#d4af37", color: "#ffffff" }}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          restaurant_menu
        </span>
      </a>
      <Footer />
    </div>
  );
};

export default Home;
