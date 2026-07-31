import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAddresses } from "@/actions/addresses";
import { AddressManager } from "./address-manager";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar");

  const addresses = await getAddresses();

  return (
    <div>
      <h2 className="mb-4 font-heading text-lg font-semibold">Mis direcciones</h2>
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
