"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function Overlay() {
  return (
    <div className="relative z-[5] pt-20">
      <Section1Surface />
      <Section2Histoire />
      <Section3Casabianca />
      <Section4Experience />
      <Section5Biodiversite />
      <Section6Contact />
    </div>
  );
}

// ============================================
// SECTION 1 : ACCUEIL
// ============================================
function Section1Surface() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        tl.fromTo(chars,
          { opacity: 0, y: 80, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.08, ease: "power3.out" }
        );
      }

      tl.fromTo(".surface-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
      tl.fromTo(".surface-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
      tl.fromTo(".surface-3", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");

      gsap.to(sectionRef.current, {
        y: -150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const title = "ABYSSE";

  return (
    <section ref={sectionRef} className="min-h-[130vh] flex items-center justify-center relative overflow-hidden snap-start">
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-white/5" />
        <div className="absolute left-[90%] top-0 bottom-0 w-px bg-white/5" />
      </div>

      <div className="text-center px-8 max-w-3xl -mt-64">
        <p className="surface-1 text-[10px] uppercase tracking-[0.5em] text-white/50 mb-6 drop-shadow-md font-medium">
          Musée Sous-Marin • Toulon
        </p>

        <h1
          ref={titleRef}
          className="text-[clamp(3.5rem,14vw,10rem)] font-light tracking-wide leading-[0.9] text-white mb-8 drop-shadow-lg"
          style={{ perspective: "800px" }}
        >
          {title.split("").map((char, i) => (
            <span key={i} className="char inline-block" style={{ transformStyle: "preserve-3d" }}>
              {char}
            </span>
          ))}
        </h1>

        <p className="surface-2 text-lg md:text-xl font-medium tracking-wide text-white/70 mb-5 drop-shadow-md">
          Explorez l'ultime frontière.
        </p>

        <p className="surface-3 text-sm font-medium leading-relaxed text-white/50 max-w-md mx-auto drop-shadow-sm">
          Une expérience immersive unique pour découvrir les mystères des profondeurs océaniques.
        </p>

        <div className="surface-3 mt-14 flex items-center justify-center gap-3">
          <div className="w-10 h-px bg-white/30" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-medium">Découvrir</span>
          <div className="w-10 h-px bg-white/30" />
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 2 : L'HISTOIRE
// ============================================
function Section2Histoire() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".hist-depth", ".hist-marker", ".hist-title", ".hist-tagline", ".hist-body", ".hist-stat"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[150vh] relative snap-start" id="histoire">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[150vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        <div className="col-span-12 md:col-span-5 md:col-start-2 flex flex-col justify-center">

          <div className="hist-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">L&apos;Histoire</span>
          </div>

          <div className="hist-marker flex items-center gap-3 mb-5">
            <span className="text-[#4CBBD5] font-mono text-xs">01</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Toulon, berceau de la plongée</span>
          </div>

          <h2 className="hist-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            TERRE DE<br />PIONNIERS
          </h2>

          <p className="hist-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Là où tout a commencé.
          </p>

          <p className="hist-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-sm drop-shadow-sm">
            1943. C&apos;est dans la rade de Toulon que les &quot;Mousquemers&quot; — Cousteau, Tailliez, Dumas —
            inventent la plongée autonome moderne. De Jules Verne au Bathyscaphe FNRS III,
            cette terre est le berceau de la conquête sous-marine mondiale.
          </p>

          <motion.div
            className="hist-stat p-5 border-l-2 border-[#4CBBD5]/60 bg-white/[0.03] backdrop-blur-sm cursor-pointer"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="block text-3xl font-light text-white mb-1"
              whileHover={{ scale: 1.1, color: "#4CBBD5" }}
              transition={{ duration: 0.2 }}
            >
              1943
            </motion.span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-white/50 font-medium">
              Invention du scaphandre autonome
            </span>
          </motion.div>
        </div>

        <div className="col-span-12 md:col-span-6" />
      </div>
    </section>
  );
}

// ============================================
// SECTION 3 : LE CASABIANCA (TEXTE À DROITE)
// ============================================
function Section3Casabianca() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".casa-depth", ".casa-marker", ".casa-title", ".casa-tagline", ".casa-body", ".casa-stats"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50, x: 20 },
          {
            opacity: 1, y: 0, x: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 50%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[160vh] relative snap-start" id="musee">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[160vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        {/* Espace vide à gauche */}
        <div className="col-span-12 md:col-span-5" />

        {/* Contenu à droite - aligné à droite */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center md:items-end md:text-right">

          <div className="casa-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">Le Musée</span>
          </div>

          <div className="casa-marker flex items-center gap-3 mb-5 md:flex-row-reverse">
            <span className="text-[#4CBBD5] font-mono text-xs">02</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Pièce maîtresse</span>
          </div>

          <h2 className="casa-title text-4xl md:text-6xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            LE<br />CASABIANCA
          </h2>

          <p className="casa-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Une cathédrale technologique sous les flots.
          </p>

          <p className="casa-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-md drop-shadow-sm">
            Pièce maîtresse du musée : un véritable Sous-marin Nucléaire d&apos;Attaque (SNA) de 2 600 tonnes,
            désarmé et transformé en espace d&apos;exposition. Explorez les entrailles de ce chasseur silencieux,
            symbole du génie naval français.
          </p>

          <div className="casa-stats grid grid-cols-3 gap-3 w-full max-w-md">
            {[
              { value: "2 600", label: "Tonnes" },
              { value: "73", label: "Mètres" },
              { value: "70", label: "Hommes" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-4 border border-white/10 text-center bg-white/[0.02] backdrop-blur-sm cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(76, 187, 213, 0.1)",
                  borderColor: "rgba(76, 187, 213, 0.3)"
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="block text-2xl font-light text-[#4CBBD5] mb-1"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-[8px] uppercase tracking-[0.1em] text-white/50 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4 : L'EXPÉRIENCE
// ============================================
function Section4Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".exp-depth", ".exp-marker", ".exp-title", ".exp-tagline", ".exp-body", ".exp-features"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[145vh] relative snap-start" id="experience">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[145vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        <div className="col-span-12 md:col-span-5 md:col-start-2 flex flex-col justify-center">

          <div className="exp-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">L&apos;Expérience</span>
          </div>

          <div className="exp-marker flex items-center gap-3 mb-5">
            <span className="text-[#4CBBD5] font-mono text-xs">03</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Immersion totale</span>
          </div>

          <h2 className="exp-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            PLONGEZ AU<br />CŒUR DES ABYSSES
          </h2>

          <p className="exp-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Une aventure sensorielle unique.
          </p>

          <p className="exp-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-sm drop-shadow-sm">
            Simulateurs de pilotage, expériences en réalité virtuelle, parcours immersifs...
            Découvrez les technologies françaises de pointe (Ifremer, Naval Group) et vivez
            l&apos;exploration sous-marine comme jamais auparavant.
          </p>

          <div className="exp-features grid grid-cols-2 gap-3">
            {[
              { title: "Simulateurs VR", sub: "Pilotez un ROV" },
              { title: "Parcours immersif", sub: "6 zones thématiques" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-4 border border-white/10 bg-white/[0.02] backdrop-blur-sm cursor-pointer"
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)"
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-sm font-medium text-white/90 mb-1 drop-shadow-sm">{feature.title}</span>
                <span className="text-[9px] text-white/50 font-medium">{feature.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6" />
      </div>
    </section>
  );
}

// ============================================
// SECTION 5 : BIODIVERSITÉ (TEXTE À DROITE)
// ============================================
function Section5Biodiversite() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".bio-depth", ".bio-marker", ".bio-title", ".bio-tagline", ".bio-body", ".bio-quote"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 50, x: 20 },
          {
            opacity: 1, y: 0, x: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 50%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[150vh] relative snap-start">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="min-h-[150vh] grid grid-cols-12 gap-6 px-6 md:px-12 lg:px-20 py-32">
        {/* Espace vide à gauche */}
        <div className="col-span-12 md:col-span-5" />

        {/* Contenu à droite - aligné à droite */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center md:items-end md:text-right">

          <div className="bio-depth mb-6">
            <span className="text-4xl font-light text-[#4CBBD5] drop-shadow-md">Les Abysses</span>
          </div>

          <div className="bio-marker flex items-center gap-3 mb-5 md:flex-row-reverse">
            <span className="text-[#4CBBD5] font-mono text-xs">04</span>
            <div className="w-10 h-px bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">90% inexploré</span>
          </div>

          <h2 className="bio-title text-4xl md:text-5xl font-light tracking-tight text-white mb-3 drop-shadow-lg">
            LA VIE DANS<br />L&apos;OBSCURITÉ
          </h2>

          <p className="bio-tagline text-base font-medium italic text-[#4CBBD5]/90 mb-6 drop-shadow-sm">
            Un monde fascinant à découvrir.
          </p>

          <p className="bio-body text-sm font-medium leading-[1.9] text-white/60 mb-8 max-w-md drop-shadow-sm">
            Bioluminescence, créatures extraordinaires, écosystèmes uniques... Les profondeurs
            océaniques abritent des merveilles que le musée vous invite à explorer. Comprendre
            ces environnements fragiles est essentiel pour les protéger.
          </p>

          <motion.div
            className="bio-quote p-5 border-r-2 border-l-0 border-[#4CBBD5]/40 bg-white/[0.03] backdrop-blur-sm max-w-md"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium italic text-white/60 mb-2 drop-shadow-sm">
              &quot;Un monde froid, obscur, bizarre... mais vivant.&quot;
            </p>
            <span className="text-[9px] uppercase tracking-[0.12em] text-white/40 font-medium">
              — Jacques-Yves Cousteau
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6 : CONTACT & PARTENAIRES
// ============================================
function Section6Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [".contact-marker", ".contact-title", ".contact-body", ".contact-info", ".contact-partners", ".contact-footer"];
      elements.forEach((sel, i) => {
        gsap.fromTo(sel,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[140vh] flex flex-col items-center justify-center relative px-6 md:px-12 snap-start" id="contact">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10" />

      <div className="text-center max-w-xl" id="partenaires">

        <div className="contact-marker flex items-center justify-center gap-3 mb-8">
          <span className="text-[#4CBBD5] font-mono text-xs">05</span>
          <div className="w-10 h-px bg-white/20" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Contact</span>
        </div>

        <h2 className="contact-title text-4xl md:text-5xl font-light tracking-tight text-white mb-6 drop-shadow-lg">
          NOUS<br />RENCONTRER
        </h2>

        <p className="contact-body text-sm font-medium leading-[1.9] text-white/60 mb-10 max-w-md mx-auto drop-shadow-sm">
          Le projet ABYSSE prend forme. Vous souhaitez en savoir plus, devenir partenaire
          ou simplement nous poser une question ? Contactez notre équipe.
        </p>

        <div className="contact-info flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <motion.a
            href="mailto:contact@musee-abysse.fr"
            className="group relative px-6 py-3 bg-[#4CBBD5] text-[#020A19] font-semibold text-xs uppercase tracking-[0.1em] overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">Nous contacter</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.a>
          <motion.a
            href="#"
            className="px-6 py-3 border border-white/20 text-white/70 font-semibold text-xs uppercase tracking-[0.1em] hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Dossier de presse
          </motion.a>
        </div>

        <div className="contact-partners pt-10 border-t border-white/10 max-w-lg mx-auto">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-6 font-medium">
            Nos partenaires
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Marine Nationale", "Région Sud", "Naval Group", "Ifremer"].map((partner, i) => (
              <motion.div
                key={i}
                className="text-center cursor-pointer"
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-sm font-medium text-white/60 drop-shadow-sm">{partner}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="contact-footer text-[8px] uppercase tracking-[0.15em] text-white/30 mt-12 font-medium">
          Musée ABYSSE — Toulon, France
        </p>
      </div>

      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[8px] uppercase tracking-[0.15em] text-white/25 font-medium">
          © 2024 Projet Abysse
        </p>
      </footer>
    </section>
  );
}
