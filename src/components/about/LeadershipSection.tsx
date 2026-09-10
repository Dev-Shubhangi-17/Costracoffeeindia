"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Mr. Sandeep Kumar",
    role: "Chief Operating Officer (COO)",
    description: "Oversees business operations, process optimization, and execution to drive efficiency and sustainable growth.",
    image: "/images/team/sandeep-kumar.jpg",
  },
  {
    name: "Mr. Sumit Pashupati Singh",
    role: "Director - Europe Operations",
    description: "Focuses on operational excellence, business development, and strategic initiatives to strengthen the organization's success.",
    image: "/images/team/sumit-singh.jpg",
  },
  {
    name: "Mr. Cintu Pashupati Singh",
    role: "Co-Founder & Brand Director – Costra Coffee",
    description: "Leads product innovation, brand strategy, and customer experience for Costra Coffee.",
    image: "/images/team/cintu-singh.jpg",
  },
];

export default function LeadershipSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="w-full bg-brand-white" id="leadership-section">
      {/* 1. TOP HEADER BANNER */}
      <div className="w-full bg-[#F5B800] text-black py-12 px-6 text-center shadow-sm relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block text-[10px] font-black tracking-[0.3em] uppercase bg-black/10 text-black px-4 py-1.5 rounded-full mb-1">
            STEWARDS OF GROWTH
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-heading leading-none">
            MEET OUR LEADERSHIP
          </h1>
          <p className="text-sm sm:text-base font-semibold max-w-2xl mx-auto leading-relaxed text-black/85 font-body">
            Meet the stewards responsible for leading and inspiring growth within Swati Gruh Udhyog & Costra Coffee.
          </p>
        </div>
      </div>

      {/* 2. CEO HERO FEATURED BLOCK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#1A1A1A] text-white p-8 md:p-12 rounded-2xl max-w-6xl mx-auto my-10 shadow-xl relative overflow-hidden"
        >
          {/* Subtle decorative background detail */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#F5B800_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
            {/* CEO Text Details (Left Column) */}
            <div className="space-y-5 md:col-span-7 text-center md:text-left">
              <div className="space-y-2">
                <span className="inline-block text-[9px] font-extrabold tracking-[0.25em] text-[#F5B800] bg-[#F5B800]/10 border border-[#F5B800]/20 px-3 py-1 rounded-full uppercase">
                  FOUNDER PROFILE
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold font-heading text-white leading-tight">
                  Swati Pashupati Singh
                </h3>
                <p className="text-lg font-bold text-[#F5B800] tracking-wide font-body">
                  Founder & Chief Executive Officer (CEO)
                </p>
              </div>
              
              <div className="h-px bg-white/10 w-20 mx-auto md:mx-0" />
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-body font-medium max-w-xl mx-auto md:mx-0">
                Founder of Swati Gruh Udhyog, leading the company&apos;s vision, strategy, and commitment to quality and customer trust.
              </p>
            </div>

            {/* CEO Image Container (Right Column) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-2xl border border-[#F5B800]/30 group-hover:border-[#F5B800]/50 transition-all duration-300 scale-95 group-hover:scale-100" />
                <div className="relative w-[260px] h-[325px] sm:w-[280px] sm:h-[350px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2A2A2A] z-10 bg-[#222]">
                  <Image
                    src="/images/team/swati-singh.jpg"
                    alt="Swati Pashupati Singh - Founder & CEO"
                    fill
                    sizes="(max-w-768px) 260px, 280px"
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. 3-COLUMN TEAM GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10 space-y-2">
          <span className="inline-block text-[9px] font-black tracking-[0.25em] text-[#F5B800] bg-[#F5B800]/10 px-3.5 py-1 rounded-full border border-[#F5B800]/20">
            EXECUTIVE BOARD
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-charcoal">
            Management & Strategy
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F5B800] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer relative overflow-hidden group h-full"
            >
              {/* Subtle top accent tag */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#F5B800] transition-colors duration-300" />
              
              {/* Portrait Image Frame */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 bg-[#F9F9FB]">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              {/* Text Info */}
              <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-brand-charcoal tracking-wide font-heading uppercase leading-tight">
                    {member.name}
                  </h4>
                  
                  {/* Role Tag */}
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-wider text-black bg-[#F5B800] px-2.5 py-0.5 rounded uppercase">
                      {member.role}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-charcoal/65 leading-relaxed font-body font-medium">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
