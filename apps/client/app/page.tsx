"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Dashboard from "./components/dashboard";

export default function HomePage() {
  const { userId } = useAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <Dashboard />;
    </div>
  );
}
