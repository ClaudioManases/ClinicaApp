"use client";

import * as React from "react";
import {
    Building,
    CreditCard,
    LayoutDashboard,
    Settings,
    Users,
    FileBarChart,
    Stethoscope,
    ShieldCheck,
    Calendar,
    FileText,
    Pill,
    Microscope,
    UserCog, Package, Ambulance
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
import {NavProjects} from "@/dashboard2/components/nav-projects";

interface AppSidebarProps {
    userData: {
        user: {
            name: string;
            email: string;
            avatar: any;
        };
    };
}

export function AdminSidebar({ userData, ...props }:AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();


    // Admin (Org Admin): Gestão da Clínica + Acesso Clínico
    const navMain = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Gestão da Clínica",
            url: "/admin/clinic",
            icon: Building,
            items: [
                { title: "Visão Geral", url: "/admin/clinic/overview" },
                { title: "Equipe Médica", url: "/admin/clinic/doctors" },
                { title: "Staff e Recepção", url: "/admin/clinic/staff" },
            ],
        },
        {
            title: "Pacientes",
            url: "/admin/patients",
            icon: Users,
            items: [
                { title: "Todos os Pacientes", url: "/admin/patients/list" },
                { title: "Novo Cadastro", url: "/admin/patients/new" },
                { title: "Histórico", url: "/admin/patients/history" },
            ],
        },
        {
            title: "Agenda e Consultas",
            url: "/admin/appointments",
            icon: Calendar,
            items: [
                { title: "Agenda Geral", url: "/admin/appointments/calendar" },
                { title: "Agendar Consulta", url: "/admin/appointments/new" },
                { title: "Lista de Espera", url: "/admin/appointments/waiting" },
            ],
        },
        {
            title: "Prontuário Eletrônico",
            url: "/admin/records",
            icon: FileText,
            items: [
                { title: "Buscar Prontuário", url: "/admin/records/search" },
                { title: "Laudos e Evoluções", url: "/admin/records/reports" },
            ],
        },
        {
            title: "Financeiro",
            url: "/admin/finance",
            icon: CreditCard,
            items: [
                { title: "Faturas e Recebimentos", url: "/admin/finance/invoices" },
                { title: "Pagamentos e Despesas", url: "/admin/finance/payments" },
                { title: "Convênios", url: "/admin/finance/insurance" },
                { title: "Relatórios Financeiros", url: "/admin/finance/reports" },
            ],
        },
        {
            title: "Medicamentos e Estoque",
            url: "/admin/inventory",
            icon: Pill,
            items: [
                { title: "Catálogo de Medicamentos", url: "/admin/inventory/catalog" },
                { title: "Controle de Estoque", url: "/admin/inventory/stock" },
                { title: "Entradas e Saídas", url: "/admin/inventory/movements" },
            ],
        },
        {
            title: "Exames e Laboratório",
            url: "/admin/exams",
            icon: Microscope,
            items: [
                { title: "Solicitações", url: "/admin/exams/requests" },
                { title: "Resultados", url: "/admin/exams/results" },
            ],
        },
        {
            title: "Relatórios e Analytics",
            url: "/admin/reports",
            icon: FileBarChart,
            items: [
                { title: "Produtividade Médica", url: "/admin/reports/productivity" },
                { title: "Ocupação da Agenda", url: "/admin/reports/occupancy" },
                { title: "Satisfação do Paciente", url: "/admin/reports/satisfaction" },
            ],
        },
        {
            title: "Configurações",
            url: "/admin/settings",
            icon: Settings,
            items: [
                { title: "Dados da Clínica", url: "/admin/settings/clinic-info" },
                { title: "Serviços e Preços", url: "/admin/settings/services" },
                { title: "Meu Perfil", url: "/admin/settings/profile" }, // Update de perfil
                { title: "Segurança e Acessos", url: "/admin/settings/security" },
            ],
        },
    ];
    const navProject ={
        projects: [
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
        ]}


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects projects={navProject.projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData.user} />
            </SidebarFooter>

            <SidebarRail />
            <ProfileCompletionModal />
        </Sidebar>
    );
}
