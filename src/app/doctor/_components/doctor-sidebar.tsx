"use client";

import * as React from "react";
import {
    Calendar,
    FileText,
    LayoutDashboard,
    Microscope,
    Pill,
    Users,
    Building2,
    Settings,
    UserPlus,
    UserCog,
    ClipboardList
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
import { usePathname } from "next/navigation";
import { ProfileCompletionModal } from "@/dashboard2/components/profile-completion-modal";

interface AppSidebarProps {
    userData: {
        user: {
            name: string;
            email: string;
            avatar: string;
        };
    };
}

export function DoctorSidebar({userData, ...props }:AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
     const pathname = usePathname();

    // Menu específico para Médicos
    const navMain = [
        {
            title: "Dashboard",
            url: "/doctor/dashboard",
            icon: LayoutDashboard,
            isActive: pathname === "/doctor/dashboard",
        },
        // Afiliações: Para médicos que não estão em organização ou querem gerenciar convites
        {
            title: "Afiliações",
            url: "/doctor/affiliations",
            icon: UserPlus,
            items: [
                { title: "Minhas Clínicas", url: "/doctor/affiliations/my-clinics" },
                { title: "Buscar / Solicitar Convite", url: "/doctor/affiliations/search" }, // Local para solicitar entrada
                { title: "Convites Recebidos", url: "/doctor/affiliations/invitations" },
            ],
        },
        {
            title: "Meus Pacientes",
            url: "/doctor/patients",
            icon: Users,
            items: [
                { title: "Lista de Pacientes", url: "/doctor/patients" },
                { title: "Adicionar Paciente", url: "/doctor/patients/new" },
                { title: "Histórico Clínico", url: "/doctor/patients/history" },
            ],
        },
        {
            title: "Agenda e Consultas",
            url: "/doctor/appointments",
            icon: Calendar,
            items: [
                { title: "Minha Agenda", url: "/doctor/appointments/schedule" },
                { title: "Agendar Consulta", url: "/doctor/appointments/new" },
                { title: "Lista de Espera", url: "/doctor/appointments/waiting-list" },
            ],
        },
        {
            title: "Prontuário Eletrônico",
            url: "/doctor/records",
            icon: FileText,
            items: [
                { title: "Novo Prontuário", url: "/doctor/records/new" },
                { title: "Meus Laudos", url: "/doctor/records/reports" },
                { title: "Evolução Diária", url: "/doctor/records/evolution" },
            ],
        },
        {
            title: "Prescrições e Receitas",
            url: "/doctor/prescriptions",
            icon: Pill,
            items: [
                { title: "Nova Receita", url: "/doctor/prescriptions/new" },
                { title: "Modelos Salvos", url: "/doctor/prescriptions/templates" },
                { title: "Histórico de Prescrições", url: "/doctor/prescriptions/history" },
            ],
        },
        {
            title: "Exames",
            url: "/doctor/exams",
            icon: Microscope,
            items: [
                { title: "Solicitar Exame", url: "/doctor/exams/request" },
                { title: "Resultados", url: "/doctor/exams/results" },
            ],
        },
        {
            title: "Configurações",
            url: "/doctor/settings",
            icon: Settings,
            items: [
                { title: "Meu Perfil", url: "/doctor/settings/profile" }, // Update de informações do perfil
                { title: "Segurança", url: "/doctor/settings/security" },
            ],
        },
    ];


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData.user} />
            </SidebarFooter>

            <SidebarRail />
            <ProfileCompletionModal />
        </Sidebar>
    );
}
