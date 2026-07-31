"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/actions/reviews";
import { formatDate, cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  userName: string;
  createdAt: string;
};

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const result = await submitReview(productId, { rating, comment });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setComment("");
  }

  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-semibold">Reseñas</h2>

      {session?.user && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 text-sm font-medium">Dejá tu reseña</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <Star
                  className={cn(
                    "size-6",
                    n <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Contanos tu experiencia con el producto (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
          />
          <Button onClick={handleSubmit} disabled={loading} className="rounded-full">
            {loading ? "Enviando..." : "Publicar reseña"}
          </Button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay reseñas para este producto.</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{review.userName}</span>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      "size-4",
                      n <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
