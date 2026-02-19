"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Building2, UserPlus, LogOut } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useOrganizationListQuery } from "@/data/organization/organization-list-query"
import { useOrganizationActiveMutation } from "@/data/organization/organization-active-mutation"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOrganizationCreateMutation } from "@/data/organization/organization-create-mutation"


export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { data: organizations } = useOrganizationListQuery()
  const { data: session } = useSession();
  const setActiveOrganization = useOrganizationActiveMutation()
  const createOrganization = useOrganizationCreateMutation()
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newOrgName, setNewOrgName] = React.useState("")
  const [newOrgSlug, setNewOrgSlug] = React.useState("")


  const activeOrganization = organizations?.find(org => org.id === session?.session?.activeOrganizationId) || organizations?.[0]

  const handleCreateOrganization = () => {
    if (!newOrgName || !newOrgSlug) {
      toast.error("Please fill in all fields")
      return
    }
    
    createOrganization.mutate({
      name: newOrgName,
      slug: newOrgSlug
    }, {
      onSuccess: () => {
        setIsCreateOpen(false)
        setNewOrgName("")
        setNewOrgSlug("")
      }
    })
  }

  if (!activeOrganization && !organizations?.length) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
           <div className="p-2 text-sm text-muted-foreground">
             No organization found.
             {session?.user?.role === "admin" && (
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsCreateOpen(true)}>
                  Create one
                </Button>
             )}
              {session?.user?.role === "doctor" && (
                <span className="block mt-1 text-xs">Wait for an invitation.</span>
             )}
           </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
                {activeOrganization?.logo ? (
                    <img
                        src={activeOrganization.logo}
                        alt={activeOrganization.name}
                        className="size-8 aspect-square rounded-lg "
                    />
                ) : (
                    <Building2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-primary">{activeOrganization?.name || "Select Organization"}</span>
                <span className="truncate text-xs">{session?.user?.role || "Member"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations?.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setActiveOrganization.mutate({ organizationId: org.id })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                   {org.logo ? (
                        <img
                            src={org.logo}
                            alt={org.name}
                            className="size-3.5 shrink-0" />
                    ) : (
                        <Building2 className="size-3.5 shrink-0" />
                    )}
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            
            {session?.user?.role === "admin" && (
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">Create Organization</div>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Organization</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={newOrgSlug} onChange={(e) => setNewOrgSlug(e.target.value)} />
                            </div>
                            <Button onClick={handleCreateOrganization} disabled={createOrganization.isPending}>
                                {createOrganization.isPending ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
