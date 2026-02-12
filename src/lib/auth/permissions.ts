import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
const statement = {
    ...defaultStatements,
    patient: ["create", "update", "view", "delete"],
    appointment: ["create", "update", "view", "delete", "schedule"],
    report: ["create", "view", "export"]
} as const;

const ac = createAccessControl(statement);
export const admin = ac.newRole({

    ...adminAc.statements,
});
export const superadmin = ac.newRole({
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    patient: ["create", "update", "view", "delete"],
    appointment: ["create", "update", "view", "delete", "schedule"],
    report: ["create", "view", "export"]
});
export const doctor = ac.newRole({
    patient: ["create", "update", "view"],
    appointment: ["create", "update", "view", "schedule"],
    report: ["create", "view"]
});
export { ac };