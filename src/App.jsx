import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

const MagneticKanjiClock = ({ size = 260, minimalist = false }) => {
  const [time, setTime] = useState(new Date());
  const [showDigital, setShowDigital] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const hourAngle = (hours % 12) * 30 - 90;
  const continuousMinutes = minutes + seconds / 60 + ms / 60000;
  const minuteAngle = continuousMinutes * 6 - 90;

  const kanjiNumerals = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const secondMarkers = Array.from({ length: 60 });

  return (
    <div
      className="relative cursor-pointer group flex items-center justify-center mx-auto transition-all duration-500"
      style={{ width: size, height: size }}
      onClick={() => !minimalist && setShowDigital(!showDigital)}
    >
      {/* Background and Orbit Rings */}
      <div className={`absolute inset-0 rounded-full flex items-center justify-center overflow-hidden transition-all duration-700 ${minimalist ? 'bg-transparent border-white/5' : 'bg-background-dark shadow-[0_0_80px_rgba(123, 44, 191,0.25)] border border-white/10'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Orbiting Moons */}
          {!minimalist && (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '50px 50px' }}
            >
              <circle cx="95" cy="50" r="1.5" fill="#ADFF2F" filter="url(#glowGreen)" />
              <circle cx="5" cy="50" r="1" fill="#7B2CBF" filter="url(#glowPurple)" />
            </motion.g>
          )}
          {!minimalist && (
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '50px 50px' }}
            >
              <circle cx="50" cy="5" r="1.2" fill="#ADFF2F" opacity="0.6" />
              <circle cx="50" cy="95" r="0.8" fill="#7B2CBF" opacity="0.8" />
            </motion.g>
          )}

          {/* Subtle background radial gradient */}
          <defs>
            {!minimalist && (
              <radialGradient id="clockBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1A0A2E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
              </radialGradient>
            )}

            {/* Definitive Glow Filters using userSpaceOnUse to avoid bound clipping */}
            <filter id="glowGreen" x="-50" y="-50" width="200" height="200" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation={minimalist ? "1" : "3.5"} result="blur" />
              <feColorMatrix in="blur" type="matrix" values={minimalist ? "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" : "0 0 0 0 0.678  0 0 0 0 1  0 0 0 0 0.184  0 0 0 1.8 0"} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowPurple" x="-50" y="-50" width="200" height="200" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation={minimalist ? "1" : "3.5"} result="blur" />
              <feColorMatrix in="blur" type="matrix" values={minimalist ? "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" : "0 0 0 0 0.482  0 0 0 0 0.173  0 0 0 0 0.749  0 0 0 1.8 0"} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {!minimalist && <circle cx="50" cy="50" r="49" fill="url(#clockBg)" />}

          <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

          {/* Circular Progress Second Hand (Now on the outer edge) */}
          {secondMarkers.map((_, i) => {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const radius = 47.5;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            const isLit = i <= seconds;
            const isCurrent = i === seconds;

            return (
              <motion.circle
                key={`sec-${i}`}
                cx={x}
                cy={y}
                r={minimalist ? "0.3" : "0.5"}
                initial={false}
                animate={{
                  fill: isLit ? (minimalist ? '#FFFFFF' : '#ADFF2F') : '#222222',
                  scale: isCurrent && !minimalist ? [2, 1] : 1,
                  opacity: isLit ? (minimalist ? 0.6 : 1) : 0.2
                }}
                transition={{
                  scale: { duration: 0.3, ease: 'backOut' },
                  fill: { duration: 0.1 }
                }}
              />
            );
          })}

          {/* Hour Highlight Overlay (Behind Kanjis) */}
          <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '50px 50px' }} className="transition-transform duration-700">
            {!minimalist && (
              <>
                <circle cx="88" cy="50" r="6" fill="#ADFF2F" opacity="0.3" filter="url(#glowGreen)" />
                <circle cx="88" cy="50" r="4.5" fill="none" stroke="#ADFF2F" strokeWidth="1" opacity="0.6" />
              </>
            )}
            {minimalist && (
              <circle cx="88" cy="50" r="2" fill="white" opacity="0.4" />
            )}
          </g>

          {/* Kanji Numerals (Traditional Stylized Design) - Hidden in minimalist mode */}
          {!minimalist && kanjiNumerals.map((kanji, i) => {
            const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
            const radius = 38;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="rgba(255,255,255,0.6)"
                fontSize="7"
                fontWeight="900"
                fontFamily="'Shippori Mincho', serif"
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none transition-all duration-500"
                style={{ filter: (i + 1) % 12 === hours % 12 ? 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' : 'none' }}
              >
                {kanji}
              </text>
            );
          })}

          {/* Minute Ball (Purple/White) */}
          <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '50px 50px' }}>
            <circle cx="78" cy="50" r={minimalist ? "1.5" : "3.2"} fill={minimalist ? "#FFFFFF" : "#7B2CBF"} filter={minimalist ? "none" : "url(#glowPurple)"} opacity={minimalist ? 0.8 : 1} />
          </g>

          {/* Hour Ball (Green/White - Only if minimalist needs a discrete marker) */}
          {minimalist && (
            <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '50px 50px' }}>
              <circle cx="68" cy="50" r="1.5" fill="white" opacity="0.8" />
            </g>
          )}

          <circle cx="50" cy="50" r="1.5" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>

      <AnimatePresence>
        {showDigital && !minimalist && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl rounded-full pointer-events-none z-20 border border-white/10 text-center"
          >
            <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(173,255,47,0.3)]">
              {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mt-2 opacity-80">
              LOCAL TIME
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PixelClock = ({ visible }) => {
  const [displayTime, setDisplayTime] = useState({ h: '00', m: '00', s: '00' });
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isManualHidden, setIsManualHidden] = useState(false);

  useEffect(() => {
    if (visible && !isManualHidden) {
      setIsDecrypting(true);
      const shuffleInterval = setInterval(() => {
        setDisplayTime({
          h: Math.floor(Math.random() * 100).toString().padStart(2, '0'),
          m: Math.floor(Math.random() * 100).toString().padStart(2, '0'),
          s: Math.floor(Math.random() * 100).toString().padStart(2, '0')
        });
      }, 60);

      const timer = setTimeout(() => {
        clearInterval(shuffleInterval);
        setIsDecrypting(false);
      }, 800);

      return () => {
        clearInterval(shuffleInterval);
        clearTimeout(timer);
      };
    }
  }, [visible, isManualHidden]);

  useEffect(() => {
    if (!isDecrypting) {
      const updateClock = () => {
        const now = new Date();
        setDisplayTime({
          h: now.getHours().toString().padStart(2, '0'),
          m: now.getMinutes().toString().padStart(2, '0'),
          s: now.getSeconds().toString().padStart(2, '0')
        });
      };
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    }
  }, [isDecrypting]);

  return (
    <>
      <AnimatePresence>
        {visible && !isManualHidden && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="hidden md:flex fixed bottom-8 right-8 z-[100] font-['VT323'] text-accent flex-col items-end pointer-events-auto select-none bg-black/40 backdrop-blur-md p-4 rounded-xl border border-accent/20 group"
            style={{ textShadow: '0 0 15px rgba(173, 255, 47, 0.4)' }}
          >
            <button
              onClick={() => setIsManualHidden(true)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-accent hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-1">Neural Clock v.1.0</div>
            <div className="text-4xl md:text-5xl leading-none flex items-center gap-1">
              <span>{displayTime.h}</span>
              <span className={`transition-opacity duration-300 ${isDecrypting ? 'opacity-20' : 'animate-pulse opacity-50'}`}>:</span>
              <span>{displayTime.m}</span>
              <span className={`transition-opacity duration-300 ${isDecrypting ? 'opacity-20' : 'animate-pulse opacity-50'}`}>:</span>
              <span>{displayTime.s}</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">
              {new Date().toLocaleDateString('ja-JP')} // SYSTEM_STABLE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && isManualHidden && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="hidden md:flex fixed bottom-8 right-8 z-[100]"
          >
            <button
              onClick={() => setIsManualHidden(false)}
              className="bg-black/50 border border-accent/30 text-accent p-3 rounded-full hover:bg-accent/20 transition-all shadow-[0_0_20px_rgba(173,255,47,0.2)] flex items-center justify-center group"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">schedule</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LiquidGradientText = ({ children }) => {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const background = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, #ADFF2F 0%, #7B2CBF 35%, #5a189a 60%, #7B2CBF 100%)`
  );

  return (
    <motion.span
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      onMouseLeave={() => {
        mouseX.set(50);
        mouseY.set(50);
      }}
      className="relative text-transparent bg-clip-text cursor-default select-none inline-block pb-1"
      style={{
        backgroundImage: background,
        backgroundSize: '200% 200%',
        willChange: 'background-image, background-position'
      }}
      whileHover={{
        scale: 1.02,
        backgroundPosition: ['0% 0%', '80% 80%', '20% 80%', '80% 20%', '0% 0%'],
        transition: {
          scale: { duration: 0.4 },
          backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' }
        }
      }}
    >
      {children}
    </motion.span>
  );
};

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'portfolio', 'testimonials', 'contact'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = section.charAt(0).toUpperCase() + section.slice(1);
            break;
          }
        }
      }
      
      if (current && current !== activeTab) {
        setActiveTab(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (item) => {
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveTab(item);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center gap-3 relative z-10 cursor-pointer" onClick={() => scrollToSection('Home')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">KAITEN</span>
          </div>
          <div className="hidden md:flex flex-1 justify-center relative z-0">
            <div className="flex items-center space-x-6 lg:space-x-12">
              {['Home', 'Services', 'Portfolio', 'Testimonials', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-sm font-medium transition-all duration-300 ${activeTab === item
                      ? 'text-white'
                      : 'text-white/50 hover:text-purple-400'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex space-x-2 sm:space-x-4">
            <button onClick={() => scrollToSection('Contact')} className="glow-effect bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 tracking-wider">
              IMPULSAR MI NEGOCIO
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const GlassCard = ({ icon, delay, floatingRange, style }) => (
  <motion.div
    animate={{ y: floatingRange }}
    transition={{
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay: delay,
    }}
    className="absolute hidden xl:flex flex-col p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 pointer-events-auto cursor-pointer group hover:bg-white/[0.05] hover:border-accent/30 transition-all duration-500 overflow-hidden"
    style={style}
  >
    {/* Animated subtle glow on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="flex flex-col gap-4 w-36 relative z-10">
      <div className="flex items-center gap-3 w-full">
        <div className="size-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(173,255,47,0.8)]"></div>
        <div className="h-1.5 grow rounded-full bg-white/30"></div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="h-1.5 w-full rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"></div>
        <div className="h-1.5 w-4/5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"></div>
        <div className="h-1.5 w-3/5 rounded-full bg-accent/20 group-hover:bg-accent/40 transition-colors"></div>
      </div>
      <div className="flex justify-between items-end mt-4">
        {icon && <span className="material-symbols-outlined text-white/50 group-hover:text-accent transition-colors duration-300 text-xl">{icon}</span>}
        <div className="flex gap-1">
          <div className="size-1 rounded-full bg-white/30"></div>
          <div className="size-1 rounded-full bg-white/30"></div>
          <div className="size-1 rounded-full bg-white/30"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ZenEclipse = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      
      {/* Intense Background Glow (Corona) */}
      <div className="absolute rounded-full aspect-square w-[500px] md:w-[800px] bg-[#ADFF2F]/20 blur-[100px] mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute rounded-full aspect-square w-[300px] md:w-[500px] bg-white/10 blur-[60px] mix-blend-screen"></div>

      {/* The Enso Mask (Zen Circle SVG - Optimized for performance) */}
      <div className="relative aspect-square w-[90vw] sm:w-[500px] md:w-[800px] lg:w-[1000px] max-w-[1000px] max-h-[1000px] flex items-center justify-center opacity-90 overflow-visible">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full absolute inset-0 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
          style={{ willChange: 'transform' }} /* Hardware acceleration */
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          {/* Base organic circle - Solid core pass */}
          <path
            d="M 100,20 C 150,20 180,50 180,100 C 180,150 150,180 100,180 C 50,180 20,150 20,100 C 20,50 50,20 100,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            style={{
              strokeDasharray: '280, 120',
              strokeDashoffset: '50',
              opacity: 0.95
            }}
          />
          {/* Frayed inner stroke for brush texture */}
          <path
            d="M 100,22 C 145,22 178,52 178,100 C 178,145 148,178 100,178 C 55,178 22,145 22,100 C 22,55 52,22 100,22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray: '40, 10, 80, 20, 100, 30',
              strokeDashoffset: '10',
              opacity: 0.6
            }}
          />
          {/* Secondary frayed stroke for accent color */}
          <path
            d="M 100,18 C 155,18 182,55 182,100 C 182,155 155,182 100,182 C 45,182 18,155 18,100 C 18,45 45,18 100,18"
            fill="none"
            stroke="#ADFF2F"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: '20, 60, 120, 40, 50, 80',
              opacity: 0.8
            }}
          />
          {/* Geometric / Minimal Splatters */}
          <circle cx="165" cy="45" r="1.5" fill="currentColor" />
          <circle cx="175" cy="80" r="1" fill="#ADFF2F" opacity="0.8"/>
          <circle cx="35" cy="155" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="70" cy="25" r="1.5" fill="#ADFF2F" opacity="0.6"/>
        </motion.svg>
        
        {/* The Black Moon (covering the core of the eclipse) */}
        <div className="absolute inset-[22%] rounded-full bg-[#030303] shadow-[inset_0_0_80px_rgba(0,0,0,1)] z-10 border border-white/5"></div>
      </div>

    </div>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center pt-24 lg:pt-0 bg-[#000000] px-6 md:px-10 lg:px-20 overflow-hidden" id="home">
      
      {/* Zen Eclipse Background Visual */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ZenEclipse />
      </div>

      {/* Orbiting Glassmorphic UI Cards */}
      <GlassCard delay={0} floatingRange={[-15, 15]} style={{ top: '25%', left: '10%', rotate: -6 }} icon="dashboard" />
      <GlassCard delay={1.5} floatingRange={[15, -15]} style={{ bottom: '20%', left: '15%', rotate: 8 }} icon="analytics" />
      <GlassCard delay={0.7} floatingRange={[-20, 10]} style={{ top: '35%', right: '10%', rotate: 12 }} icon="smartphone" />
      <GlassCard delay={2.2} floatingRange={[10, -20]} style={{ bottom: '25%', right: '18%', rotate: -5 }} icon="code" />

      {/* Main Content Overlay */}
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center z-30 relative mt-10 lg:mt-0 pointer-events-none">
        <motion.div className="flex flex-col text-center xl:text-left pointer-events-auto items-center xl:items-start" style={{ y: yText, opacity: opacityText }}>
          
          {/* Improved Visibility for Overline text with a glassmorphism pill */}
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-accent/20 bg-black/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] mb-8">
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs drop-shadow-[0_0_8px_rgba(173,255,47,0.5)]">
              La Agencia Para Líderes
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-black italic uppercase tracking-tighter leading-[0.85] mb-8 text-white text-center xl:text-left drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] filter">
            DOMINA TU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] via-[#e2e8f0] to-[#64748b] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] pr-2">MERCADO</span>
          </h2>
          
          {/* Improved Copywriting: Benefit-driven, specific, and clear */}
          <p className="text-slate-200 text-lg md:text-xl lg:text-2xl max-w-2xl mb-12 font-medium leading-relaxed text-center xl:text-left drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] px-2 sm:px-0">
            Diseñamos ecosistemas digitales de élite que transforman clics en clientes de alto valor. Deja de competir, comienza a liderar y multiplica tus ventas garantizado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center xl:justify-start w-full px-4 sm:px-0">
            <a href="#contact" className="inline-flex items-center justify-center w-full sm:w-auto bg-[#ADFF2F] hover:bg-[#97e028] shadow-[0_0_40px_rgba(173,255,47,0.4)] text-black px-10 py-5 rounded-2xl text-base sm:text-lg font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 text-center">
              Iniciar Proyecto
            </a>
            <a href="#portfolio" className="inline-flex items-center justify-center w-full sm:w-auto bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/10 hover:bg-white/[0.08] text-white px-10 py-5 rounded-2xl text-base sm:text-lg font-bold transition-all hover:border-white/30 active:scale-95 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Ver Casos de Éxito
            </a>
          </div>
        </motion.div>
      </div>

      {/* Dark overlay that covers the section as we scroll down */}
      <motion.div
        className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none transition-opacity duration-500"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.25], [0, 1]), zIndex: 10 }}
      />
    </section>
  );
};

const ServiceCard = ({ icon, title, description, features, cta, index, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -10,
        borderColor: '#7B2CBF',
        boxShadow: '0 0 40px rgba(123, 44, 191, 0.2)'
      }}
      className={`p-8 md:p-10 bg-[#111111] border border-white/5 rounded-3xl transition-all duration-500 group cursor-default relative overflow-hidden flex flex-col h-full ${className || ''}`}
    >
      <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500">
        <span className="material-symbols-outlined text-accent text-5xl group-hover:scale-110 transition-transform duration-700">
          {icon}
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-400 mb-8 leading-relaxed text-lg">{description}</p>

      <div className="flex flex-wrap gap-2 mb-10">
        {features.map((feature, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
            {feature}
          </span>
        ))}
      </div>

      <a href="#contact" className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm group/link mt-auto">
        {cta}
        <span className="material-symbols-outlined text-lg group-hover/link:translate-x-2 transition-transform duration-300">east</span>
      </a>

      {/* Subtle corner glow */}
      <div className="absolute -bottom-20 -right-20 size-40 bg-primary/10 blur-[60px] group-hover:bg-primary/30 transition-colors duration-700"></div>
    </motion.div>
  );
};

const ProximamenteCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.5 }}
    className="mt-6 lg:mt-8 p-8 md:p-12 bg-[#0D0D0D] border-2 border-dashed border-[#444444] rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
  >
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10 w-full md:w-auto">
      <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
        <span className="material-symbols-outlined text-accent text-3xl">rocket_launch</span>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Nuevas Soluciones</h3>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">Próximamente</span>
        </div>
        <p className="text-slate-400 font-medium">Nuevos productos en desarrollo para seguir acelerando tu crecimiento</p>
      </div>
    </div>

    <div className="w-full md:w-auto flex-1 max-w-md z-10 flex flex-col sm:flex-row gap-3"></div>

    {/* Subtle corner glow */}
    <div className="absolute -top-20 -right-20 size-60 bg-primary/5 blur-[80px] pointer-events-none"></div>
  </motion.div>
);

const Services = () => {
  const servicesData = [
    {
      icon: 'web',
      title: 'Landing Pages de Alta Conversión',
      description: 'Embudos digitales optimizados para capturar leads y generar ventas en automático las 24 horas del día.',
      features: ['Orientado a ventas', 'Ultra-Rápido', 'Embudos'],
      cta: 'Multiplicar ventas',
      className: 'md:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-1'
    },
    {
      icon: 'draw',
      title: 'Identidad Visual Premium',
      description: 'Diseño que transmite confianza y autoridad. Elevamos la percepción de valor de tu marca.',
      features: ['Branding', 'Marcas', 'Assets'],
      cta: 'Elevar mi marca',
      className: 'md:col-span-1 lg:col-span-1 lg:col-start-1 lg:row-start-2'
    },
    {
      icon: 'play_circle',
      title: 'Audiovisual Magnético',
      description: 'Videos dinámicos que capturan la atención en 3 segundos y convierten espectadores en clientes.',
      features: ['Edición TikTok/Reels', 'Animación', 'Alto impacto'],
      cta: 'Hacer que me vean',
      className: 'md:col-span-1 lg:col-span-1 lg:row-span-2 lg:col-start-3 lg:row-start-1'
    },
    {
      icon: 'shopping_cart',
      title: 'E-commerce Escalables',
      description: 'Sistemas de venta ininterrumpidos. Plataformas rápidas diseñadas para maximizar el ticket promedio.',
      features: ['Shopify', 'WooCommerce', 'Pagos'],
      cta: 'Vender online',
      className: 'md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-2'
    },
    {
      icon: 'sync',
      title: 'Automatización RCM',
      description: 'Control total de tu flujo de caja. Eliminamos el error humano en facturación y optimizamos pagos.',
      features: ['Facturación', 'Inteligencia', 'Flujo de caja'],
      cta: 'Optimizar ingresos',
      className: 'md:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-3'
    }
  ];

  return (
    <section className="py-32 px-6 md:px-10 lg:px-20 bg-background-dark relative overflow-hidden" id="services">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 lg:mb-24 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="max-w-3xl">
            <span className="text-accent font-black uppercase tracking-[0.5em] text-xs mb-6 block drop-shadow-[0_0_10px_rgba(173,255,47,0.5)]">RESULTADOS TANGIBLES</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tighter leading-[0.85] mb-6 sm:mb-8">
              Sistemas digitales que <br className="hidden md:block" />
              generan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-2">ventas</span>
            </h2>
          </div>
          <p className="text-slate-400 text-xl font-medium max-w-sm lg:mb-4">No solo creamos pantallas bonitas; construimos activos digitales diseñados para asegurar tu crecimiento.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        <ProximamenteCard />
      </div>

      {/* Background accents */}
      <div className="absolute top-0 right-0 size-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 size-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};

const PortfolioCard = ({ item }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-video rounded-2xl overflow-hidden bg-[#111111] border border-[#222222] cursor-pointer"
    >
      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={item.img} alt={item.title} />

      <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black via-black/80 to-transparent md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-300 p-6 flex flex-col justify-end">
        <h4 className="text-white text-2xl font-black italic mb-3">{item.title}</h4>
        <div className="flex flex-wrap gap-2 mb-2">
          {item.categories.map((cat, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-[#1A1A1A] text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-accent/20">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7B2CBF]/50 rounded-2xl transition-colors duration-300"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_0_0_rgba(123, 44, 191,0)] group-hover:shadow-[inset_0_0_30px_rgba(123, 44, 191,0.2)] transition-shadow duration-300 pointer-events-none rounded-2xl"></div>
    </motion.div>
  );
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Landing Pages', 'E-commerce', 'Diseño', 'Video', 'RCM'];

  const projects = [
    {
      id: 1,
      title: 'Clínica del Sol',
      categories: ['Landing Pages', 'RCM'],
      img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Tienda Verde',
      categories: ['E-commerce', 'Diseño'],
      img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Marca Personal Coach',
      categories: ['Diseño', 'Video'],
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Restaurante Sabor',
      categories: ['Video', 'Landing Pages'],
      img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Consultora ABC',
      categories: ['Landing Pages', 'RCM'],
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Fitness Pro',
      categories: ['E-commerce', 'Diseño', 'Video'],
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const filteredProjects = activeFilter === 'Todos'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <>
      <section className="py-24 px-6 md:px-10 lg:px-20 bg-[#0A0A0A]" id="portfolio">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-black uppercase tracking-[0.4em] text-xs mb-4 block">NUESTRO TRABAJO</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white italic tracking-tighter leading-[0.9] mb-6">
                Proyectos que hablan <br className="hidden md:block" /> por sí solos
              </h2>
              <p className="text-slate-400 text-lg font-medium">Cada proyecto es una historia de transformación digital</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto pb-4 mb-12 hide-scrollbar justify-start md:justify-center gap-2 md:gap-4 px-2 -mx-2 md:mx-0">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${activeFilter === filter
                  ? 'bg-accent text-black border-accent shadow-[0_0_15px_rgba(173,255,47,0.4)]'
                  : 'bg-transparent text-white border-[#222222] hover:border-white/40'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#7B2CBF] to-[#1A0A2E] border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter mb-4">
            ¿Listo para dominar tu mercado?
          </h2>
          <p className="text-white/80 text-lg mb-10 font-medium max-w-lg">
            Agenda una consulta estratégica hoy y descubre cómo nuestro ecosistema digital multiplicará tus ingresos de forma medible.
          </p>
          <a href="#contact" className="inline-block w-full sm:w-auto bg-black hover:bg-[#111111] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 hover:border-accent">
            AGENDAR CONSULTA GRATUITA
          </a>
        </div>
      </section>
    </>
  );
};

const Testimonials = () => {
  const testimonials = [
    { text: "Kaiten transformó por completo nuestra presencia online. Su atención al detalle en el diseño web es insuperable.", name: "Sarah Jenkins", title: "CEO, TechFlow", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_BqLTauDQnNYLMgR0jgmh-wz27Z3CyYDlnQnyeozQFAUHeeulyMCYetpuJIOWbZk0Wir5S8xlWcmlqIyMyq5pKISFANbxfMfTBfzhIRc1iGWp5VB5aiROOg_ZG664euXKJ_a7KUr8dfA0i1lfux9QNk7yiHfw93cZZ103pupPUzoMGbOmC7-R8Fbtrbprn71T4H0BiuvlIBDX6JdfZK3qhEAJXC-pQ1s9S-B1zQk5vYkKI6Nom6mkBkkr0vkCy3nADcv2IYu__Qzi" },
    { text: "La aplicación móvil que desarrollaron superó nuestras expectativas de rendimiento. El equipo es altamente profesional.", name: "Marcus Thorne", title: "Product Director, Nexus", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEDcUZL4bCAvFM3iWLdtJxtYCEq5yO08HwtoPeOwnBlMQpOHcON8Kse9I1kCOvNGO06j1i5-3hwKckA8tH4ul0zi6AZfqdWQQacTHH-3H1d0Ru5ye4wHYg5PuiagKinFh-xmLSyxQxkp_g34LCK7AqBGF4gLx7z0aM8WPUd1VdYdIGVASSB9uHqlS_MQdZak83rOeyPwM7XXNCmn8bb9IKCP16qLF1yChd3Mb05Z38SnhTRkl5PEDYa_vM8d6rJb9fwFoZcUlp-aQp" },
    { text: "Sus ediciones de video le dieron a nuestra marca una voz visual moderna que resuena perfectamente con nuestra audiencia.", name: "Elena Rodriguez", title: "Marketing Lead, Aura", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn9bFxSeWZTpqhafJPnV0jKykFoFtz_r8Vqe8jxcxj9N5Vd-Q5TOrglAXWZ610UoUagJsLnfn4fXAiDlImbalEiU-0LM4cnKlVoPk60E-rG1i2XjIMfFGXVVEIFjz94o2MGaVoFik0a3Z7rmJABfThV3VMGdvisEd3fxw6hj80m9EMyM60j3-_l8TwpWMEj6RyZQ8mQ1J6BzvE5JABtFvHk7CCSj0s8NCfG96z3wkB74RvYNB4M3VbmR1wBxj4wTnCp-c8WQM2-igI" }
  ];

  return (
    <section className="py-24 px-6 md:px-10 lg:px-20 bg-background-dark" id="testimonials">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Feedback</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-2 italic">Testimonios</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 relative mt-4">
              <span className="material-symbols-outlined text-primary text-4xl absolute -top-4 -left-2 bg-background-dark px-2">format_quote</span>
              <p className="text-slate-300 italic leading-relaxed text-lg">"{t.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="size-12 rounded-full bg-slate-700">
                  <img className="rounded-full w-full h-full object-cover" src={t.img} alt={t.name} />
                </div>
                <div>
                  <h5 className="text-white font-bold">{t.name}</h5>
                  <p className="text-accent text-xs">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCardDesktop = ({ step, index }) => {
  const targetNumber = (index + 1).toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="group pt-12 cursor-pointer h-full flex flex-col"
    >
      <div className="relative mb-8 flex justify-center">
        <div className="size-16 rounded-2xl bg-[#111111] border border-white/10 flex items-center justify-center group-hover:border-accent transition-all duration-500 shadow-xl relative z-10">
          <span className="material-symbols-outlined text-accent text-3xl">{step.icon}</span>
        </div>
      </div>

      <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-white font-black italic text-2xl group-hover:text-accent transition-colors relative z-10">{step.title}</h4>
          <span className="text-4xl font-black italic font-mono relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent pr-1">
            0{targetNumber}
          </span>
        </div>
        <p className="text-slate-400 leading-relaxed mb-6 relative z-10">{step.desc}</p>
        <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest relative z-10 mt-auto">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {step.time}
        </div>
      </div>
    </motion.div>
  );
};

const ProcessCardMobile = ({ step, index }) => {
  const targetNumber = (index + 1).toString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="relative pl-8 md:pl-12 cursor-pointer"
    >
      <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
          <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <span className="material-symbols-outlined text-accent text-2xl">{step.icon}</span>
          </div>
          <span className="text-4xl font-black italic font-mono text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent pr-1">
            0{targetNumber}
          </span>
        </div>
        <h4 className="text-white font-black italic text-2xl mb-3">{step.title}</h4>
        <p className="text-slate-400 mb-6">{step.desc}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-primary text-xs font-black uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {step.time}
        </div>
      </div>
    </motion.div>
  );
};

const Process = () => {
  const steps = [
    {
      id: '01',
      title: 'Auditoría Estratégica',
      desc: 'Mapeamos tu negocio y detectamos fugas de clientes para diseñar un plan de ataque.',
      time: '1-2 días',
      icon: 'chat_bubble'
    },
    {
      id: '02',
      title: 'Plano de Conversión',
      desc: 'Diseñamos wireframes y prototipos enfocados en guiar al usuario hacia la compra.',
      time: '2-3 días',
      icon: 'description'
    },
    {
      id: '03',
      title: 'Desarrollo Digital',
      desc: 'Programamos tu solución con código limpio y animaciones fluidas que enamoran.',
      time: '1-4 semanas',
      icon: 'code'
    },
    {
      id: '04',
      title: 'Lanzamiento y Escala',
      desc: 'Te entregamos las llaves de tu nuevo motor de ventas, listo para escalar tu negocio.',
      time: 'Y más allá',
      icon: 'rocket_launch'
    }
  ];

  return (
    <section className="py-24 px-6 md:px-10 lg:px-20 bg-[#0A0A0A] relative overflow-hidden" id="process">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-black uppercase tracking-[0.5em] text-xs mb-4 block">NUESTRO MÉTODO</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.85] mb-6">
              Un flujo de trabajo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-2">para ganar</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Sin demoras, sin excusas. Solo resultados construidos paso a paso.</p>
          </motion.div>
        </div>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative mb-32">
          {/* Connecting Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 z-0"
          ></motion.div>

          <div className="grid grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <ProcessCardDesktop key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Timeline Mobile/Tablet */}
        <div className="lg:hidden relative pb-12">
          {/* Vertical Line */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute left-4 top-0 w-[2px] bg-gradient-to-b from-primary via-accent to-primary z-0"
          ></motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <ProcessCardMobile key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


const ContactHub = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    budget: '',
    timeframe: '',
    name: '',
    email: '',
    whatsapp: ''
  });
  const [formErrors, setFormErrors] = useState({ name: false, email: false, whatsapp: false });
  const [countryCode, setCountryCode] = useState('+58');
  const [isSuccess, setIsSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountStatus, setDiscountStatus] = useState('idle'); // idle, loading, success, error
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountMessage, setDiscountMessage] = useState('');

  const steps = [
    {
      title: '¿CÓMO PODEMOS IMPULSAR TU NEGOCIO?',
      options: [
        'Landing page informativa',
        'Tienda online / E-commerce',
        'Diseño gráfico / Branding',
        'Edición de video',
        'Sistema RCM / Facturación',
        'No estoy seguro, necesito asesoría'
      ],
      field: 'service'
    },
    {
      title: '¿CUÁL ES EL NIVEL DE INVERSIÓN ESTIMADO?',
      options: [
        'Menos de $150 USD',
        '$150 - $400 USD',
        '$400 - $800 USD',
        'Más de $800 USD',
        'Prefiero discutir los números en llamada'
      ],
      field: 'budget'
    },
    {
      title: '¿PARA CUÁNDO ESPERAS LANZAR EL PROYECTO?',
      options: [
        'Lo antes posible',
        'En 2-4 semanas',
        'En 1-2 meses',
        'Sin prisa, estoy planeando'
      ],
      field: 'timeframe'
    }
  ];

  const handleOptionSelect = (option) => {
    const currentField = steps[step - 1].field;
    setFormData(prev => ({ ...prev, [currentField]: option }));
    setTimeout(() => {
      setStep(prev => Math.min(prev + 1, 4));
    }, 300);
  };

  const validCodes = {
    'KAITEN20': { percent: 20, description: '20% de descuento aplicado' },
    'LANZAMIENTO': { percent: 15, description: '15% de descuento por lanzamiento' },
    'AMIGO': { percent: 10, description: '10% de descuento especial' },
    'WEB50': { percent: 50, description: '50% en Landing Pages' }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;

    setDiscountStatus('loading');

    setTimeout(() => {
      const code = discountCode.trim().toUpperCase();
      if (validCodes[code]) {
        if (code === 'WEB50' && formData.service !== 'Landing page informativa') {
          setDiscountStatus('error');
          setDiscountMessage('El código WEB50 es solo para Landing Pages');
          return;
        }
        setAppliedDiscount({ code, ...validCodes[code] });
        setDiscountStatus('success');
        setDiscountMessage(`¡${validCodes[code].percent}% de descuento aplicado!`);
      } else {
        setDiscountStatus('error');
        setDiscountMessage('Código no válido o expirado');
      }
    }, 800);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountStatus('idle');
    setDiscountMessage('');
  };

  const getSimulatedPrice = () => {
    switch (formData.budget) {
      case 'Menos de $150 USD': return 120;
      case '$150 - $400 USD': return 275;
      case '$400 - $800 USD': return 600;
      case 'Más de $800 USD': return 1200;
      default: return 0;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      whatsapp: !formData.whatsapp.trim() || formData.whatsapp.length < 4
    };

    setFormErrors(errors);

    if (errors.name || errors.email || errors.whatsapp) {
      return; 
    }

    setIsSuccess(true);

    const fullClientPhone = `${countryCode} ${formData.whatsapp}`;

    const baseMessage = `🚀 *Nueva Solicitud Estratégica - KAITEN*\n\n` +
      `👤 *Nombre:* ${formData.name}\n` +
      `✉️ *Email:* ${formData.email}\n` +
      `📱 *WhatsApp:* ${fullClientPhone}\n` +
      `🎯 *Servicio de interés:* ${formData.service || 'No especificado'}\n` +
      `💰 *Inversión estimada:* ${formData.budget || 'No especificado'}\n` +
      `⏳ *Tiempo esperado:* ${formData.timeframe || 'No especificado'}\n\n` +
      `¡Hola equipo Kaiten! ✨ Me gustaría conversar sobre mi proyecto. Quedo atento/a.`;
      
    const discountText = appliedDiscount 
      ? `\n\n🎁 *Código VIP:* ${appliedDiscount.code} (-${appliedDiscount.percent}%)` 
      : '';

    const encodedMessage = encodeURIComponent(baseMessage + discountText);
    const whatsappUrl = `https://wa.me/584125626559?text=${encodedMessage}`;

    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 2000);
  };

  const progress = (step / 4) * 100;

  return (
    <section className="py-24 px-6 md:px-10 lg:px-20 bg-[#0A0A0A] relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <span className="text-accent font-black uppercase tracking-[0.5em] text-xs mb-4 block">CONTACTO</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.85]">
            Hablemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pr-2">de tu proyecto</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium mt-6">Elige cómo quieres contactarnos: cotización rápida o contacto directo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Main Content: WhatsApp Flow (70%) */}
          <div className="lg:col-span-8 bg-[#111111] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Progress Bar Container */}
            <div className="mb-12">
              <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_15px_#ADFF2F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-black tracking-widest transition-colors ${step >= s ? 'text-accent' : 'text-slate-600'}`}>PASO 0{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step < 4 ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-10">
                        <span className="text-accent text-xs font-black uppercase tracking-[0.3em]">Cotización Rápida</span>
                        <div className="h-px flex-grow bg-white/5"></div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">{steps[step - 1].title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {steps[step - 1].options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`text-left p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${formData[steps[step - 1].field] === option
                              ? 'bg-accent/10 border-accent shadow-[0_0_25px_rgba(173,255,47,0.15)]'
                              : 'bg-[#161616] border-white/5 hover:border-accent/40 hover:bg-[#1a1a1a]'
                              }`}
                          >
                            <div className="flex items-center justify-between relative z-10 transition-transform duration-300 group-active:scale-95">
                              <span className={`font-bold text-lg transition-colors ${formData[steps[step - 1].field] === option ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                {option}
                              </span>
                              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${formData[steps[step - 1].field] === option ? 'border-accent bg-accent rotate-0 scale-100' : 'border-white/10 rotate-45 scale-75 opacity-0'
                                }`}>
                                {formData[steps[step - 1].field] === option && <span className="material-symbols-outlined text-[16px] text-black font-black">check</span>}
                              </div>
                            </div>
                            {formData[steps[step - 1].field] === option && (
                              <motion.div layoutId="optionGlow" className="absolute inset-0 bg-accent/5 pointer-events-none " />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="pt-8 flex justify-between items-center">
                        {step > 1 && (
                          <button
                            onClick={() => setStep(prev => prev - 1)}
                            className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Atrás
                          </button>
                        )}
                        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest ml-auto">Selecciona una opción para continuar</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFinalSubmit} className="space-y-8" noValidate>
                      <div className="flex items-center gap-4 mb-10">
                        <span className="text-accent text-xs font-black uppercase tracking-[0.3em]">Finalizar Cotización</span>
                        <div className="h-px flex-grow bg-white/5"></div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tight underline decoration-accent/30 decoration-4 underline-offset-8">TUS DATOS</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${formErrors.name ? 'text-red-500' : 'text-slate-500'}`}>
                              Nombre completo {formErrors.name && '*'}
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, name: e.target.value }));
                                if (formErrors.name) setFormErrors(prev => ({ ...prev, name: false }));
                              }}
                              placeholder="Tu nombre"
                              className={`w-full bg-[#161616] border rounded-xl px-5 py-4 text-white focus:outline-none transition-all placeholder:text-slate-700 ${
                                formErrors.name ? 'border-red-500 focus:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5' : 'border-white/10 focus:border-accent'
                              }`}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${formErrors.email ? 'text-red-500' : 'text-slate-500'}`}>
                              Correo electrónico {formErrors.email && '*'}
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, email: e.target.value }));
                                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: false }));
                              }}
                              placeholder="email@ejemplo.com"
                              className={`w-full bg-[#161616] border rounded-xl px-5 py-4 text-white focus:outline-none transition-all placeholder:text-slate-700 ${
                                formErrors.email ? 'border-red-500 focus:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5' : 'border-white/10 focus:border-accent'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${formErrors.whatsapp ? 'text-red-500' : 'text-slate-500'}`}>
                            Número de WhatsApp {formErrors.whatsapp && '*'}
                          </label>
                          <div className="flex gap-2 relative group">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className={`w-[110px] sm:w-[130px] bg-[#161616] border rounded-xl px-2 sm:px-3 py-4 text-white focus:outline-none transition-all ${
                                formErrors.whatsapp ? 'border-red-500 focus:border-red-400 bg-red-500/5' : 'border-white/10 focus:border-accent'
                              }`}
                            >
                              <option value="+58">VE (+58)</option>
                              <option value="+57">CO (+57)</option>
                              <option value="+54">AR (+54)</option>
                              <option value="+56">CL (+56)</option>
                              <option value="+52">MX (+52)</option>
                              <option value="+34">ES (+34)</option>
                              <option value="+1">US (+1)</option>
                              <option value="+51">PE (+51)</option>
                              <option value="+593">EC (+593)</option>
                              <option value="+507">PA (+507)</option>
                              <option value="+506">CR (+506)</option>
                            </select>
                            <div className="relative flex-grow">
                              <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => {
                                  setFormData(prev => ({ ...prev, whatsapp: e.target.value }));
                                  if (formErrors.whatsapp) setFormErrors(prev => ({ ...prev, whatsapp: false }));
                                }}
                                placeholder="412 562 6559"
                                className={`w-full bg-[#161616] border rounded-xl pl-4 pr-10 py-4 text-white focus:outline-none transition-all placeholder:text-slate-700 ${
                                  formErrors.whatsapp ? 'border-red-500 focus:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5 placeholder:text-red-900/40 text-red-100' : 'border-white/10 focus:border-accent'
                                }`}
                              />
                              <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.whatsapp ? 'text-red-500' : 'text-slate-600 group-focus-within:text-accent'}`}>phone_iphone</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Discount Code Section */}
                      <div className="pt-4 pb-2">
                        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 relative overflow-hidden shadow-inner">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ADFF2F] mb-3 block">¿Tienes un código de descuento?</label>

                          {!appliedDiscount ? (
                            <div className="flex gap-3">
                              <div className="relative flex-grow">
                                <input
                                  type="text"
                                  value={discountCode}
                                  onChange={(e) => {
                                    setDiscountCode(e.target.value.toUpperCase());
                                    if (discountStatus === 'error') setDiscountStatus('idle');
                                  }}
                                  placeholder="Ingresa tu código"
                                  className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3 text-white focus:outline-none transition-all uppercase placeholder:normal-case font-bold tracking-wider ${discountStatus === 'error' ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-[#333333] focus:border-accent'
                                    }`}
                                  disabled={discountStatus === 'loading'}
                                />
                                {discountStatus === 'error' && (
                                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-red-500">cancel</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={handleApplyDiscount}
                                disabled={!discountCode.trim() || discountStatus === 'loading'}
                                className="bg-[#7B2CBF] hover:bg-[#8e39db] disabled:bg-[#333333] disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center min-w-[100px] shadow-[0_0_15px_rgba(123, 44, 191,0.3)] disabled:shadow-none"
                              >
                                {discountStatus === 'loading' ? (
                                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                ) : (
                                  'Aplicar'
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="flex bg-[#ADFF2F]/10 border border-[#ADFF2F]/30 rounded-xl p-3 items-center justify-between shadow-[0_0_20px_rgba(173,255,47,0.1)]">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-[#ADFF2F] flex items-center justify-center shadow-[0_0_10px_rgba(173,255,47,0.5)]">
                                  <span className="material-symbols-outlined text-black font-bold text-sm">check</span>
                                </div>
                                <div>
                                  <p className="text-white font-bold tracking-wide">{appliedDiscount.code}</p>
                                  <p className="text-[#ADFF2F] text-xs font-bold">{appliedDiscount.description}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveDiscount}
                                className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          )}

                          {discountStatus === 'error' && !appliedDiscount && (
                            <p className="text-red-500 text-xs mt-2 font-bold">{discountMessage}</p>
                          )}

                          {/* Price Calculator Visualization */}
                          {appliedDiscount && getSimulatedPrice() > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                              <div>
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Inversión estimada</p>
                                <p className="text-slate-500 font-bold line-through text-sm">{formatPrice(getSimulatedPrice())} USD</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <span className="bg-[#ADFF2F]/20 text-[#ADFF2F] font-black text-xs px-2 py-1 rounded">- {appliedDiscount.percent}%</span>
                                <p className="text-white font-black text-2xl">{formatPrice(getSimulatedPrice() * (1 - appliedDiscount.percent / 100))} <span className="text-sm text-slate-400">USD</span></p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 flex flex-col md:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="px-8 py-5 border border-white/10 rounded-2xl text-slate-500 font-bold hover:bg-white/5 transition-all uppercase tracking-widest text-sm"
                        >
                          Regresar
                        </button>
                        <button
                          type="submit"
                          className="flex-grow bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-lg transition-all shadow-[0_15px_35px_rgba(37,211,102,0.25)] flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                          <svg className="size-6 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.376c1.47.884 3.193 1.353 4.953 1.353 5.401 0 9.799-4.398 9.802-9.799.002-2.618-1.017-5.078-2.871-6.931-1.854-1.854-4.316-2.873-6.936-2.873-5.399 0-9.796 4.397-9.799 9.797-.001 1.761.468 3.479 1.357 4.953l-1.026 3.743 3.824-.997zm11.387-4.464c-.301-.15-1.779-.878-2.053-.978-.275-.1-.475-.15-.675.15-.199.301-.775.978-.95 1.178-.175.199-.35.225-.65.075-.3-.15-1.268-.467-2.413-1.487-.892-.795-1.494-1.778-1.669-2.078-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.148-.175.199-.301.3-.5.1-.199.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.59-.491-.51-.675-.52-.174-.01-.374-.012-.574-.012s-.525.076-.8.376c-.275.3-1.05 1.028-1.05 2.508s1.075 2.903 1.225 3.103c.15.2.2.35.474.774 1.196 1.838 2.585 2.768 3.978 3.328.79.317 1.489.339 2.052.255.626-.094 1.778-.727 2.028-1.428s.25-.15.175-.3c-.075-.15-.275-.225-.575-.375z" />
                          </svg>
                          Enviar a WhatsApp
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="size-24 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#25D366]/30">
                    <span className="material-symbols-outlined text-[#25D366] text-6xl animate-bounce">check_circle</span>
                  </div>
                  <h2 className="text-3xl font-black text-white italic mb-4">¡Todo listo!</h2>
                  <p className="text-slate-400 text-lg mb-8">Abriendo WhatsApp para iniciar la conversación...</p>
                  <div className="max-w-xs h-1.5 bg-white/5 mx-auto rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#25D366] shadow-[0_0_15px_#25D366]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Side (30%) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Hablamos Humano</span>
                <div className="h-px flex-grow bg-white/5"></div>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="size-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 group-hover:bg-[#25D366]/20 transition-all duration-500">
                    <svg className="size-7 fill-[#25D366] group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.376c1.47.884 3.193 1.353 4.953 1.353 5.401 0 9.799-4.398 9.802-9.799.002-2.618-1.017-5.078-2.871-6.931-1.854-1.854-4.316-2.873-6.936-2.873-5.399 0-9.796 4.397-9.799 9.797-.001 1.761.468 3.479 1.357 4.953l-1.026 3.743 3.824-.997zm11.387-4.464c-.301-.15-1.779-.878-2.053-.978-.275-.1-.475-.15-.675.15-.199.301-.775.978-.95 1.178-.175.199-.35.225-.65.075-.3-.15-1.268-.467-2.413-1.487-.892-.795-1.494-1.778-1.669-2.078-.175-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.148-.175.199-.301.3-.5.1-.199.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.59-.491-.51-.675-.52-.174-.01-.374-.012-.574-.012s-.525.076-.8.376c-.275.3-1.05 1.028-1.05 2.508s1.075 2.903 1.225 3.103c.15.2.2.35.474.774 1.196 1.838 2.585 2.768 3.978 3.328.79.317 1.489.339 2.052.255.626-.094 1.778-.727 2.028-1.428s.25-.15.175-.3c-.075-.15-.275-.225-.575-.375z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">WhatsApp</p>
                    <a href="https://wa.me/584125626559" target="_blank" rel="noopener noreferrer" className="text-white text-xl font-bold hover:text-[#25D366] transition-colors">+58 412 562 6559</a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all duration-500">
                    <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:kaiten.ve@gmail.com" className="text-white text-xl font-bold hover:text-accent transition-colors">kaiten.ve@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all duration-500">
                    <span className="material-symbols-outlined text-slate-400 text-3xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Horario</p>
                    <p className="text-white text-xl font-bold">Lun-Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-[#111111] to-[#0D0D0D] border border-white/10 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-white font-black italic text-2xl mb-4">Ubicación</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">Caracas, Venezuela / <br /> Remoto worldwide</p>
                </div>
                <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-[60px] translate-x-1/2 -translate-y-1/2 rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-white">public</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">SOCIAL:</p>
                <div className="flex gap-4">
                  {['Instagram', 'LinkedIn', 'Behance'].map((social) => (
                    <a key={social} href="javascript:void(0)" className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-all">
                      <span className="material-symbols-outlined text-xl">share</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background glow */}
      <div className="absolute -bottom-40 -right-40 size-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-[#A1A1AA] pt-20 pb-10 px-6 md:px-10 lg:px-20 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center">
                <svg className="underline w-full h-full text-white" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
                  <circle cx="10" cy="50" fill="#ADFF2F" r="4" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white italic">KAITEN</h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Transformación digital que no se detiene. Innovación y diseño audaz para el futuro del RCM y el branding.
            </p>

            

            <div className="flex gap-4 pt-2">
              {['Instagram', 'LinkedIn', 'Behance', 'Dribbble'].map((social) => (
                <a key={social} href="javascript:void(0)" className="text-[#A1A1AA] hover:text-accent transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Servicios */}
          <div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8">Servicios</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Landing Pages', 'Diseño Gráfico', 'Edición Video', 'E-commerce', 'RCM'].map((link) => (
                <li key={link}>
                  <a href="javascript:void(0)" className="hover:text-accent transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-accent transition-all group-hover:w-3"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Nosotros */}
          <div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8">Nosotros</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Proceso', 'Portfolio', 'Contacto'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="hover:text-accent transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-accent transition-all group-hover:w-3"></span>
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-white/30 cursor-not-allowed flex items-center gap-2">
                  Blog <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">PRÓXIMAMENTE</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Términos de servicio', 'Política de privacidad'].map((link) => (
                <li key={link}>
                  <a href="javascript:void(0)" className="hover:text-accent transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-[1px] bg-accent transition-all group-hover:w-3"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#52525B]">© 2026 Kaiten. Todos los derechos reservados.</p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white hover:text-accent transition-colors"
          >
            <span>Back to top</span>
            <div className="size-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
              <span className="material-symbols-outlined text-sm group-hover:-translate-y-1 transition-transform">arrow_upward</span>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [showPixelClock, setShowPixelClock] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowPixelClock(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-display bg-background-dark text-slate-100 antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <ContactHub />
      </main>
      <Footer />
      <PixelClock visible={showPixelClock} />
    </div>
  );
}
