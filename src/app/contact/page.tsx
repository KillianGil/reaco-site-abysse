/**
 * Page : Contact du Musée ABYSSE
 *
 * DESCRIPTION :
 * Page de contact complète avec formulaire d'envoi d'email, informations pratiques,
 * carte interactive Google Maps et section FAQ (Questions Fréquentes).
 *
 * FONCTIONNALITÉS PRINCIPALES :
 * 1. Informations de contact (email, téléphone, adresse, horaires)
 * 2. Formulaire de contact avec envoi via EmailJS
 * 3. Carte Google Maps intégrée avec iframe
 * 4. FAQ avec accordéon interactif
 *
 * INTÉGRATIONS :
 * - EmailJS : Service d'envoi d'email sans backend
 * - Google Maps : Carte interactive avec iframe
 * - GSAP : Animations au scroll et à l'apparition
 *
 * ÉTATS DU FORMULAIRE :
 * - idle : État initial, formulaire prêt
 * - sending : Envoi en cours (spinner affiché)
 * - success : Email envoyé avec succès (icône de validation)
 * - error : Erreur lors de l'envoi (icône d'alerte)
 *
 * ANIMATIONS :
 * - Hero : Fade-in du titre et du sous-titre
 * - Contact blocks : Stagger sur les 4 cartes d'information
 * - Formulaire : Slide-up avec fade-in
 * - Map : Slide-in depuis la droite
 * - FAQ : Animations individuelles au scroll
 *
 * CONFIGURATION EMAILJS :
 * Nécessite 3 variables d'environnement :
 * - NEXT_PUBLIC_EMAILJS_SERVICE_ID : ID du service EmailJS
 * - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID : ID du template d'email
 * - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY : Clé publique EmailJS
 */
"use client";

import { Navbar, Footer } from "@/components/UI";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2, MessageCircle, ChevronDown, HelpCircle } from "lucide-react";

/**
 * Données de la FAQ (Questions Fréquentes)
 *
 * STRUCTURE :
 * - question : Question posée par les visiteurs
 * - answer : Réponse détaillée du musée
 *
 * UTILISATION :
 * Ces données alimentent la section FAQ en bas de page avec un système d'accordéon.
 * Chaque question peut être ouverte/fermée individuellement.
 *
 * MAINTENANCE :
 * Pour ajouter une nouvelle question, ajoutez simplement un objet au tableau.
 * La FAQ s'adaptera automatiquement sans modification du code.
 */
const faqData = [
    {
        question: "Faut-il réserver à l'avance ?",
        answer: "La réservation est recommandée pour les week-ends et vacances scolaires, mais pas obligatoire. Les groupes (10+ personnes) doivent réserver au moins 48h à l'avance."
    },
    {
        question: "Le musée est-il accessible aux personnes à mobilité réduite ?",
        answer: "Oui, l'ensemble du parcours est accessible aux PMR grâce à des ascenseurs et rampes d'accès. Une visite virtuelle est également disponible pour les zones moins accessibles du sous-marin."
    },
    {
        question: "Combien de temps dure la visite ?",
        answer: "Comptez environ 1h30 pour le parcours découverte, et jusqu'à 2h30 si vous souhaitez profiter de l'expérience complète avec les espaces interactifs et le sous-marin."
    },
    {
        question: "Les animaux sont-ils acceptés ?",
        answer: "Seuls les chiens guides et d'assistance sont autorisés dans l'enceinte du musée."
    },
    {
        question: "Y a-t-il un parking à proximité ?",
        answer: "Le parking Port Marchand se trouve à 2 minutes à pied. Des places de stationnement sont également disponibles dans les rues adjacentes."
    },
    {
        question: "Proposez-vous des visites guidées ?",
        answer: "Oui, des visites guidées sont proposées chaque jour à 11h et 15h. Pour les groupes scolaires ou privés, des créneaux dédiés peuvent être réservés sur demande."
    }
];

export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: "power4.out"
            });

            gsap.from(".hero-quote", {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });

            // Contact blocks with stagger
            gsap.utils.toArray<HTMLElement>(".contact-block").forEach((block, i) => {
                gsap.from(block, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.2 + i * 0.1,
                    ease: "power2.out"
                });
            });

            gsap.from(".form-container", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: "power3.out"
            });

            // Map container animation
            gsap.from(".map-container", {
                x: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out"
            });

            // FAQ section header
            gsap.from(".faq-header", {
                scrollTrigger: { trigger: ".faq-header", start: "top 85%" },
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out"
            });

            // FAQ items with stagger
            gsap.utils.toArray<HTMLElement>(".faq-item").forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: { trigger: item, start: "top 90%" },
                    y: 25,
                    opacity: 0,
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: "power2.out"
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("sending");

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_name: "Musée ABYSSE",
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
            );

            setFormState("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setFormState("idle"), 5000);
        } catch {
            setFormState("error");
            setTimeout(() => setFormState("idle"), 5000);
        }
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#041C30] text-white selection:bg-[#4CBBD5] selection:text-[#020A19]">
            <Navbar />

            {/* Clean Background - No blobs for cleaner look */}
            <div className="fixed inset-0 pointer-events-none bg-[#041C30]" />

            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-center items-center text-center px-4 md:px-6 z-10 pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#006994]/30 to-[#041C30]" />

                <div className="relative z-10 space-y-6 max-w-4xl">
                    <h1 className="hero-title text-4xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
                        Parlons<br />
                        <span className="font-serif italic text-white/80">Ensemble</span>
                    </h1>

                    <p className="hero-quote text-base md:text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
                        Une question, une idée, un projet ? Notre équipe est là pour vous. Nous aimons échanger avec nos visiteurs !
                    </p>
                </div>
            </section>

            {/* Contact Info Section - FIRST */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
                    {/* Email */}
                    <a
                        href="mailto:contact@musee-abysse.fr"
                        className="contact-block group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 rounded-2xl p-6 transition-colors duration-300 hover:-translate-y-1 transform-gpu"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#4CBBD5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5 text-[#4CBBD5]" />
                            </div>
                            <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">Email</span>
                            <span className="block text-sm text-white group-hover:text-[#4CBBD5] transition-colors font-medium">contact@musee-abysse.fr</span>
                            <p className="text-xs text-white/50 mt-2">Réponse sous 48h</p>
                        </div>
                    </a>

                    {/* Téléphone */}
                    <a
                        href="tel:+33494000000"
                        className="contact-block group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 rounded-2xl p-6 transition-colors duration-300 hover:-translate-y-1 transform-gpu"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#4CBBD5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="w-5 h-5 text-[#4CBBD5]" />
                            </div>
                            <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">Téléphone</span>
                            <span className="block text-sm text-white group-hover:text-[#4CBBD5] transition-colors font-medium">04 94 00 00 00</span>
                            <p className="text-xs text-white/50 mt-2">Mar-Dim, 10h-17h</p>
                        </div>
                    </a>

                    {/* Adresse */}
                    <a
                        href="https://maps.google.com/?q=Port+de+Toulon"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-block group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-[#4CBBD5]/50 rounded-2xl p-6 transition-colors duration-300 hover:-translate-y-1 transform-gpu"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4CBBD5]/0 to-[#4CBBD5]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#4CBBD5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5 text-[#4CBBD5]" />
                            </div>
                            <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">Adresse</span>
                            <span className="block text-sm text-white group-hover:text-[#4CBBD5] transition-colors font-medium">Port de Toulon</span>
                            <p className="text-xs text-white/50 mt-2">83000 Toulon</p>
                        </div>
                    </a>

                    {/* Horaires */}
                    <div className="contact-block group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#4CBBD5]/10 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-5 h-5 text-[#4CBBD5]" />
                            </div>
                            <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">Horaires</span>
                            <span className="block text-sm text-white font-medium">Mardi - Dimanche</span>
                            <p className="text-xs text-white/50 mt-2">10h00 - 18h00</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section - SECOND */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Form Container - Left Side */}
                    <div className="form-container relative bg-gradient-to-br from-[#031525] to-[#020A19] border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CBBD5]/5 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#006994]/5 rounded-full blur-[60px] pointer-events-none" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="w-14 h-14 mb-5 bg-[#4CBBD5]/10 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-[#4CBBD5]" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-light mb-3">Envoyez-nous un message</h2>
                                <p className="text-white/50 text-sm">
                                    Que vous soyez visiteur, enseignant préparant une sortie scolaire, ou partenaire potentiel, nous serons ravis de vous répondre.
                                </p>
                            </div>

                            {/* Form */}
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-[10px] text-white/50 uppercase tracking-wider">
                                            Votre nom <span className="text-[#4CBBD5]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#041C30] border border-white/10 focus:border-[#4CBBD5] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-[10px] text-white/50 uppercase tracking-wider">
                                            Votre email <span className="text-[#4CBBD5]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#041C30] border border-white/10 focus:border-[#4CBBD5] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors"
                                            placeholder="jean.dupont@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="block text-[10px] text-white/50 uppercase tracking-wider">
                                        Sujet <span className="text-[#4CBBD5]">*</span>
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#041C30] border border-white/10 focus:border-[#4CBBD5] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-colors appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234CBBD5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                    >
                                        <option value="" disabled className="bg-[#031525]">Comment pouvons-nous vous aider ?</option>
                                        <option value="information" className="bg-[#031525]">Question générale</option>
                                        <option value="reservation" className="bg-[#031525]">Réservation de groupe</option>
                                        <option value="scolaire" className="bg-[#031525]">Sortie scolaire</option>
                                        <option value="partenariat" className="bg-[#031525]">Partenariat</option>
                                        <option value="presse" className="bg-[#031525]">Presse / Médias</option>
                                        <option value="autre" className="bg-[#031525]">Autre</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-[10px] text-white/50 uppercase tracking-wider">
                                        Votre message <span className="text-[#4CBBD5]">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full bg-[#041C30] border border-white/10 focus:border-[#4CBBD5] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors resize-none"
                                        placeholder="Dites-nous tout..."
                                    />
                                </div>

                                {/* Submit */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={formState === "sending"}
                                        className="group relative w-full px-8 py-4 bg-[#4CBBD5] hover:bg-[#5DCCE6] disabled:bg-[#4CBBD5]/50 text-[#020A19] font-semibold text-sm uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        {formState === "idle" && (
                                            <>
                                                <span>Envoyer mon message</span>
                                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                        {formState === "sending" && (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Envoi en cours...</span>
                                            </>
                                        )}
                                        {formState === "success" && (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Message envoyé ! Merci</span>
                                            </>
                                        )}
                                        {formState === "error" && (
                                            <>
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Erreur, réessayez</span>
                                            </>
                                        )}

                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    </button>
                                </div>

                                <p className="text-[10px] text-white/30 text-center">
                                    En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Map Container - Right Side */}
                    <div className="map-container hidden lg:block relative rounded-3xl overflow-hidden border border-white/10 min-h-[500px]">
                        {/* Google Maps Embed */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.8538848853583!2d5.928!3d43.1167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c1234567890%3A0x1234567890abcdef!2sPort%20de%20Toulon!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(0.3) brightness(0.8) contrast(1.1)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        />
                        {/* Overlay gradient pour harmoniser avec le design */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020A19]/40 via-transparent to-[#020A19]/20" />

                        {/* Badge localisation */}
                        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                            <div className="bg-[#020A19]/90 backdrop-blur-md border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#4CBBD5]/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[#4CBBD5]" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">Musée ABYSSE</p>
                                        <p className="text-white/50 text-xs">Port de Toulon, 83000 Toulon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 pb-16 md:pb-24 relative z-10">
                <div className="faq-header text-center mb-10 md:mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <HelpCircle className="w-5 h-5 text-[#4CBBD5]" />
                        <span className="text-[#4CBBD5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">FAQ</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-light mb-3">Questions Fréquentes</h2>
                    <p className="text-white/50 text-sm max-w-md mx-auto">
                        Retrouvez ici les réponses aux questions les plus posées par nos visiteurs.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="faq-item group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#4CBBD5]/30 rounded-2xl overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-medium text-sm md:text-base text-white group-hover:text-[#4CBBD5] transition-colors pr-4">
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full bg-[#4CBBD5]/10 flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-[#4CBBD5]/20 rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 text-[#4CBBD5]" />
                                </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-5 md:px-6 pb-5 md:pb-6">
                                    <div className="h-px w-full bg-white/5 mb-4" />
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA après FAQ */}
                <div className="mt-10 text-center">
                    <p className="text-white/40 text-sm mb-3">Vous n&apos;avez pas trouvé votre réponse ?</p>
                    <a
                        href="#contact-form"
                        className="inline-flex items-center gap-2 text-[#4CBBD5] text-sm font-medium hover:gap-3 transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span>Contactez-nous directement</span>
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
