"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AvatarGroup } from "@/components/ui/avatar-group";

const slides = [
  {
    image: "/entrar/login-img.png", // Updated image path
    quote: "A nossa missão é proporcionar um cuidado de saúde excecional, combinando tecnologia de ponta com um toque humano.",
    author: "Dr. António Silva",
    role: "Diretor Clínico",
  },
  {
    image: "/entrar/login-img.png", // Using the same image for now as requested, or you can add more images to /public/entrar
    quote: "Inovação e dedicação são os pilares que sustentam o nosso compromisso com o bem-estar dos nossos pacientes.",
    author: "Dra. Maria Santos",
    role: "Chefe de Cirurgia",
  },
];

const users = [
  { name: "User 1", image: "https://i.pravatar.cc/150?u=1" },
  { name: "User 2", image: "https://i.pravatar.cc/150?u=2" },
  { name: "User 3", image: "https://i.pravatar.cc/150?u=3" },
  { name: "User 4", image: "https://i.pravatar.cc/150?u=4" },
];

export function AuthCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="hidden lg:block relative w-full h-screen overflow-hidden bg-zinc-900">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
          duration: 60,
        }}
      >
        <CarouselContent className="h-full ml-0"> 
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 h-full w-full relative border-none p-0">
              
              {/* Imagem de Fundo com Zoom Suave */}
              <div className="absolute inset-0 w-full h-full">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ 
                    scale: current === index ? 1 : 1.1,
                    transition: { duration: 6, ease: "easeOut" }
                  }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={slide.image}
                    alt="Ambiente médico"
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="50vw"
                  />
                </motion.div>
                
                {/* Gradiente Cinematográfico - Ajustado para combinar com a imagem de login */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Conteúdo Animado */}
              <div className="relative z-20 flex flex-col justify-end h-full p-12 pb-20 text-white">
                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="space-y-8 max-w-2xl"
                    >
                      {/* Citação com efeito Glassmorphism */}
                      <div className="backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
                        <blockquote className="space-y-4">
                          <p className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-white/95 drop-shadow-sm">
                            “{slide.quote}”
                          </p>
                          <footer className="flex items-center gap-3 pt-2">
                            <div className="h-px w-8 bg-emerald-500" />
                            <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
                              {slide.author} — <span className="text-emerald-400">{slide.role}</span>
                            </span>
                          </footer>
                        </blockquote>
                      </div>

                      {/* Prova Social */}
                      <div className="flex items-center gap-5 px-2">
                        <AvatarGroup users={users} limit={4} />
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">Junte-se a nós</span>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          </div>
                          <span className="text-xs font-medium text-white/70">
                            +2.000 profissionais ativos agora
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Indicadores de Slide (Dots) */}
        <div className="absolute bottom-10 right-12 flex gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                current === index ? "w-8 bg-emerald-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
