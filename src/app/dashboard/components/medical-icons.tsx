// app/dashboard/components/icon-mapper.tsx
"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Tipo para os nomes dos ícones suportados
export type IconName = keyof typeof Icons;

// Componente para renderizar ícones dinamicamente
export function DynamicIcon({
                                name,
                                className = "h-4 w-4",
                                ...props
                            }: {
    name: IconName;
    className?: string;
} & React.ComponentProps<LucideIcon>) {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        console.warn(`Ícone "${name}" não encontrado`);
        return null;
    }

    return <IconComponent className={className} {...props} />;
}

// Mapa de ícones para usar nos componentes
export const iconMap = Icons;