import type { ReactNode } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase/server";

type DashboardLayoutProps = {
  children: ReactNode;
};

function getStudentName(
  userMetadata: Record<string, unknown>,
  email?: string
): string {
  const name =
    typeof userMetadata.name === "string"
      ? userMetadata.name.trim()
      : "";

  const fullName =
    typeof userMetadata.full_name === "string"
      ? userMetadata.full_name.trim()
      : "";

  if (name) {
    return name;
  }

  if (fullName) {
    return fullName;
  }

  if (email) {
    const emailName = email.split("@")[0];

    if (emailName) {
      return emailName;
    }
  }

  return "Aluno";
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `Erro ao buscar usuário autenticado: ${error.message}`
    );
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const studentName = getStudentName(
    user.user_metadata ?? {},
    user.email
  );

  const studentInitial =
    studentName.charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-[#F5F5F6]">
      <Sidebar />

      <DashboardHeader
        studentName={studentName}
        studentInitial={studentInitial}
      />

      <div className="lg:pl-72">
        <main className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}