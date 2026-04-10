import Footer from "@/components/gobal/footer/Footer";
import Navbar from "@/components/gobal/navigation/Navbar";
import Hero from "@/components/panels/Hero";
import ThreePillars from "@/components/panels/ThreePillars";
import WhatIsLumiArc from "@/components/panels/WhatIsLumiArc";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="z-20">
        <Hero />
        <WhatIsLumiArc />
        <ThreePillars />
      </main>
      <Footer />
    </>
  );
}
