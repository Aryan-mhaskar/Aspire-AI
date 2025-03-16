"use client";

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
    <section className="w-full pt-36 md:pt-48 pb-10 relative bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-950 mt-2">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:60px_60px]" />
    <div className="relative z-10">
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
  Your AI Career Coach
  <br />
  Professional Success
</h1>
<p className="mx-auto max-w-[600px] text-slate-300 md:text-xl font-medium">
  Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
</p>

        </div>
        <div className="flex justify-center space-x-4 mt-10">
          <Link href="/dashboard">
          <Button 
  size="lg" 
  className="px-8 bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 text-white font-semibold"
>
  Get Started
</Button>
             </Link>
             {/* <Link href="https://www.youtube.com/roadsidecoder">
               <Button size="lg" variant="outline" className="px-8">
                 Watch Demo
               </Button>  
             </Link> */}
          </div>
          <div className="hero-image-wrapper mt-5 md:mt-0 mb-10">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner2.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
    
  )
}

export default HeroSection
