"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AuthImage() {
    return (
        <div className="hidden bg-muted lg:block relative overflow-hidden h-full min-h-screen">
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    src="/auth-image.jpg"
                    alt="Ambiente médico moderno"
                    fill
                    className="object-cover dark:brightness-[0.4]"
                    priority
                />
            </motion.div>
            
            <div className="relative z-10 flex flex-col justify-end h-full p-10 text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-20"
                >
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            “A nossa missão é proporcionar um cuidado de saúde excecional,
                            combinando tecnologia de ponta com um toque humano.”
                        </p>
                        <footer className="text-sm font-semibold opacity-80">CEO da ClínicaSelfApp</footer>
                    </blockquote>
                </motion.div>
            </div>
        </div>
    );
}