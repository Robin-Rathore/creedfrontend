import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Bottle_Video from "@/images/Creed_Voiceover.mp4";

export const VideoSection: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleText = () => {
    setShowText(!showText);
  };

  return (
    <section className="relative bg-black min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={Bottle_Video}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Minimal Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl">
          {/* Text Content with Animation */}
          <div
            className={`transform transition-all duration-700 ease-out ${
              showText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Creed
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Experience the essence of luxury. Every drop tells a story of
              craftsmanship, tradition, and uncompromising quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Discover Collection
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Control Panel */}
      <div className="absolute top-8 right-8 z-20">
        <div className="flex items-center gap-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Text Toggle */}
          <button
            onClick={toggleText}
            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-light hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {showText ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remove Decorative Elements */}
    </section>
  );
};
