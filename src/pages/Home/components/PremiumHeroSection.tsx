import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import BottleImage from "../../../images/Bottle_Hero_Image.png";

export const PremiumHeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4"
      style={{ backgroundColor: "#0e1e16" }}
    >
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto h-screen flex items-center justify-center">
        {/* Layer 1: Base Text - Single Line */}
        <div className="absolute w-full inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-none tracking-tight whitespace-nowrap">
            <span className="text-white"> Bottle your </span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-yellow-300 bg-clip-text text-transparent font-bold">
              ..... Personality
            </span>
          </h1>
        </div>

        {/* Layer 2: Large Bottle Image */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="relative transform transition-transform duration-1000 ease-out">
            <img
              src={BottleImage}
              alt="Premium Reusable Water Bottle"
              className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] h-auto"
              style={{
                filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.3))",
                height: "85vh", // Almost full height
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Layer 3: Top Content */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          {/* Subtext - Above bottle, constrained width */}
          <p className="text-white/70 text-lg md:text-xl font-light mb-8 tracking-wide max-w-xs mx-auto">
            For you or someone else.
          </p>

          {/* Call to Action Button */}
          <Button
            size="lg"
            className="h-12 md:h-14 px-6 md:px-8 bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-light rounded-full transition-all duration-300 backdrop-blur-sm group"
            asChild
          >
            <Link to="/products" className="flex items-center space-x-3">
              <span className="text-base md:text-lg">
                Personalise your bottle
              </span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center space-y-2 text-white/40 hover:text-white/70 transition-colors duration-300 group"
        >
          <ChevronDown className="h-6 w-6 animate-bounce group-hover:animate-none" />
        </button>
      </div>
    </section>
  );
};
