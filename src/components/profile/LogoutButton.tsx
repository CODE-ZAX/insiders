"use client";
import React from "react";
import { Button } from "../ui/button";
import { DoorClosed } from "lucide-react";
import { createSPAClient } from "@/lib/supabase/client";

const LogoutButton = () => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          const supabase = createSPAClient();
          await supabase.auth.signOut();
        }}
      >
        <DoorClosed /> Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
