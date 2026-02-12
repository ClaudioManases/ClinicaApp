"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    Download,
    Filter,
    Plus
} from "lucide-react"


export default function Page() {
    return (
     <>
         <main className="flex-1 overflow-auto p-6">
             <div className="flex items-center justify-between mb-6">
                 <div>
                     <h1 className="text-3xl font-bold tracking-tight">
                         Dashboard Médico
                     </h1>
                     <p className="text-muted-foreground">
                         Gerencie suas consultas, pacientes e atividades
                     </p>
                 </div>
                 <div className="flex items-center gap-2">
                     <SidebarTrigger />
                     <Button variant="outline" size="icon">
                         <Filter className="h-4 w-4" />
                     </Button>
                     <Button>
                         <Plus className="mr-2 h-4 w-4" />
                         Nova Consulta
                     </Button>
                 </div>
             </div>

             <Breadcrumb

             />

             <Card className="mb-6" />

             <Tabs defaultValue="consultas" className="space-y-4">
                 <TabsList>
                     <TabsTrigger value="consultas">Consultas Hoje</TabsTrigger>
                     <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
                     <TabsTrigger value="agenda">Agenda</TabsTrigger>
                     <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                 </TabsList>

                 <TabsContent value="consultas" className="space-y-4">
                     <Card>
                         <CardHeader>
                             <div className="flex items-center justify-between">
                                 <div>
                                     <CardTitle>Consultas do Dia</CardTitle>
                                     <CardDescription>
                                         {new Date().toLocaleDateString('pt-BR', {
                                             weekday: 'long',
                                             year: 'numeric',
                                             month: 'long',
                                             day: 'numeric'
                                         })}
                                     </CardDescription>
                                 </div>
                                 <Button variant="outline" size="sm">
                                     <Download className="mr-2 h-4 w-4" />
                                     Exportar
                                 </Button>
                             </div>
                         </CardHeader>
                         <CardContent>

                         </CardContent>
                     </Card>
                 </TabsContent>

                 <TabsContent value="agenda">
                     <Card>
                         <CardHeader>
                             <CardTitle>Agenda Semanal</CardTitle>
                             <CardDescription>
                                 Visualize sua agenda de consultas
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <div className="h-[400px] flex items-center justify-center border rounded-lg">
                                 <Calendar className="h-12 w-12 text-muted-foreground" />
                                 <span className="ml-2 text-muted-foreground">
                      Calendário de consultas
                    </span>
                             </div>
                         </CardContent>
                     </Card>
                 </TabsContent>
             </Tabs>
         </main>
     </>
    )
}

