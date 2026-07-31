import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/ingresar");

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold">Datos personales</h2>
      <ProfileForm defaultValues={{ name: user.name, phone: user.phone ?? "" }} email={user.email} />
    </div>
  );
}
