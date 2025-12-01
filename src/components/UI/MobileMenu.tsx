"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuVariants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            duration: 0.5,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ease: [0.22, 1, 0.36, 1] as any,
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
    open: {
        opacity: 1,
        x: "0%",
        transition: {
            duration: 0.5,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ease: [0.22, 1, 0.36, 1] as any,
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
};

const links = [
    { name: "Expositions", href: "/expositions" },
    { name: "Informations", href: "/informations" },
    { name: "Partenaires", href: "/partenaires" },
    { name: "Billetterie", href: "/billetterie", isCta: true },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    className="fixed inset-0 z-[90] bg-[#020A19]/95 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
                >
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#4CBBD5]/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4CBBD5]/5 rounded-full blur-[80px]" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="relative z-10 flex flex-col gap-8">
                        {links.map((link, i) => (
                            <motion.div key={link.name} variants={linkVariants}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`block text-4xl font-light tracking-widest uppercase transition-colors ${link.isCta
                                        ? "text-[#4CBBD5] font-semibold"
                                        : "text-white hover:text-[#4CBBD5]"
                                        }`}
                                >
                                    <span className="text-xs font-mono text-[#4CBBD5]/50 mr-4 align-top">
                                        0{i + 1}
                                    </span>
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Footer Info */}
                    <motion.div
                        variants={linkVariants}
                        className="absolute bottom-12 left-8 right-8 border-t border-white/10 pt-8"
                    >
                        <div className="flex flex-col gap-2 text-white/40 text-xs font-mono tracking-widest uppercase">
                            <p>Musée Sous-Marin de Toulon</p>
                            <p>Port de Toulon, 83000</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
