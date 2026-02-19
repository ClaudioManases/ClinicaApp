// src/app/dashboard/components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
    Building,
    Calendar,
    CreditCard,
    FileText,
    LayoutDashboard,
    Microscope,
    Pill,
    Settings,
    Stethoscope,
    Users,
    Ambulance,
    Package,
    Shield,
    UserPlus,
    Search,
    Mail,
    UserCog,
    Building2,
    Activity
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import {ProfileCompletionModal} from "@/dashboard2/components/profile-completion-modal";

interface AppSidebarProps {
    userData: {
        user: {
            name: string;
            email: string;
            avatar: string;
        };
    };
}

export function AppSidebar({ userData, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();


    // Determinar role do usuário
    const userRole = session?.user?.role || 'doctor';
    const isSuperAdmin = userRole === 'superadmin';
    const isDoctor = userRole === 'doctor';
    const isOrgAdmin = userRole === 'admin';
   // se role for desconhecido const userRole = ((session?.user) as unknown as { role?: string })?.role || 'user';

    // Clinical access: Doctors and Org Admins (who manage the clinic)
    // SuperAdmin does NOT see clinical data, only system management
    const hasClinicalAccess = userRole || isOrgAdmin;
    const logo = isSuperAdmin ? Shield : Stethoscope;

    const SIDEBAR_CONFIG = {
        navMain: [
            // =================================================================
            // SUPER ADMIN ROUTES (System Management Only)
            // =================================================================
            ...(isSuperAdmin ? [
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
                    items: [
                        { title: "Todos os Usuários", url: "/super-admin/users" },
                        { title: "Adicionar Usuário", url: "/super-admin/users/new" },
                        { title: "Perfis de Acesso", url: "/super-admin/users/roles" },
                    ]
                },
                {
                    title: "Organizações",
                    url: "/super-admin/organizations",
                    icon: Building2,
                    items: [
                        { title: "Todas Organizações", url: "/super-admin/organizations" },
                        { title: "Solicitações de Criação", url: "/super-admin/organizations/requests" },
                    ]
                },
                {
                    title: "Auditoria e Logs",
                    url: "/super-admin/audit-logs",
                    icon: FileText,
                },
                {
                    title: "Configurações do Sistema",
                    url: "/super-admin/settings",
                    icon: Settings,
                }
            ] : []),

            // =================================================================
            // CLINICAL & ORG ROUTES (Doctors & Org Admins)
            // =================================================================
            
            // DASHBOARD
            ...(hasClinicalAccess ? [{
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                isActive: true,
            }] : []),

            // AFILIAÇÕES (Doctor Only - Para entrar em organizações)
            ...(userRole ? [{
                title: "Afiliações",
                url: "/afiliacoes",
                icon: UserPlus,
                items: [
                    { title: "Minhas Clínicas", url: "/afiliacoes/minhas" },
                    { title: "Buscar / Solicitar Convite", url: "/afiliacoes/buscar" }, // Explicit "Solicitar"
                    { title: "Convites Recebidos", url: "/afiliacoes/convites" },
                ]
            }] : []),

            // AGENDA / CONSULTAS
            ...(hasClinicalAccess ? [{
                title: "Agenda e Consultas",
                url: "/consultas",
                icon: Calendar,
                items: [
                    { title: "Minha Agenda", url: "/consultas/agenda" },
                    { title: "Agendar Consulta", url: "/consultas/agendar" },
                    { title: "Lista de Espera", url: "/consultas/espera" },
                    { title: "Histórico", url: "/consultas/historico" },
                ],
            }] : []),

            // PRONTUÁRIO / PACIENTES
            ...(hasClinicalAccess ? [{
                title: "Pacientes",
                url: "/prontuario",
                icon: UserCog,
                items: [
                    { title: "Meus Pacientes", url: "/prontuario/meus-pacientes" },
                    { title: "Novo Prontuário", url: "/prontuario/novo" },
                    { title: "Receitas e Atestados", url: "/prontuario/documentos" },
                ],
            }] : []),

            // MEDICAMENTOS & ESTOQUE
            ...(hasClinicalAccess ? [{
                title: "Medicamentos",
                url: "/medicamentos",
                icon: Pill,
                items: [
                    { title: "Catálogo", url: "/medicamentos/catalogo" },
                    { title: "Prescrição", url: "/medicamentos/prescrever" },
                    ...(isOrgAdmin ? [{ title: "Gestão de Estoque", url: "/medicamentos/estoque" }] : []),
                ],
            }] : []),

            // EXAMES
            ...(hasClinicalAccess ? [{
                title: "Exames",
                url: "/exames",
                icon: Microscope,
                items: [
                    { title: "Solicitar Exame", url: "/exames/solicitar" },
                    { title: "Resultados", url: "/exames/resultados" },
                ],
            }] : []),

            // FINANCEIRO (Org Admin Only)
            ...(isOrgAdmin ? [{
                title: "Financeiro",
                url: "/financeiro",
                icon: CreditCard,
                items: [
                    { title: "Visão Geral", url: "/financeiro/dashboard" },
                    { title: "Faturas", url: "/financeiro/faturas" },
                    { title: "Pagamentos", url: "/financeiro/pagamentos" },
                ],
            }] : []),

            // CONFIGURAÇÕES (Common)
            {
                title: "Configurações",
                url: "/configuracoes",
                icon: Settings,
                items: [
                    { title: "Meu Perfil", url: "/configuracoes/perfil" }, // Card for profile update should be here
                    ...(isOrgAdmin ? [
                        { title: "Dados da Clínica", url: "/configuracoes/clinica" },
                        { title: "Equipe", url: "/configuracoes/equipe" },
                    ] : []),
                    { title: "Segurança", url: "/configuracoes/seguranca" },
                ],
            },
        ].filter(Boolean),

        // Projetos/Unidades (Only for Clinical Context)
        projects: isSuperAdmin ? [] : [
            {
                name: "Consultório Central",
                url: "/consultorio/central",
                icon: Building,
            },
            {
                name: "Laboratório",
                url: "/laboratorio",
                icon: Microscope,
            },
            {
                name: "Farmácia",
                url: "/farmacia",
                icon: Package,
            },
            {
                name: "Emergência",
                url: "/emergencia",
                icon: Ambulance,
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher  />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={SIDEBAR_CONFIG.navMain} />
                <NavProjects projects={SIDEBAR_CONFIG.projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData.user} />
            </SidebarFooter>

            <SidebarRail />
            <ProfileCompletionModal />
        </Sidebar>
    );
}
