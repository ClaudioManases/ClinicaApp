// src/app/doctor/layout.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebarServer } from "@/app/doctor/_components/app-sidebar-server";
import {Suspense} from "react";

export default async function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Obter a sessão no servidor
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // 2. Se não houver sessão, redireciona para o login
    if (!session) {
        return redirect("/sign-in?callbackUrl=/doctor/dashboard");
    }

    // 3. Se a role não for 'doctor'
    const allowedRoles = ["doctor"];
    if (!session.user.role || !allowedRoles.includes(session.user.role)) {
        return redirect("/sign-in"); 
    }

    // 4. Se tudo estiver OK, renderiza a página com o Sidebar
    return (
        <SidebarProvider>
            <AppSidebarServer />
            <SidebarInset>
                <Suspense fallback={<AppSidebarServer/>}>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/doctor/dashboard">
                                        Clínica
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard do Médico</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                </Suspense>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}