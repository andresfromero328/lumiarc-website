"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  return (
    <motion.footer
      className="bg-navy-900 text-white py-12 px-10"
      style={{ y }}
      ref={container}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Branding */}
          <div>
            <Image
              src="/lumiarc_logo_180.png"
              width={40}
              height={40}
              alt="LumiArc"
              className="h-10 w-auto mb-4"
            />
            <small>Lighting the arc to your degree.</small>
          </div>

          {/* Links */}
          <div>
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-list">
              <li>
                <a href="#what-is-lumiarc" className="footer-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="footer-link">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li>
                <a href="#about" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-list">
              <li>
                <a href="#" className="footer-link">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-navy-600 pt-8 flex flex-col md:flex-row justify-between items-center">
          <small>© 2026 LumiArc. Lighting the arc to your degree.</small>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="footer-link" title="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
            <Link href="#" className="footer-link" title="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 1.6 1.14 2.5a9.5 9.5 0 002.86-9.02z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
