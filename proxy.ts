// proxy.ts
// Next.js 16+ - Proxy de autenticação com suas 3 roles específicas

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

/**
 * Lista de rotas públicas que NÃO precisam de autenticação
 */
const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forget-password",
    "/reset-password",
    "/api/auth", // Rotas de API do Better Auth
];

/**
 * Mapeamento de rotas por role
 * Define para onde cada role deve ser redirecionada após o login
 * e quais rotas cada role pode acessar
 */
const roleConfig: Record<string, { defaultRedirect: string; allowedRoutes: string[] }> = {
    // Super Admin - Acesso total a tudo
    superadmin: { // CORRIGIDO: superadmin (sem underscore)
        defaultRedirect: "/super-admin/dashboard",
        allowedRoutes: [
            "/super-admin",
            //"/admin",
            //"/doctor",
            //"/dashboard",
            "/device",
        ],
    },
    // Admin - Acesso a áreas administrativas e dashboard
    admin: {
        defaultRedirect: "/admin/dashboard",
        allowedRoutes: [
            "/admin",
            //"/dashboard",
            "/device",
        ],
    },
    // Doctor (usuário do sistema) - Acesso limitado
    doctor: {
        defaultRedirect: "/doctor/dashboard",
        allowedRoutes: [
            "/doctor",
            //"/dashboard",
            "/device",
        ],
    },

};

/**
 * Rotas que requerem roles específicas (acesso baseado em permissão)
 */
const roleBasedRoutes: Record<string, string[]> = {
    // Rotas de Super Admin - APENAS superadmin pode acessar
    "/super-admin": [ "superadmin" ],
    "/super-admin/": [ "superadmin" ],
    "/super-admin/dashboard": [ "superadmin" ],
    "/super-admin/settings": [ "superadmin" ],
    "/super-admin/users": [ "superadmin" ],

    // Rotas de Admin - admin e superadmin podem acessar
    // "/admin": [ "admin", "superadmin" ],
    // "/admin/": [ "admin", "superadmin" ],
    "/admin/dashboard": [ "admin" ],
    "/admin/settings": [ "admin" ],
    "/admin/users": [ "admin" ],

    // Rotas de Doctor - doctor, admin e superadmin podem acessar
    "/doctor": [ "doctor" ],
    "/doctor/": [ "doctor" ],
    "/doctor/dashboard": [ "doctor" ],
    "/doctor/patients": [ "doctor" ],
    "/doctor/appointments": [ "doctor" ],

    // Rotas comuns - todos os usuários autenticados podem acessar
    //"/dashboard": [ "doctor", "admin", "superadmin", "user" ],
    // "/device": [ "doctor", "admin", "superadmin", "user" ],
};

/**
 * Proxy Function - Controla acesso baseado nas 3 roles
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ============================================
    // 1. VERIFICAÇÃO DE ROTAS PÚBLICAS
    // ============================================
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        // console.log(`🔓 Rota pública: ${pathname} - acesso liberado`);
        return NextResponse.next();
    }

    // ============================================
    // 2. VERIFICAÇÃO DE COOKIE (RÁPIDA)
    // ============================================
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        // console.log(`🔒 Rota protegida sem cookie: ${pathname}`);
        return redirectToLogin(request, pathname);
    }

    // ============================================
    // 3. VERIFICAÇÃO COMPLETA DE SESSÃO
    // ============================================
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session) {
            // console.log(`🔒 Rota protegida sem sessão válida: ${pathname}`);
            return redirectToLogin(request, pathname);
        }

        //const userRole = session.user.role || "user"; // Fallback para 'user' se null

        // Log para debug
        // console.log(`👤 Usuário: ${session.user.email}, Role: ${userRole}, Acessando: ${pathname}`);

        // ============================================
        // 4. VERIFICAÇÃO DE REDIRECIONAMENTO PÓS-LOGIN
        // ============================================
        // Se o usuário está logado e tenta acessar página de login
        if (pathname === "/sign-in" || pathname === "/sign-up") {
            // console.log(`🔄 Usuário logado (${userRole}) tentando acessar ${pathname}`);
            const config = roleConfig[userRole] || roleConfig["doctor"]; // Fallback seguro
            const dashboardUrl = new URL(config.defaultRedirect, request.url);
            return NextResponse.redirect(dashboardUrl);
        }

        // ============================================
        // 5. VERIFICAÇÃO DE ACESSO POR ROLE
        // ============================================
        // Verifica se a rota atual tem restrições de role
        let hasAccess = false;
        let matchedRoute = "";

        // Ordena as rotas por comprimento (decrescente) para garantir match mais específico primeiro
        const sortedRoutes = Object.keys(roleBasedRoutes).sort((a, b) => b.length - a.length);

        for (const route of sortedRoutes) {
            if (pathname.startsWith(route)) {
                matchedRoute = route;
                const allowedRoles = roleBasedRoutes[route];
                if (allowedRoles.includes(userRole)) {
                    hasAccess = true;
                }
                break;
            }
        }

        // Se a rota não está no roleBasedRoutes, verifica se é uma rota comum
        if (!matchedRoute) {
            // Rotas não listadas (como /profile, /settings) - todos autenticados acessam
            hasAccess = true;
        }

        if (!hasAccess) {
            console.log(`⛔ ACESSO NEGADO: ${pathname} - role ${userRole} não autorizada`);

            // Redireciona para o dashboard apropriado baseado na role
            const config = roleConfig[userRole] || roleConfig["doctor"];
            const fallbackUrl = new URL(config.defaultRedirect, request.url);
            return NextResponse.redirect(fallbackUrl);
        }

        // console.log(`✅ ACESSO PERMITIDO: ${pathname} - role: ${userRole}`);
        return NextResponse.next();

    } catch (error) {
        console.error(`❌ Erro no proxy para ${pathname}:`, error);

        // Em caso de erro, redireciona para login
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        signInUrl.searchParams.set("error", "session_error");

        return NextResponse.redirect(signInUrl);
    }
}

/**
 * Função auxiliar para redirecionar para login com callback
 */
function redirectToLogin(request: NextRequest, pathname: string) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
}

/**
 * Configuração do proxy
 */
export const config = {
    matcher: [
        "/",
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ],
};