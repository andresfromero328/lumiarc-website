"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { BookOpen, DollarSign, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ThreePillars() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Headline clip-path reveal
      tl.fromTo(
        headlineRef.current,
        {
          clipPath: "inset(0 0 100% 0)",
          y: 20,
        },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );

      // Cards stagger with fade-in
      const cards = cardsRef.current?.querySelectorAll("[data-card]");
      if (cards) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.4",
        );
      }
    },
    { scope: sectionRef },
  );

  const cards = [
    {
      icon: BookOpen,
      title: "Academic Planning",
      features: [
        "Degree progress tracking",
        "Course planning & prerequisites",
        "GPA & academic standing",
        "Advisor locator",
      ],
    },
    {
      icon: DollarSign,
      title: "Financial Aid",
      features: [
        "FAFSA deadline alerts",
        "Grant & scholarship matching",
        "Loan tracker",
        "Aid health check",
        "Work-study finder",
      ],
    },
    {
      icon: Briefcase,
      title: "Career Prep",
      features: [
        "Internship finder & deadlines",
        "Resume feedback",
        "Interview prep",
        "Career roadmap",
        "Career fair calendar",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="pillars"
      className="mx-5 mt-5 min-h-[calc(100vh-40px)] rounded-3xl overflow-hidden py-28 px-10 bg-sky-50 flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          ref={headlineRef}
          className="text-5xl font-bold text-navy-900 text-center mb-16"
        >
          The Three Pillars
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                data-card
                className="bg-white border border-sky-200 text-navy-900 rounded-2xl p-8 shadow-md"
              >
                <Icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-2xl font-bold mb-6">{card.title}</h3>
                <ul className="space-y-3 mb-8">
                  {card.features.map((feature, j) => (
                    <li key={j} className="text-text-primary text-sm">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <div className="h-1 w-10 bg-gold"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
