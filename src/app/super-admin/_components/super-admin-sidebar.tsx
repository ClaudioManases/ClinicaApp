"use client";

import * as React from "react";
import {
    Activity,
    Database,
    Globe,
    LayoutDashboard,
    Lock,
    Server,
    Shield,
    Users,
    Settings,
    Building2,
    FileText
} from "lucide-react";

import { NavMain } from "@/dashboard2/components/nav-main";
import { NavUser } from "@/dashboard2/components/nav-user";
import { TeamSwitcher } from "@/dashboard2/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { ProfileCompletionModal } from "@/dashboard2/components/profile-completion-modal";

export function SuperAdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();

    // SuperAdmin: Gestão do Sistema (CRUD usuários, Organizações, Logs)
    // Não faz parte de organização, é o "Programador/Dono do SaaS"
    const navMain = [
        {
            title: "Dashboard Global",
            url: "/super-admin/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Gestão de Usuários",
            url: "/super-admin/users",
            icon: Users,
            // Submenus linkados com segmentos da rota principal
            items: [
                { title: "Todos os Usuários", url: "/super-admin/users" },
                { title: "Adicionar Usuário", url: "/super-admin/users/new" },
                { title: "Perfis de Acesso", url: "/super-admin/users/roles" },
            ],
        },
        {
            title: "Organizações",
            url: "/super-admin/organizations",
            icon: Building2,
            items: [
                { title: "Todas as Clínicas", url: "/super-admin/organizations" },
                { title: "Solicitações", url: "/super-admin/organizations/requests" },
                { title: "Planos e Assinaturas", url: "/super-admin/organizations/plans" },
            ],
        },
        {
            title: "Auditoria e Logs",
            url: "/super-admin/audit-logs",
            icon: FileText,
            items: [
                { title: "Logs de Acesso", url: "/super-admin/audit-logs/access" },
                { title: "Logs de Sistema", url: "/super-admin/audit-logs/system" },
            ],
        },
        {
            title: "Infraestrutura",
            url: "/super-admin/infrastructure",
            icon: Server,
            items: [
                { title: "Status do Sistema", url: "/super-admin/infrastructure/status" },
                { title: "Banco de Dados", url: "/super-admin/infrastructure/database" },
            ],
        },
        {
            title: "Configurações do Sistema",
            url: "/super-admin/settings",
            icon: Settings,
            items: [
                { title: "Geral", url: "/super-admin/settings/general" },
                { title: "Segurança", url: "/super-admin/settings/security" },
                { title: "Meu Perfil", url: "/super-admin/settings/profile" }, // Para update de info
            ],
        },
    ];

    const userData = {
        name: session?.user?.name || "Super Admin",
        email: session?.user?.email || "",
        avatar: session?.user?.image || "",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* SuperAdmin vê um TeamSwitcher diferente ou fixo, pois não pertence a orgs */}
                <TeamSwitcher /> 
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>

            <SidebarRail />
            <ProfileCompletionModal />
        </Sidebar>
    );
}
