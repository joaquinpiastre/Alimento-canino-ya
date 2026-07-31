import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-5 w-64" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
