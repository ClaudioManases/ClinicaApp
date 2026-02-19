"use client";

import UserCard from "@/app/dashboard/_components/user-card";
import { useSession } from "@/lib/auth-client";

export default function SuperAdminProfilePage() {
    const { data: session } = useSession();

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Perfil de Super Admin</h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações pessoais e segurança.
                </p>
            </div>
            
            <div className="max-w-4xl">
                <UserCard session={session} activeSessions={session?.session ? [session.session] : []} />
            </div>
        </div>
    );
}
