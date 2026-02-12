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
    Heart,
    Activity,
    ClipboardList,
    AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { useMedicalStats } from "@/hooks/use-medical-stats";
import { useSession } from "@/lib/auth-client";

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
    const { data: stats } = useMedicalStats();

    // Determinar role do usuário
    const userRole = session?.user?.role || 'user';
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';
    const isDoctor = userRole === 'user';


    // Configuração completa do sidebar
    const SIDEBAR_CONFIG = {
        teams: [
            {
                name: "Clínica Saúde Total",
                logo: Stethoscope,
                plan: userRole === 'superadmin' ? 'Enterprise' : 'Profissional',
                badge: stats?.doctorsOnDuty ? `${stats.doctorsOnDuty} médicos` : null,
            },
        ],

        navMain: [
            // DASHBOARD - Todos veem
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                isActive: true,
                badge: stats?.totalPatients ? `${stats.totalPatients} pacientes` : null,
                items: [
                    { title: "Visão Geral", url: "/dashboard" },
                    { title: "Estatísticas", url: "/dashboard/estatisticas" },
                    { title: "Relatórios", url: "/dashboard/relatorios" },
                ],
            },

            // CONSULTAS - Médicos e Recepcionistas
            ...(isDoctor || isAdmin ? [{
                title: "Consultas",
                url: "/consultas",
                icon: Calendar,
                badge: stats?.todayAppointments ? `${stats.todayAppointments} hoje` : null,
                items: [
                    { title: "Agendar Consulta", url: "/consultas/agendar" },
                    {
                        title: "Consultas Hoje",
                        url: "/consultas/hoje",
                        badge: stats?.todayAppointments?.toString(),
                    },
                    {
                        title: "Pacientes Aguardando",
                        url: "/consultas/espera",
                        badge: stats?.waitingPatients?.toString(),
                    },
                    { title: "Histórico", url: "/consultas/historico" },
                    { title: "Calendário", url: "/consultas/calendario" },
                ],
            }] : []),

            // PACIENTES - Todos exceto financeiro

            // PRONTUÁRIO ELETRÔNICO - Médicos e Enfermeiros
            ...(isDoctor || isAdmin ? [{
                title: "Prontuário Eletrônico",
                url: "/prontuario",
                icon: FileText,
                badge: stats?.pendingReports ? `${stats.pendingReports} laudos` : null,
                items: [
                    { title: "Novo Prontuário", url: "/prontuario/novo" },
                    { title: "Buscar Prontuário", url: "/prontuario/buscar" },
                    { title: "Evolução Diária", url: "/prontuario/evolucao" },
                    { title: "Receituário", url: "/prontuario/receitas" },
                    { title: "Atestados", url: "/prontuario/atestados" },
                    {
                        title: "Laudos Pendentes",
                        url: "/prontuario/laudos",
                        badge: stats?.pendingReports?.toString(),
                    },
                ],
            }] : []),

            // MEDICAMENTOS - Médicos, Enfermeiros e Admin
            ...(isDoctor ||  isAdmin ? [{
                title: "Medicamentos",
                url: "/medicamentos",
                icon: Pill,
                badge: stats?.lowStock ? `⚠️ ${stats.lowStock}` : null,
                items: [
                    { title: "Catálogo", url: "/medicamentos/catalogo" },
                    { title: "Prescrição", url: "/medicamentos/prescrever" },
                    {
                        title: "Estoque",
                        url: "/medicamentos/estoque",
                        badge: stats?.lowStock ? `${stats.lowStock} crítico` : null,
                    },
                    { title: "Interações", url: "/medicamentos/interacoes" },
                    { title: "Posologia", url: "/medicamentos/posologia" },
                ],
            }] : []),

            // EXAMES - Médicos e Admin
            ...(isDoctor || isAdmin ? [{
                title: "Exames",
                url: "/exames",
                icon: Microscope,
                badge: stats?.pendingResults ? `${stats.pendingResults} resultados` : null,
                items: [
                    { title: "Solicitar Exames", url: "/exames/solicitar" },
                    {
                        title: "Resultados",
                        url: "/exames/resultados",
                        badge: stats?.pendingResults?.toString(),
                    },
                    { title: "Laudos", url: "/exames/laudos" },
                    { title: "Imagens", url: "/exames/imagens" },
                ],
            }] : []),

            // FINANCEIRO - Admin e Recepcionistas
            ...(isAdmin  ? [{
                title: "Financeiro",
                url: "/financeiro",
                icon: CreditCard,
                badge: stats?.pendingPayments ? `R$ ${stats.pendingPayments}` : null,
                items: [
                    { title: "Faturas", url: "/financeiro/faturas" },
                    { title: "Pagamentos", url: "/financeiro/pagamentos" },
                    { title: "Convênios", url: "/financeiro/convenios" },
                    { title: "Relatórios", url: "/financeiro/relatorios" },
                ],
            }] : []),

            // CONFIGURAÇÕES - Apenas Admin
            ...(isAdmin ? [{
                title: "Configurações",
                url: "/configuracoes",
                icon: Settings,
                items: [
                    { title: "Perfil", url: "/configuracoes/perfil" },
                    { title: "Usuários", url: "/configuracoes/usuarios" },
                    { title: "Consultórios", url: "/configuracoes/consultorios" },
                    { title: "Especialidades", url: "/configuracoes/especialidades" },
                    { title: "Integrações", url: "/configuracoes/integracoes" },
                ],
            }] : []),
        ].filter(Boolean), // Remove itens vazios

        // Projetos/Unidades
        projects: [
            {
                name: "Consultório Central",
                url: "/consultorio/central",
                icon: Building,
                badge: stats?.doctorsOnDuty ? `${stats.doctorsOnDuty} ativos` : null,
            },
            {
                name: "Laboratório",
                url: "/laboratorio",
                icon: Microscope,
                badge: stats?.pendingResults ? `${stats.pendingResults} amostras` : null,
            },
            {
                name: "Farmácia",
                url: "/farmacia",
                icon: Package,
                badge: stats?.lowStock ? `⚠️ ${stats.lowStock}` : null,
            },
            {
                name: "Emergência",
                url: "/emergencia",
                icon: Ambulance,
                badge: stats?.emergency ? `🚨 ${stats.emergency}` : null,
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={SIDEBAR_CONFIG.teams} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={SIDEBAR_CONFIG.navMain} />
                <NavProjects projects={SIDEBAR_CONFIG.projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}