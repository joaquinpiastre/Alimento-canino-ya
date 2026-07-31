import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-9 w-48" />
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
