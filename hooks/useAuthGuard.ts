import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useAuthGuard = () => {
  const router = useRouter();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
    }
  }, [user, initializing, router]);

  return { user, initializing };
};


