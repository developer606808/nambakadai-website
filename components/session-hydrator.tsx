"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/auth/authSlice";
import { User } from "@/lib/features/auth/authSlice";

const SessionHydrator = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user: User = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        avatar: session.user.image,
        verified: session.user.emailVerified,
      };
      dispatch(setUser(user));
    }
  }, [status, session, dispatch]);

  return null;
};

export default SessionHydrator;