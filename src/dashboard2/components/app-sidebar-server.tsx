import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AppSidebar } from "./app-sidebar";
import { SidebarSkeleton } from "./ui/sidebar-skeleton";
import { Suspense } from "react";

async function SidebarData() {
    // Simulate network delay to show skeleton (remove in production if not needed)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders }).catch(() => null);

    const userData = {
        user: {
            name: session?.user?.name || "Usuário",
            email: session?.user?.email || "",
            avatar: session?.user?.image || "", // Empty string if no image, NavUser handles fallback
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
