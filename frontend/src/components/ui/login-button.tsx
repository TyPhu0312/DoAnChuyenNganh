"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn("keycloak", {
          callbackUrl: callbackUrl ?? `${window.location.origin}/`,
        })
      }
    >
      <Icons.keycloak className="mr-2 h-4 w-4" />
      Đăng nhập sử dụng Keycloak
    </Button>
  );
}
