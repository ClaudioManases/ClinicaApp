// src/app/(auth)/sign-in/page.tsx
import { getCallbackURL } from "@/lib/shared";
import SignIn from "@/app/(auth)/sign-in/_components/sign-in";
import Link from "next/link";
import { AuthCarousel } from "@/app/(auth)/_components/auth-carousel";

interface PageProps {
    searchParams: Promise<{
        callbackUrl?: string;
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function SignInPage({ searchParams }: PageProps) {
    // Aguardar a promise searchParams
    const resolvedSearchParams = await searchParams;
    
    const params = new URLSearchParams();
    if (resolvedSearchParams.callbackUrl) {
        params.set("callbackUrl", resolvedSearchParams.callbackUrl);
    }
    const safeCallbackURL = getCallbackURL(params as any);

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-full max-w-sm px-4">
                    <SignIn callbackURL={safeCallbackURL} />
                    <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link href="/sign-up" className="underline hover:text-primary">
                            Registe-se
                        </Link>
                    </div>
                </div>
            </div>
            <AuthCarousel />
        </div>
    );
}