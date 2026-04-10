"use client";
// Edit test: Hello from the AI!

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { GraduationCap, Banknote, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    Icon: GraduationCap,
    title: "Academic Planning",
    description:
      "Prerequisite chains that silently block your path. Requirements you didn't know about. Advising appointments weeks away. LumiArc keeps you a step ahead.",
    hook: "Most students find out they're off-track the semester before graduation.",
    items: [
      "Catch missing requirements before they become a last-minute crisis",
      "Get flagged when a prerequisite chain is quietly closing off your options",
      "Simulate your GPA before you drop or add a course — not after",
      "Track live GPA as grades come in — and know what you need on that final",
      "Build next semester's schedule in minutes, not a 3-week wait for advising",
    ],
  },
  {
    Icon: Banknote,
    title: "Financial Aid",
    description:
      "Aid jargon, SAP thresholds, school-specific deadlines nobody explains. LumiArc makes your financial aid make sense.",
    hook: "Miss one FAFSA deadline and your aid is delayed by a full semester.",
    items: [
      "Deadlines tracked to your specific school — not generic national dates",
      "Your aid package decoded in plain language, not financial jargon",
      "Warned before your GPA puts your SAP standing at risk",
      "Scholarships matched to your actual profile, not a public list",
    ],
  },
  {
    Icon: Briefcase,
    title: "Career Prep",
    description:
      "Internship windows that close while you're in class. No roadmap. No timing. LumiArc keeps your career on track without the scramble.",
    hook: "Internship windows open and close while you're focused on midterms.",
    items: [
      "Get notified when application windows open for your field — before they close",
      "A career roadmap built around your major, year, and graduation date",
      "Resume and interview prep timed to when you actually need it",
      "Campus resources surfaced while you still have time to use them",
    ],
  },
];

const SNAP_THRESHOLD = 0.15;

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

  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h3Refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const pRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ICONS = [GraduationCap, Banknote, Briefcase];

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
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );

      tl.fromTo(
        calloutRefs.current,
        { x: -40, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.4",
      );
    },
    { scope: sectionRef },
  );

  // Context 2: pinned scroll sequence with snap
  useGSAP(
    () => {
      gsap.set(cardRefs.current, { autoAlpha: 0, x: 0, zIndex: 1 });
      gsap.set(iconRefs.current, { opacity: 0.3 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=4500",
          pin: true,
          scrub: 2,
          snap: {
            snapTo: (value) => {
              const duration = tl.duration();
              const positions = Object.values(
                tl.labels as Record<string, number>,
              )
                .map((t) => t / duration)
                .sort((a, b) => a - b);

              let prev = 0;
              let next = 1;
              for (const pos of positions) {
                if (pos <= value) prev = pos;
                else {
                  next = pos;
                  break;
                }
              }

              const pct = next > prev ? (value - prev) / (next - prev) : 1;
              return pct >= SNAP_THRESHOLD ? next : prev;
            },
            duration: { min: 0.4, max: 0.8 },
            ease: "power2.inOut",
            delay: 0.15,
          },
        },
      });

      PILLARS.forEach((_, i) => {
        const label = `phase${i + 1}`;
        const outLabel = `phase${i + 1}-out`;
        const prevCard = cardRefs.current[i - 1];

        tl.addLabel(label);
        tl.set(cardRefs.current[i], { zIndex: 2 });
        if (prevCard) tl.set(prevCard, { zIndex: 1 });

        tl.fromTo(
          iconRefs.current[i],
          { opacity: 0.3 },
          { opacity: 1, duration: 1.5, immediateRender: false },
          label,
        );
        tl.fromTo(
          h3Refs.current[i],
          { backgroundPosition: "100% 0%" },
          {
            backgroundPosition: "0% 0%",
            duration: 1.5,
            immediateRender: false,
          },
          label,
        );
        tl.fromTo(
          pRefs.current[i],
          { backgroundPosition: "100% 0%" },
          {
            backgroundPosition: "0% 0%",
            duration: 1.5,
            immediateRender: false,
          },
          `${label}+=0.15`,
        );
        tl.fromTo(
          cardRefs.current[i],
          { autoAlpha: 0, x: 40 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.5,
            ease: "power2.out",
            immediateRender: false,
          },
          label,
        );

        // Don't add outro for the last card
        if (i < PILLARS.length - 1) {
          tl.addLabel(outLabel);
          tl.to(
            cardRefs.current[i],
            { autoAlpha: 0, x: -20, duration: 0.4, ease: "power2.in" },
            outLabel,
          );
        }
      });

      tl.to({}, { duration: 0.5 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="what-is-lumiarc"
      className="mx-5 mt-5 min-h-[calc(100vh-40px)] rounded-3xl overflow-hidden py-28 px-10 bg-sky-50 flex flex-col items-center justify-center"
    >
      <h1 ref={headlineRef} className="mb-12 drop-shadow-lg mr-auto">
        What is LumiArc
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left panel */}
        <div className="space-y-8">
          {PILLARS.map((pillar, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                ref={(el) => {
                  calloutRefs.current[i] = el;
                }}
                className="flex gap-4"
              >
                <div
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                  style={{ opacity: 0.3 }}
                >
                  <Icon className="icon-lg mt-1 drop-shadow-md" />
                </div>
                <div>
                  <h3
                    ref={(el) => {
                      h3Refs.current[i] = el;
                    }}
                    className="mb-2 drop-shadow-md"
                    style={gradientTextStyle}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    ref={(el) => {
                      pRefs.current[i] = el;
                    }}
                    style={gradientTextStyle}
                  >
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div className="relative h-100">
          {PILLARS.map((pillar, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-navy-900/20 flex flex-col"
                style={{ opacity: 0, visibility: "hidden" }}
              >
                {/* Gold accent bar */}
                <div className="h-0.75 bg-gold shrink-0" />

                {/* Dark header */}
                <div className="bg-navy-900 px-6 py-5 flex items-center gap-4 shrink-0">
                  <Icon className="size-7 text-sky-300 shrink-0" />
                  <h3 className="text-white!">{pillar.title}</h3>
                </div>

                {/* White body */}
                <div className="bg-white flex-1 px-6 pt-5 pb-6 flex flex-col">
                  <p className="text-sm italic text-text-tertiary leading-relaxed mb-4">
                    {pillar.hook}
                  </p>
                  <div className="h-px bg-border mb-4" />
                  <ul className="space-y-2.5">
                    {pillar.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="mt-2 size-1.5 rounded-full bg-gold shrink-0" />
                        <span className="text-sm text-text-secondary leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIsLumiArc;
