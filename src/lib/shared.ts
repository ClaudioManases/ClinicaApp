{/*// shared.ts
import type { ReadonlyURLSearchParams } from "next/navigation";

const allowedCallbackSet: ReadonlySet<string> = new Set([
    "/dashboard",
    "/device",
    "/admin",
    "/doctor",
    "/super-admin",
]);

export const getCallbackURL = (
    queryParams: ReadonlyURLSearchParams | URLSearchParams,
    userRole?: string // ← Agora é opcional, vem do ctx após login
): string => {
    const callbackUrl = queryParams.get("callbackUrl");

    if (callbackUrl) {
        // Se o callbackUrl existe, valida se é permitido
        if (allowedCallbackSet.has(callbackUrl)) {
            // Se temos a role, faz validação específica
            if (userRole) {
                // Validações específicas por role
                if (callbackUrl.includes("/admin") && userRole !== "admin" && userRole !== "super_admin") {
                    return "/dashboard"; // Não é admin, vai para dashboard
                }
                if (callbackUrl.includes("/doctor") && userRole !== "doctor" && userRole !== "super_admin") {
                    return "/dashboard";
                }
                if (callbackUrl.includes("/super-admin") && userRole !== "super_admin") {
                    return "/dashboard";
                }
            }
            return callbackUrl;
        }
        return "/dashboard"; // Callback não permitido
    }

    // Se não tem callback, redireciona baseado na role (se disponível)
    if (userRole) {
        switch (userRole) {
            case "super_admin":
                return "/super-admin";
            case "admin":
                return "/admin";
            case "doctor":
                return "/doctor";
            default:
                return "/dashboard";
        }
    }

    return "/dashboard"; // Fallback padrão
};*/}

// shared.ts
import type { ReadonlyURLSearchParams } from "next/navigation";

// Rotas permitidas para redirecionamento
const allowedCallbackSet: ReadonlySet<string> = new Set([
    "/dashboard",
    "/device",
    "/admin",
    "/admin/dashboard",
    "/doctor",
    "/doctor/dashboard",
    "/super-admin",
    "/super-admin/dashboard",
]);

// Mapeamento de rotas padrão por role
const defaultRoutesByRole = {
    superadmin: "/super-admin/dashboard",
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
};

export const getCallbackURL = (
    queryParams: ReadonlyURLSearchParams | URLSearchParams,
    userRole: string = "doctor" // Default para doctor (usuário comum)
): string => {
    const callbackUrl = queryParams.get("callbackUrl");

    // Se tem callbackUrl, valida se é permitido
    if (callbackUrl && allowedCallbackSet.has(callbackUrl)) {
        // Validações específicas por role
        switch (userRole) {
            case "superadmin":
                // Super admin pode acessar tudo
                return callbackUrl;

            case "admin":
                // Admin não pode acessar rotas de super_admin
                if (callbackUrl.includes("/super-admin")) {
                    return defaultRoutesByRole.admin;
                }
                return callbackUrl;

            case "doctor":
                // Doctor não pode acessar rotas de admin ou super_admin
                if (callbackUrl.includes("/admin") || callbackUrl.includes("/super-admin")) {
                    return defaultRoutesByRole.doctor;
                }
                return callbackUrl;

            default:
                return defaultRoutesByRole.doctor;
        }
    }

    // Se não tem callbackUrl ou não é permitido, retorna rota padrão da role
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return defaultRoutesByRole[userRole] || defaultRoutesByRole.doctor;
};