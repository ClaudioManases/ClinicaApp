// components/DynamicBreadcrumbs.tsx
'use client';

import { useBreadcrumbs, BreadcrumbItem } from '@/hooks/useBreadcrumbs';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem as BreadcrumbItemComponent,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DynamicBreadcrumbsProps {
    className?: string;
    // Opcional: mapeamento customizado de rotas para labels
    routeLabels?: Record<string, string>;
    // Opcional: mostrar "Home" como primeiro item
    showHome?: boolean;
}

export function DynamicBreadcrumbs({
                                       className,
                                       routeLabels,
                                       showHome = true,
                                   }: DynamicBreadcrumbsProps) {
    const breadcrumbs = useBreadcrumbs();

    if (breadcrumbs.length === 0) {
        return null;
    }

    // Pega todos os itens exceto o último (que será a página atual)
    const parentItems = breadcrumbs.slice(0, -1);
    const currentItem = breadcrumbs[breadcrumbs.length - 1];

    return (
        <header className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${className}`}>
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {parentItems.map((item, index) => (
                            <BreadcrumbItemComponent key={item.href}>
                                <BreadcrumbLink href={item.href}>
                                    {routeLabels?.[item.label] || item.label}
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </BreadcrumbItemComponent>
                        ))}
                        <BreadcrumbItemComponent>
                            <BreadcrumbPage>
                                {routeLabels?.[currentItem.label] || currentItem.label}
                            </BreadcrumbPage>
                        </BreadcrumbItemComponent>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}