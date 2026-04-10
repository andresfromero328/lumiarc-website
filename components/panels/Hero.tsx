"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, AlertCircle, Bell } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NOTIFICATIONS = [
  {
    id: "fafsa",
    icon: Clock,
    type: "Reminder",
    typeColor: "text-warning!",
    bgColor: "bg-warning-light",
    borderColor: "border-warning",
    subject: "FAFSA Due",
    message: "14 days remaining",
    position: "-left-50 -top-75",
  },
  {
    id: "gpa",
    icon: AlertCircle,
    type: "Alert",
    typeColor: "text-error!",
    bgColor: "bg-error-light",
    borderColor: "border-error",
    subject: "GPA Impact",
    message: "Affects your financial aid",
    position: "-right-50 -top-110",
  },
];

export default function Hero() {
  // Refs for animation targets
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const bgBoxRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const parallaxPhoneRef = useRef<HTMLDivElement>(null);
  const iPhoneRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const tipsBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Text animations
      tl.fromTo(
        headlineRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0,
      );

      tl.fromTo(
        descriptionRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.15,
      );

      // 1. Green box fades + scales in
      tl.fromTo(
        bgBoxRef.current,
        {
          autoAlpha: 0,
          scale: 0.25,
          transformOrigin: "center bottom",
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.6,
      );

      // 2. iPhone: slide from below, through green box, above (masked at bottom)
      // Container uses clip-path to mask bottom, keeping top free for overflow
      tl.fromTo(
        iPhoneRef.current,
        { y: 640, autoAlpha: 1 },
        { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" },
        1.0,
      );

      // 3. Tips block slides up
      tl.fromTo(
        tipsBlockRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        2,
      );

      // 4. Notifications pop in with scale spring (staggered)
      const notifications = notificationsRef.current?.querySelectorAll(
        "[data-notification]",
      );
      if (notifications) {
        notifications.forEach((notification, i) => {
          tl.fromTo(
            notification,
            {
              scale: 0,
              autoAlpha: 0,
              transformOrigin: "center center",
            },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.5,
              ease: "back.out(2)",
            },
            2.15 + i * 0.1,
          );
        });
      }

      // Parallax
      gsap.fromTo(
        bgImageRef.current,
        { y: 0 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      gsap.to(parallaxPhoneRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="mx-5 mt-5 min-h-[calc(100vh-40px)] rounded-3xl overflow-hidden pt-32 pb-28 px-6 md:px-10 bg-sky-50 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col justify-center items-center ">
          {/* Text Content */}
          <div className="max-w-2xl text-center">
            <h1 ref={headlineRef} className="mb-4 drop-shadow-lg">
              Light your arc to your degree
            </h1>

            <p ref={descriptionRef} className="drop-shadow-md">
              Personalized guidance across academics, finances, and career
              prep—all in one app
            </p>
          </div>

          {/* Visual Content */}
          <div
            ref={visualContainerRef}
            className="relative mx-auto w-full mt-16 h-140 overflow-visible"
          >
            {/* Background box - stationary container with clipping */}
            <div
              ref={bgBoxRef}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[85%] h-120 rounded-3xl overflow-hidden"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
            >
              {/* Background image */}
              <div
                ref={bgImageRef}
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/bg_block_arc_image.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "120%",
                }}
              />
            </div>

            {/* Clip wrapper: hard clips bottom edge, allows top overflow */}
            <div
              className="absolute inset-0"
              style={{ clipPath: "inset(-500% 0 0 0)", zIndex: 10 }}
            >
              {/* iPhone + Notifications */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-85"
                style={{ zIndex: 10 }}
              >
                {/* iPhone Frame */}
                <div
                  ref={parallaxPhoneRef}
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80"
                  style={{ zIndex: 10 }}
                >
                  <div ref={iPhoneRef} className="relative">
                    {/* Left side buttons */}
                    <div className="absolute -left-1.25 top-24 w-1.5 h-5 bg-neutral-700 rounded-l-sm" />
                    <div className="absolute -left-1.25 top-36 w-1.5 h-8 bg-neutral-700 rounded-l-sm" />
                    <div className="absolute -left-1.25 top-48 w-1.5 h-8 bg-neutral-700 rounded-l-sm" />

                    {/* Right side power button */}
                    <div className="absolute -right-1.25 top-40 w-1.5 h-12 bg-neutral-700 rounded-r-sm" />

                    {/* Outer shell */}
                    <div className="relative bg-neutral-700 rounded-[2.5rem] p-1.5">
                      {/* Inner bezel */}
                      <div className="bg-neutral-700 rounded-4xl p-0.5">
                        {/* Screen */}
                        <div className="relative bg-white rounded-4xl overflow-hidden h-155">
                          {/* Dynamic Island */}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-neutral-700 rounded-full z-20" />

                          {/* App content */}
                          <div className="h-full bg-linear-to-b from-slate-100 to-slate-200 flex flex-col items-center justify-center text-text-secondary">
                            <div className="text-center">
                              <p className="text-sm font-semibold">
                                Dashboard View
                              </p>
                              <p className="text-xs text-text-tertiary mt-1">
                                Degree Progress
                              </p>
                            </div>
                          </div>

                          {/* Subtle light reflection */}
                          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Notifications - relative to phone */}
                <div
                  ref={notificationsRef}
                  className="pointer-events-none hidden md:block"
                  style={{ zIndex: 20 }}
                >
                  {NOTIFICATIONS.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        data-notification
                        className={`absolute ${notif.position} min-w-70 border-l-4 ${notif.borderColor} ${notif.bgColor} rounded-r-xl`}
                        style={{ zIndex: 20 }}
                      >
                        <div
                          className={`${notif.bgColor} rounded-r-xl p-3 shadow-lg max-w-xs `}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`${notif.typeColor} icon`} />
                              <p className={`${notif.typeColor} font-semibold`}>
                                {notif.type}
                              </p>
                            </div>

                            <div className="flex-1 flex flex-col">
                              <small className="font-semibold text-navy-900!">
                                {notif.subject}
                              </small>
                              <small className="text-sm text-navy-900!">
                                {notif.message}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tips Block - centered at background box bottom, 50% overlapping */}
            <div
              ref={tipsBlockRef}
              className="absolute left-1/2 -translate-x-1/2 -bottom-20 bg-white rounded-xl p-6 shadow-lg w-120 hidden md:block"
              style={{ zIndex: 15 }}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="icon-lg" />
                  <h3>What&apos;s currently happening?</h3>
                </div>
                <hr className="border-border mb-3" />
                <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                  <li>GPA reaching threshold</li>
                  <li>FAFSA deadline in 14 days</li>
                  <li>Start internships next semester</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
