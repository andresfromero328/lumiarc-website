"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { href: "what-is-lumiarc", label: "LumiArc" },
  { href: "pillars", label: "Pillars" },
  { href: "why-lumiarc", label: "Benefits" },
  { href: "pricing", label: "Pricing" },
  { href: "about", label: "About" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      // 1. Initial "Entrance" Animation (On Page Load)
      gsap.fromTo(
        nav,
        { y: -20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
      );

      // 2. Scroll-Linked "Pill" Transformation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "+=150",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        nav,
        {
          width: "100%",
          top: "16px",
          backgroundColor: "rgba(0, 0, 0, 0)",
          backdropFilter: "blur(0px)",
          borderColor: "rgba(0, 0, 0, 0)",
          paddingTop: "0px",
          paddingBottom: "0px",
          color: "rgb(27, 42, 74)",
        },
        {
          width: "88%",
          top: "24px",
          backgroundColor: "rgba(27, 42, 74, 0.5)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(164, 200, 240, 0.3)",
          paddingTop: "2px",
          paddingBottom: "2px",
          color: "rgb(255, 255, 255)",
          ease: "none",
        },
        0,
      );
    },
    { scope: navRef },
  );

  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const topOffset = 20;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-0 right-0 z-50 max-w-[95%] mx-auto rounded-full border border-transparent transition-colors duration-300"
      style={{ width: "100%", color: "rgb(27, 42, 74)" }}
    >
      <div className="relative px-8 py-3 md:px-10 md:py-4 flex items-center justify-between">
        <div className="flex items-center shrink-0">
          <Image
            src="/lumiarc_logo_master_file.svg"
            width={48}
            height={48}
            alt="LumiArc"
            className="h-10 w-auto"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleScrollToSection(link.href)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 shrink-0">
          <button
            onClick={() => handleScrollToSection("contact")}
            className="nav-link"
          >
            Contact
          </button>
          <button
            onClick={() => handleScrollToSection("survey")}
            className="nav-link"
          >
            Rate Me
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
