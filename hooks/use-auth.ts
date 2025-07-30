import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(redirectTo?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && redirectTo) {
      router.push(redirectTo);
    }
  }, [status, redirectTo, router]);

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    user: session?.user,
  };
} 