"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { GraduationCap, Banknote, Briefcase, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    Icon: GraduationCap,
    title: "Academic Planning",
    description:
      "Stay ahead of degree requirements, course planning, and prerequisite chains. Know what to do next.",
    items: [
      "Know exactly which courses fulfill your degree requirements",
      "Get alerts before prerequisite chains close off your options",
      "See your GPA impact before you drop or add a class",
      "Plan next semester in minutes, not advising appointments",
    ],
  },
  {
    Icon: Banknote,
    title: "Financial Aid Made Simple",
    description:
      "Understand FAFSA deadlines, grants, loans, and aid status in plain language. Never miss a deadline.",
    items: [
      "Track FAFSA deadlines specific to your school",
      "See your grants, loans, and aid package in plain language",
      "Get warned before Satisfactory Academic Progress (SAP) is at risk",
      "Match with scholarships based on your profile",
    ],
  },
  {
    Icon: Briefcase,
    title: "Career Prep Guidance",
    description:
      "Get ready for your future with personalized career advice and job search strategies.",
    items: [
      "Know when internship application windows open for your field",
      "Get a personalized career roadmap based on your major",
      "Resume and interview prep timed to your graduation date",
      "Connect to on-campus resources before it's too late",
    ],
  },
];

const gradientTextStyle: React.CSSProperties = {
  background:
    "linear-gradient(to right, var(--text-primary) 50%, var(--text-tertiary) 50%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  backgroundPosition: "100% 0%",
};

const WhatIsLumiArc = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Callout wrapper divs — Context 1 slide-in targets
  const callout1Ref = useRef<HTMLDivElement>(null);
  const callout2Ref = useRef<HTMLDivElement>(null);
  const callout3Ref = useRef<HTMLDivElement>(null);

  // Icon wrapper divs — Context 2 opacity targets
  const icon1Ref = useRef<HTMLDivElement>(null);
  const icon2Ref = useRef<HTMLDivElement>(null);
  const icon3Ref = useRef<HTMLDivElement>(null);

  // Heading refs — Context 2 gradient sweep targets
  const h3_1Ref = useRef<HTMLHeadingElement>(null);
  const h3_2Ref = useRef<HTMLHeadingElement>(null);
  const h3_3Ref = useRef<HTMLHeadingElement>(null);

  // Paragraph refs — Context 2 gradient sweep targets
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);

  // Right panel card refs
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Context 1: one-shot entry reveal
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      tl.fromTo(
        headlineRef.current,
        { clipPath: "inset(0 0 100% 0)", y: 20 },
        { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.7, ease: "power3.out" },
      );

      tl.fromTo(
        [callout1Ref.current, callout2Ref.current, callout3Ref.current],
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.4",
      );
    },
    { scope: sectionRef },
  );

  // Context 2: pinned scroll sequence — one phase per pillar
  useGSAP(
    () => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
      const icons = [icon1Ref.current, icon2Ref.current, icon3Ref.current];

      gsap.set(cards, { autoAlpha: 0, x: 0, zIndex: 1 });
      gsap.set(icons, { opacity: 0.3 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=250vh",
          pin: true,
          scrub: 1,
        },
      });

      // Phase 1 — Academic Planning (0–2.8)
      tl.set(card1Ref.current, { zIndex: 2 }, 0);
      tl.fromTo(icon1Ref.current, { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 0);
      tl.fromTo(h3_1Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 0);
      tl.fromTo(p1Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 0.3);
      tl.fromTo(card1Ref.current, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 0);

      // Phase 1 Outro (2.8–3.5)
      tl.to(card1Ref.current, { autoAlpha: 0, x: -20, duration: 0.7, ease: "power2.in" }, 2.8);
      tl.set(card2Ref.current, { zIndex: 2 }, 3.5);
      tl.set(card1Ref.current, { zIndex: 1 }, 3.5);

      // Phase 2 — Financial Aid Made Simple (3.5–6.3)
      tl.fromTo(icon2Ref.current, { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 3.5);
      tl.fromTo(h3_2Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 3.5);
      tl.fromTo(p2Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 3.8);
      tl.fromTo(card2Ref.current, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 3.5);

      // Phase 2 Outro (6.3–7.0)
      tl.to(card2Ref.current, { autoAlpha: 0, x: -20, duration: 0.7, ease: "power2.in" }, 6.3);
      tl.set(card3Ref.current, { zIndex: 2 }, 7.0);
      tl.set(card2Ref.current, { zIndex: 1 }, 7.0);

      // Phase 3 — Career Prep Guidance (7.0–9.8)
      tl.fromTo(icon3Ref.current, { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 7.0);
      tl.fromTo(h3_3Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 7.0);
      tl.fromTo(p3Ref.current, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 7.3);
      tl.fromTo(card3Ref.current, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 7.0);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="what-is-lumiarc"
      className="mx-5 mt-5 min-h-[calc(100vh-40px)] rounded-3xl overflow-hidden py-28 px-10 bg-white flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left panel */}
        <div>
          <h1 ref={headlineRef} className="mb-12 drop-shadow-lg">
            What is LumiArc
          </h1>

          <div className="space-y-8">
            {/* Pillar 1 */}
            <div ref={callout1Ref} className="flex gap-4">
              <div ref={icon1Ref} style={{ opacity: 0.3 }}>
                <GraduationCap className="icon-lg mt-1 drop-shadow-md" />
              </div>
              <div>
                <h3 ref={h3_1Ref} className="mb-2 drop-shadow-md" style={gradientTextStyle}>
                  {PILLARS[0].title}
                </h3>
                <p ref={p1Ref} style={gradientTextStyle}>
                  {PILLARS[0].description}
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div ref={callout2Ref} className="flex gap-4">
              <div ref={icon2Ref} style={{ opacity: 0.3 }}>
                <Banknote className="icon-lg mt-1 drop-shadow-md" />
              </div>
              <div>
                <h3 ref={h3_2Ref} className="mb-2 drop-shadow-md" style={gradientTextStyle}>
                  {PILLARS[1].title}
                </h3>
                <p ref={p2Ref} style={gradientTextStyle}>
                  {PILLARS[1].description}
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div ref={callout3Ref} className="flex gap-4">
              <div ref={icon3Ref} style={{ opacity: 0.3 }}>
                <Briefcase className="icon-lg mt-1 drop-shadow-md" />
              </div>
              <div>
                <h3 ref={h3_3Ref} className="mb-2 drop-shadow-md" style={gradientTextStyle}>
                  {PILLARS[2].title}
                </h3>
                <p ref={p3Ref} style={gradientTextStyle}>
                  {PILLARS[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — stacked cards, one per pillar */}
        <div className="relative h-96">
          {/* Card 1 — Academic Planning */}
          <div
            ref={card1Ref}
            className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-300 to-sky-100 shadow-lg p-8 flex flex-col gap-6"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="icon-lg" />
              <h3>{PILLARS[0].title}</h3>
            </div>
            <ul className="space-y-3">
              {PILLARS[0].items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="icon-sm mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 — Financial Aid Made Simple */}
          <div
            ref={card2Ref}
            className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-300 to-sky-100 shadow-lg p-8 flex flex-col gap-6"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="flex items-center gap-3">
              <Banknote className="icon-lg" />
              <h3>{PILLARS[1].title}</h3>
            </div>
            <ul className="space-y-3">
              {PILLARS[1].items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="icon-sm mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3 — Career Prep Guidance */}
          <div
            ref={card3Ref}
            className="absolute inset-0 rounded-2xl bg-linear-to-br from-sky-300 to-sky-100 shadow-lg p-8 flex flex-col gap-6"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="icon-lg" />
              <h3>{PILLARS[2].title}</h3>
            </div>
            <ul className="space-y-3">
              {PILLARS[2].items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="icon-sm mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsLumiArc;
