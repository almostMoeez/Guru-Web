import React from "react";


const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img
        alt="A striking, close-up food photography shot of a decadent, creamy dessert or pasta dish, beautifully plated in a dark ceramic bowl. The lighting is moody and dramatic, highlighting the rich textures and golden hues of the food against the deep black background. The overall aesthetic is premium, indulgent, and modern luxury, evoking a high-end culinary experience."
        className="w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbj8grHqqsfFrwItYzuVwKqiSthQrqfdpm4IRGkbxdJ28zTMqyYZhy_bfN-qm5CTdwJA4czu_d07XZNXnyxxmAR0o-QNIDsvoxY-dt7rafDgVZWNYiDOMCoy_-6IKIfqAwK_pqn7qcmA9S5vJxixD4qD2Z5wL2Nr4Gygp4V0ZYq5B7I3KKEa6AGjj-oJP3XSr2Bo0-Mgvw4JNLojDrwzPxnht3aBLox7JwQYZ8se2zqxECGJ5lXMyDaoEM3dggllelwRSWlo7pK88"
      />
      <div className="absolute inset-0 hero-overlay"></div>
    </div>
    {/* Content */}
    <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="font-display-lg text-display-lg md:text-[80px] md:leading-[88px] text-on-surface mb-stack-sm">
        Brewed to <br />
        <span style={{ color: "#d4af37" }}>Perfection</span>
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-stack-lg mt-stack-md">
        Experience the finest blend of culinary passion, premium coffee, and sensational flavors right in the heart of Lahore. An ambiance designed for the discerning palate.
      </p>
      <div className="flex flex-col sm:flex-row gap-stack-md">
        <a className="text-on-primary font-label-caps text-label-caps px-8 py-4 rounded-full uppercase font-bold tracking-widest glow-button flex items-center justify-center" href="#menu" style={{ backgroundColor: "#d4af37", color: "#ffffff" }}>
          Explore Menu
        </a>
        <a className="bg-transparent border border-outline text-on-surface font-label-caps text-label-caps px-8 py-4 rounded-full uppercase font-bold tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 flex items-center justify-center" href="#about">
          Find Us
        </a>
      </div>
    </div>
    {/* Scroll indicator */}
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10 opacity-50">
      <span className="material-symbols-outlined" style={{ color: "#d4af37" }}>keyboard_arrow_down</span>
    </div>
  </section>
);

export default Hero;
