'use client'

import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import { UseFormReturn } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'

interface AuthMethodsSectionProps {
    form: UseFormReturn<any>
}

export function AuthMethodsSection({ form }: AuthMethodsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Authentication Strategies</CardTitle>
                <CardDescription>
                    Direct the authentication methods to prevent when a user signs in.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="lessThanOneShotAuth"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Less than one shot authentication</FormLabel>
                                <FormDescription>
                                    Enable additional security measures.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personalized</h3>
                    <FormField
                        control={form.control}
                        name="personalizedSignin"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Personalized sign-in</FormLabel>
                                    <FormDescription>
                                        Users can sign in with personalized methods.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="persistentTokens"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Persistent tokens</FormLabel>
                                    <FormDescription>
                                        Persistent tokens are required during sign up unless the user signs up with a Social Connection or a Web wallet.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="ml-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="allowSocialConnections"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Social Connections</FormLabel>
                                        <FormDescription>
                                            Allow users to sign up with social providers.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="allowWebWallet"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Web Wallet</FormLabel>
                                        <FormDescription>
                                            Allow users to sign up with web wallets.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}