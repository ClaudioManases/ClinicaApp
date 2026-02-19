import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { SidebarSkeleton } from "@/dashboard2/components/ui/sidebar-skeleton";

async function SidebarData() {
    // Simulate network delay to show skeleton (remove in production if not needed)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders }).catch(() => null);

    const userData = {
        user: {
            name: session?.user?.name || "Administrator",
            email: session?.user?.email || "",
            avatar: session?.user?.image || "", // Empty string if no image, NavUser handles fallback
        }
    };

    return <AdminSidebar userData={userData} />;
}

export function AppSidebarServer() {
    return (
        <Suspense fallback={<SidebarSkeleton />}>
            <SidebarData />
        </Suspense>
    );
}
