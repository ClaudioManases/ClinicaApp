"use client";

import { useOrganizationDetailQuery } from "@/data/organization/organization-detail-query";
import { useInviteMemberMutation } from "@/data/organization/invitation-member-mutation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { OrganizationRole } from "@/lib/auth";

export default function MembersPage() {
    const { data: organization, isLoading } = useOrganizationDetailQuery();
    const inviteMember = useInviteMemberMutation();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<OrganizationRole>("member");

    const handleInviteMember = () => {
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        inviteMember.mutate({
            email,
            role
        }, {
            onSuccess: () => {
                setIsInviteOpen(false);
                setEmail("");
                setRole("member");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Members</h1>
                <p>Please select an organization to view members.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Members</h1>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Member</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role} onValueChange={(value) => setRole(value as OrganizationRole)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleInviteMember} disabled={inviteMember.isPending}>
                                {inviteMember.isPending ? "Inviting..." : "Invite"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {organization.members?.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.user.name}</TableCell>
                                <TableCell>{member.user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">{member.role}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {organization.invitations?.map((invitation) => (
                            <TableRow key={invitation.id} className="opacity-70">
                                <TableCell className="font-medium italic">Pending...</TableCell>
                                <TableCell>{invitation.email}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize">{invitation.role} (Invited)</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-red-600">Cancel</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
