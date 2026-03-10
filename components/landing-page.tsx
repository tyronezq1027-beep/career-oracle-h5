"use client"

import { motion } from "framer-motion"

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-md mx-auto"
      >
        {/* Logo/Brand Mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border border-primary/30" />
            <div className="absolute inset-2 rounded-full border border-primary/20" />
            <div className="absolute inset-4 rounded-full border border-primary/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8 text-primary"
                stroke="currentColor"
                strokeWidth="1"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl tracking-wide mb-4 text-foreground"
        >
          <span className="text-primary">Career Oracle</span>
          <span className="block text-2xl md:text-3xl mt-2">天赋与赛道解码</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12"
        >
          元辰命理排盘 × 现代MBTI心理学
          <br />
          测算你的天命职场
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative group px-8 py-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/50 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/10 active:scale-95 transition-all duration-200"
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-primary rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-full" />
          <div className="absolute inset-[1px] bg-background rounded-full" />
          <div className="absolute inset-[2px] bg-gradient-to-r from-primary/90 to-primary rounded-full" />
          
          {/* Button text */}
          <span className="relative z-10 font-medium text-primary-foreground tracking-wider">
            开启潜能测算
          </span>
          
          {/* Animated glow on hover */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-xl" />
          </div>
        </motion.button>

        {/* Decorative bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 text-xs text-muted-foreground/60 tracking-widest uppercase"
        >
          探索命运 · 解锁天赋
        </motion.p>
      </motion.div>
    </div>
  )
}
