import Link from "next/link";
import { PawPrint } from "lucide-react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-6 flex items-center justify-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <PawPrint className="size-5" />
        </span>
        <span className="font-heading text-lg font-semibold">Alimento Canino Ya</span>
      </Link>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
