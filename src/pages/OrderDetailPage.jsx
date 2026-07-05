import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, MapPin, Receipt, X } from "lucide-react";
import { getOrder } from "../lib/services/orderService";
import { createReview } from "../lib/services/reviewService";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/shared/EmptyState";
import { RatingStars } from "../components/shared/RatingStars";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_SEQUENCE,
  ORDER_STATUS_TONE,
} from "../constants/roles";
import { formatPKR, cn } from "../lib/utils";
import { apiErrorMessage } from "../lib/api";

function StatusTracker({ status }) {
  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-paprika-500/10 px-4 py-3 text-sm font-semibold text-paprika-500">
        <X className="size-4" /> This order was cancelled.
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status);

  return (
    <div className="flex items-center">
      {ORDER_STATUS_SEQUENCE.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                  done
                    ? "border-saffron-500 bg-saffron-500 text-cream-50"
                    : "border-ink-900/15 text-ink-400 dark:border-cream-100/15"
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("text-center text-xs font-medium", done ? "text-ink-900 dark:text-cream-50" : "text-ink-400")}>
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {i < ORDER_STATUS_SEQUENCE.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1", i < currentIndex ? "bg-saffron-500" : "bg-ink-900/10 dark:bg-cream-100/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewForm({ orderId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createReview({ order_id: orderId, rating, comment: comment || undefined });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't submit your review."));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="rounded-2xl bg-cardamom-500/10 px-4 py-3 text-sm font-medium text-cardamom-600 dark:text-cardamom-400">
        Shukriya! Your review has been posted.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <RatingStars value={rating} onChange={setRating} size="lg" />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was the food and delivery?"
      />
      {error && <p className="text-sm font-medium text-paprika-500">{error}</p>}
      <Button type="submit" loading={loading} className="self-start">
        Submit review
      </Button>
    </form>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load this order.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner label="Loading order" className="py-24" />;
  if (error || !order) {
    return <EmptyState icon={Receipt} title="Order unavailable" body={error} className="mx-auto my-16 max-w-md" />;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-ink-500 dark:text-ink-200">
            {new Date(order.created_at).toLocaleString("en-PK")}
          </p>
        </div>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <Card className="mt-6 p-6">
        <StatusTracker status={order.status} />
      </Card>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-200">
          <MapPin className="size-4 text-saffron-500" /> {order.delivery_address}
        </div>
        {order.notes && <p className="mt-2 text-sm italic text-ink-500 dark:text-ink-300">"{order.notes}"</p>}

        <div className="kot-divider my-5" />

        <ul className="flex flex-col gap-2 font-mono text-sm text-ink-800 dark:text-cream-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.quantity}× {item.food_name}</span>
              <span>{formatPKR(item.price_at_order * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="kot-divider my-5" />

        <div className="flex justify-between font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
          <span>Total</span>
          <span>{formatPKR(order.total_amount)}</span>
        </div>
      </Card>

      {order.status === ORDER_STATUS.DELIVERED && (
        <Card className="mt-6 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-200">
            Leave a review
          </h2>
          <ReviewForm orderId={order.id} />
        </Card>
      )}
    </div>
  );
}
