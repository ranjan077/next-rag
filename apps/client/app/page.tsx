"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Dashboard from "./components/dashboard";

export default function HomePage() {
  const { userId } = useAuth();
  const { user } = useUser();

  const role: string = user?.publicMetadata?.role as string;

  if (!userId) {
    redirect("/sign-in");
  }

  return <Dashboard role={role} />;
}
