// app/(auth)/admin/login/layout.tsx
// ✅ COMPLETO - Remove elementos indesejados

export default function AdminLoginLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-login-layout">
            {children}
        </div>
    );
}