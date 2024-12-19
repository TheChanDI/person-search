"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { EditUserDialog } from "./edit-user-dialog";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ActionState } from "@/components/mutable-dialog";
import { useToast } from "@/hooks/use-toast";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => Promise<ActionState<User>>;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    const data = await onDelete(user.id);

    if (data.success) {
      toast({ title: "Success", description: data.message });
    } else {
      toast({ title: "Error", description: data.message });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
            alt={user.name}
          />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">
            ID: {user.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 relative">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
        <div className="mt-4 flex gap-x-3">
          <EditUserDialog user={user} />
          <div>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
