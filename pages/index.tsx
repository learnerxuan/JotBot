// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { quotes } from '../data/quotes';

export default function Home(): JSX.Element {
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    // Outer container now has rounded-2xl to match sidebar and overall app aesthetic
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-transparent to-cyan-400/30 animate-pulse"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Interactive mouse follow effect */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-white/10 to-blue-300/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      {/* Content Container: Now explicitly uses h-full and flex centering */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full p-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            Your journey to emotional wellness starts here
          </p>
        </div>

        {/* Daily Quote Card */}
        <div className={`max-w-4xl mb-16 group transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Main card */}
            <div className="relative bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
              <div className="absolute top-4 left-4 text-6xl opacity-20">"</div>
              <div className="absolute bottom-4 right-4 text-6xl opacity-20 rotate-180">"</div>
              
              <blockquote className="text-2xl md:text-4xl font-medium text-white leading-relaxed text-center px-8 py-4">
                {currentQuote}
              </blockquote>
              
              <div className="flex items-center justify-center mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
                <span className="px-6 text-lg text-white/70 font-light">Daily Inspiration</span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent flex-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Journal Button */}
          <Link href="/journal" passHref>
            <div className="group cursor-pointer">
              <div className="relative">
                {/* Button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                
                {/* Button content */}
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 min-w-[280px] min-h-[200px] flex flex-col items-center justify-center text-center">
                  
                  {/* Floating icon animation */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg scale-150 animate-ping"></div>
                    <div className="relative text-6xl transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                      📝
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-2">Journal</h3>
                  <p className="text-white/90 text-lg font-medium">Express & Reflect</p>
                  <p className="text-white/70 text-sm mt-2 max-w-xs">
                    Pour your thoughts onto digital pages and discover insights within
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Emotion Garden Button */}
          <Link href="/garden" passHref>
            <div className="group cursor-pointer">
              <div className="relative">
                {/* Button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                
                {/* Button content */}
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 min-w-[280px] min-h-[200px] flex flex-col items-center justify-center text-center">
                  
                  {/* Floating icon animation */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-lg scale-150 animate-ping"></div>
                    <div className="relative text-6xl transform transition-transform duration-300 group-hover:scale-110 animate-bounce">
                      🌳
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-2">Emotion Garden</h3>
                  <p className="text-white/90 text-lg font-medium">Track Your Growth</p>
                  <p className="text-white/70 text-sm mt-2 max-w-xs">
                    Cultivate emotional awareness and watch your inner landscape flourish
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Subtle call-to-action */}
        <div className={`mt-16 text-center transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/60 text-lg font-light">
            Choose your path to emotional discovery
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(2deg) scale(1.1); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}