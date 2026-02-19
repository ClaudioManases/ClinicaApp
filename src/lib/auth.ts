import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import type { BetterAuthOptions } from "better-auth";
import { APIError, betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import type { Organization } from "better-auth/plugins";
import {
	admin as adminPlugin,
	bearer,
	customSession,
	deviceAuthorization,
	jwt,
	lastLoginMethod,
	multiSession,
	oAuthProxy,
	oneTap,
	openAPI,
	organization,
	twoFactor,
} from "better-auth/plugins";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "@/lib/prisma";
import {resend} from "@/lib/email/resend";
import {reactResetPasswordEmail} from "@/lib/email/reset-password";
import {reactInvitationEmail} from "@/lib/email/invitation";
import { ac, admin, doctor, superadmin } from "./auth/permissions"


const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev" ;
const to = process.env.TEST_EMAIL || "";

const authOptions = {
	appName: "Better Auth Demo",
    database:prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    advanced:{
        database: {generateId: "uuid"}
    },
    experimental:{ joins: true },
    user: {
        additionalFields: {
            profileType: {
                type:"string",
                required: false,
                input: false,
            },

            status: {
                type: "string",
                required: false,
            },
            phone: {
                type: "string",
                required: false },
        }
    },
	account: {
		accountLinking: {
			trustedProviders: [
				"email-password",
				"facebook",
				"google",
			],
		},
	},
    emailVerification: {
        async sendVerificationEmail ({ user, url }, request){
            const res = await resend.emails.send({
                from,
                to: to || user.email,
                subject: "Verify your email address",
                html: `<a href="${url}">Verify your email address</a>`,
            });
            console.log("Verification Email description:"+res, user.email);
        }
    },
    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
            await resend.emails.send({
                from,
                to: user.email,
                subject: "Reset your password",
                react: reactResetPasswordEmail({
                    username: user.name,
                    resetLink: url,
                    userEmail: user.email
                }),
            });
        },
    },
	socialProviders: {
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID || "",
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
		},

		google: {
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},

	},
	plugins: [
		organization({
            ac,
            roles:{
                admin,
                superadmin,
                doctor
            },


			async sendInvitationEmail(data) {
                await resend.emails.send({
                    from,
                    to: data.email,
                    subject: "You've been invited to join an organization",
                    react: reactInvitationEmail({
                        username: data.email,
                        invitedByUsername: data.inviter.user.name,
                        invitedByEmail: data.inviter.user.email,
                        teamName: data.organization.name,
                        inviteLink:
                            process.env.NODE_ENV === "development"
                                ? `http://localhost:3000/accept-invitation/${data.id}`
                                : `${
                                    process.env.BETTER_AUTH_URL ||
                                    "https://demo.better-auth.com"
                                }/accept-invitation/${data.id}`,
                    }),
                });
			},
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
                    await resend.emails.send({
                        from,
                        to: user.email,
                        subject: "Your OTP",
                        html: `${user.name} Your OTP is ${otp}`,
                    });
				},
			},
		}),
		passkey(),
		openAPI(),
		bearer(),
        adminPlugin({

            ac,
            roles: {
                admin,
                superadmin,
                doctor
            },
            defaultRole: "doctor",
            adminUserIds: [],
        }),
		multiSession(),
		oAuthProxy({
			productionURL:
				process.env.BETTER_AUTH_URL || "https://demo.better-auth.com",
		}),
		nextCookies(),
		oneTap(),
		deviceAuthorization({
			expiresIn: "3min",
			interval: "5s",
		}),
		lastLoginMethod(),
		jwt({
			jwt: {
				issuer: process.env.BETTER_AUTH_URL,
			},
		}),
		oauthProvider({
			loginPage: "/sign-in",
			consentPage: "/oauth/consent",
			allowDynamicClientRegistration: true,
			allowUnauthenticatedClientRegistration: true,
			scopes: [
				"openid",
				"profile",
				"email",
				"offline_access",
				"read:organization",
			],
			validAudiences: [
				process.env.BETTER_AUTH_URL || "https://demo.better-auth.com",
				(process.env.BETTER_AUTH_URL || "https://demo.better-auth.com") +
					"/api/mcp",
			],
			selectAccount: {
				page: "/oauth/select-account",
				shouldRedirect: async ({ headers }) => {
					const allSessions = await getAllDeviceSessions(headers);
					return allSessions?.length >= 1;
				},
			},
			customAccessTokenClaims({ referenceId, scopes }) {
				if (referenceId && scopes.includes("read:organization")) {
					const baseUrl =
						process.env.BETTER_AUTH_URL || "https://demo.better-auth.com";
					return {
						[`${baseUrl}/org`]: referenceId,
					};
				}
				return {};
			},
			postLogin: {
				page: "/oauth/select-organization",
				async shouldRedirect({ session, scopes, headers }) {
					const userOnlyScopes = [
						"openid",
						"profile",
						"email",
						"offline_access",
					];
					if (scopes.every((sc) => userOnlyScopes.includes(sc))) {
						return false;
					}
					// Check if user has multiple organizations to select from
					try {
						const organizations = (await getAllUserOrganizations(
							headers,
						)) as Organization[];
						return (
							organizations.length > 1 ||
							!(
								organizations.length === 1 &&
								organizations.at(0)?.id === session.activeOrganizationId
							)
						);
					} catch {
						return true;
					}
				},
				consentReferenceId({ session, scopes }) {
					if (scopes.includes("read:organization")) {
						const activeOrganizationId = (session?.activeOrganizationId ??
							undefined) as string | undefined;
						if (!activeOrganizationId) {
							throw new APIError("BAD_REQUEST", {
								error: "set_organization",
								error_description: "must set organization for these scopes",
							});
						}
						return activeOrganizationId;
					} else {
						return undefined;
					}
				},
			},
			silenceWarnings: {
				openidConfig: true,
				oauthAuthServerConfig: true,
			},
		}),
	],
	trustedOrigins: [
		"https://*.better-auth.com",
		"https://better-auth-demo-*-better-auth.vercel.app",
		"exp://",
		"https://appleid.apple.com",
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...authOptions,
	plugins: [
		...(authOptions.plugins ?? []),
		customSession(
			async ({ user, session }) => {
				return {
					user: {
						...user,
						customField: "customField",
					},
					session,
				};
			},
			authOptions,
			{ shouldMutateListDeviceSessionsEndpoint: true },
		),
    ],
});

export type Session = typeof auth.$Infer.Session;
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type OrganizationRole = ActiveOrganization["members"][number]["role"];
export type Invitation = typeof auth.$Infer.Invitation;
export type DeviceSession = Awaited<
	ReturnType<typeof auth.api.listDeviceSessions>
>[number];

async function getAllDeviceSessions(headers: Headers): Promise<unknown[]> {
	return await auth.api.listDeviceSessions({
		headers,
	});
}

async function getAllUserOrganizations(headers: Headers): Promise<unknown[]> {
	return await auth.api.listOrganizations({
		headers,
	});
}
