import React from "react";



const Navbar = () => (
  <nav className="fixed w-full z-50 bg-[#121416] border-b border-outline-variant/20 transition-all duration-300" id="main-nav">
    <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-stack-sm w-full max-w-container-max mx-auto">
      {/* Left: Logo */}
      <div className="flex-shrink-0 flex items-center min-w-[120px]">
        <a href="#" className="flex items-center">
          <img alt="Guru" className="h-10 w-auto max-h-12 max-w-[120px] object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATtaCVuhL0veo7LQ5nKfUwWWkFuYN9Fbox7t72gEGvJnFYdlYvIy2sDUwJwicwk_C5iU-rDU0NFGAlFHjo-ax2_ZpgqdJNFE0GZI_mg7UbtuWvetFxyZEYhsWa4hXhEegC5LPOZQHo6CrB-jqmgd9JyQDXH2r6hDmWUJRoRZwxXMl2T30oPYXRjUVIo92uMZ67vb1Gsm3HaMrXvbVD9EI5qqJVq9C-T7GqwGFVP0TPUxMtffnFCD-9641x9VRHeXee22IO-BWpJ7g" />
        </a>
      </div>
      {/* Center: Nav Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-10">
          <a className="font-label-caps text-label-caps font-bold uppercase text-[#c89384] border-b-2 border-[#c89384] pb-1" href="#">HOME</a>
          <a className="font-label-caps text-label-caps uppercase text-[#bfa399] hover:text-[#c89384] transition-colors pb-1" href="#menu">MENU</a>
          <a className="font-label-caps text-label-caps uppercase text-[#bfa399] hover:text-[#c89384] transition-colors pb-1" href="#about">OUR STORY</a>
        </div>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-6 min-w-[180px] justify-end">
        <button aria-label="Cart" className="flex items-center justify-center p-0 bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none">
          <span className="material-symbols-outlined text-[2rem]" style={{color: "#c89384", fontVariationSettings: "'FILL' 0", background: "none", border: "none"}}>shopping_cart</span>
        </button>
        <a className="inline-flex font-label-caps text-label-caps px-8 py-3 rounded-full uppercase font-bold items-center gap-2" href="#order" style={{background: "#c89384", color: "#fff", boxShadow: "0 0 24px 0 #c8938433"}}>
          ORDER NOW
        </a>
        {/* Mobile Menu Toggle */}
        <button aria-label="Menu" className="block lg:hidden text-on-surface-variant hover:text-[#c89384] transition-colors" id="mobile-menu-btn">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
