// src/app/dashboard/components/app-sidebar-server.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AppSidebar } from "./app-sidebar";
import { SidebarSkeleton } from "./ui/sidebar-skeleton";
import { Suspense } from "react";

async function SidebarData() {
    const requestHeaders = await headers();

    const [session] = await Promise.all([
        auth.api.getSession({ headers: requestHeaders }).catch(() => null),
    ]);

    // 🟢 APENAS dados do usuário - NADA de ícones ou menus
    const userData = {
        user: {
            name: session?.user?.name || "Usuário",
            email: session?.user?.email || "",
            avatar: session?.user?.image || "/default-avatar.jpg",
        }
    };

    return <AppSidebar userData={userData} />;
}

export function AppSidebarServer() {
    return (
        <Suspense fallback={<SidebarSkeleton />}>
            <SidebarData />
        </Suspense>
    );
}