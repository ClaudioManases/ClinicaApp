import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountSwitcher from "@/components/account-switch";
import { auth } from "@/lib/auth";
import UserCard from "@/app/dashboard/setting/_components/user-card";



export default async function Page() {
	const requestHeaders = await headers();

	const session = await auth.api.getSession({
		headers: requestHeaders,
	});
	if (!session) {
		redirect("/sign-in");
	}

	const [activeSessions, deviceSessions] = await Promise.all([
		auth.api.listSessions({
			headers: requestHeaders,
		}),
		auth.api.listDeviceSessions({
			headers: requestHeaders,
		}),
	]);

	return (
		<div className="w-full">
			<div className="flex gap-4 flex-col">
				<AccountSwitcher
					deviceSessions={deviceSessions}
					initialSession={session}
				/>
				<UserCard session={session} activeSessions={activeSessions} />

			</div>
		</div>
	);
}
