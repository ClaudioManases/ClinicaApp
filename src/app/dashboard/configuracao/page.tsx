import { UserSettingsForm } from './components/UserSettingsForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Settings</h1>
                    <p className="text-muted-foreground">
                        Configure the user attributes. The Click API should work with:
                    </p>
                </div>

                <Separator />

                <UserSettingsForm />
            </div>
        </div>
    )
}