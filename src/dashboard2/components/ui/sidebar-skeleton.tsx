// components/ui/sidebar-skeleton.tsx
export function SidebarSkeleton() {
    return (
        <div className="flex h-full w-[240px] flex-col border-r bg-background">
            {/* Skeleton do TeamSwitcher */}
            <div className="flex items-center gap-2 p-4 border-b">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            </div>

            {/* Skeleton do NavMain */}
            <div className="p-4">
                <div className="h-4 w-16 mb-4 rounded bg-muted animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-1">
                            <div className="h-10 rounded bg-muted animate-pulse" />
                            {/* Subitems skeleton */}
                            <div className="ml-6 space-y-1">
                                <div className="h-6 w-full rounded bg-muted/50 animate-pulse" />
                                <div className="h-6 w-4/5 rounded bg-muted/50 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skeleton do NavUser */}
            <div className="mt-auto p-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1">
                        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente Skeleton para cada item do menu
export function NavItemSkeleton() {
    return (
        <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
            <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
        </div>
    );
}