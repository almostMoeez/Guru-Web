import React from "react";


const Footer = () => (
  <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant mt-24 relative z-10">
    <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-lg gap-stack-md">
      <div className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tighter">
        <img alt="Guru" className="h-12 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxnJAVvvCK08_wMqXoPms_U2kQTS8toPKffgSg9cg090rE8rXcGtjlksy1yS6DrvnPoLE56SUVlTucGcH8J_A7fqPt3qn0hmv8BdXhYjFuPRXnOFSsGXKZk33kFRewBAIaMUMKRFJE9yagrhivjF-mR9i8pPpPeIm-9E4KyD061upAW0-1YhKwqMfJrs8QnnPJa2KWKG0NWe4OEwUaE-rRywcKpIfPTqh_QnjIPW0tatZA6XUTGRBbWiUo12qxg93GOfR7e6fIO6Q" />
      </div>
      <div className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
        © 2024 GURU. ALL RIGHTS RESERVED.
      </div>
      <div className="flex gap-stack-md font-body-md text-body-md">
        <a className="text-on-surface-variant hover:text-[#d4af37] transition-colors" href="#">Privacy Policy</a>
        <a className="text-on-surface-variant hover:text-[#d4af37] transition-colors" href="#">Terms of Service</a>
        <a className="text-on-surface-variant hover:text-[#d4af37] transition-colors" href="#">Contact Us</a>
      </div>
    </div>
  </footer>
);

export default Footer;
