import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  users: {
    name: string;
    image?: string;
  }[];
  limit?: number;
  className?: string;
}

export function AvatarGroup({ users, limit = 5, className }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, limit);
  const remainingUsers = users.length - limit;

  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {visibleUsers.map((user, i) => (
        <Avatar 
          key={i} 
          className="border-[1.5px] border-white dark:border-zinc-950 w-9 h-9 ring-1 ring-black/5 transition-transform hover:scale-110 hover:z-10"
        >
          <AvatarImage src={user.image} alt={user.name} className="object-cover" />
          <AvatarFallback className="text-[10px] font-medium bg-muted text-muted-foreground">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <div className="flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 ring-1 ring-black/5 z-0">
          +{remainingUsers}
        </div>
      )}
    </div>
  );
}