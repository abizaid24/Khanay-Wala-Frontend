import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Phone, Plus, ShoppingBag, Store } from "lucide-react";
import { getRestaurant } from "../lib/services/restaurantService";
import { getMenu } from "../lib/services/foodService";
import { getRestaurantReviews } from "../lib/services/reviewService";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/shared/EmptyState";
import { RatingStars } from "../components/shared/RatingStars";
import { KOTDivider } from "../components/shared/KOTDivider";
import { formatPKR } from "../lib/utils";
import { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ROLES } from "../constants/roles";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    Promise.all([getRestaurant(id), getMenu(id), getRestaurantReviews(id)])
      .then(([r, m, rv]) => {
        setRestaurant(r);
        setMenu(m);
        setReviews(rv);
      })
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load this restaurant.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = async (foodItemId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/restaurants/${id}` } } });
      return;
    }
    if (role !== ROLES.CUSTOMER) {
      setCartNotice("Only customer accounts can order food.");
      return;
    }
    setAddingId(foodItemId);
    setCartNotice("");
    try {
      await addItem(foodItemId, 1);
      setCartNotice("Added to cart.");
    } catch (err) {
      setCartNotice(apiErrorMessage(err, "Couldn't add that item to your cart."));
    } finally {
      setAddingId(null);
    }
  };

  if (isLoading) return <Spinner label="Loading restaurant" className="py-24" />;
  if (error || !restaurant) {
    return <EmptyState icon={Store} title="Restaurant unavailable" body={error} className="mx-auto my-16 max-w-md" />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-saffron-100 to-saffron-50 text-saffron-500 dark:from-ink-700 dark:to-ink-800">
            <Store className="size-7" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">{restaurant.name}</h1>
              {!restaurant.is_active && <Badge tone="paprika">Currently closed</Badge>}
            </div>
            {reviews.length > 0 && (
              <div className="mt-1 flex items-center gap-2">
                <RatingStars value={avgRating} />
                <span className="text-sm text-ink-600 dark:text-ink-200">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                </span>
              </div>
            )}
            {restaurant.description && (
              <p className="mt-2 max-w-lg text-sm text-ink-600 dark:text-ink-200">{restaurant.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-600 dark:text-ink-200">
              <span className="flex items-center gap-1.5"><MapPin className="size-4 text-saffron-500" /> {restaurant.address}</span>
              {restaurant.phone && (
                <span className="flex items-center gap-1.5"><Phone className="size-4 text-saffron-500" /> {restaurant.phone}</span>
              )}
            </div>
          </div>
        </div>

        <Link to="/cart">
          <Button variant="secondary" className="gap-2">
            <ShoppingBag className="size-4" /> View cart
          </Button>
        </Link>
      </div>

      {cartNotice && (
        <div className="mt-6 rounded-2xl bg-saffron-50 px-4 py-3 text-sm font-medium text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
          {cartNotice}
        </div>
      )}

      <KOTDivider label="Menu" className="my-10" />

      {menu.length === 0 ? (
        <EmptyState icon={Store} title="No menu items yet" body="This restaurant hasn't added any dishes." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {menu.map((item) => (
            <Card key={item.id} className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <h3 className="font-semibold text-ink-900 dark:text-cream-50">{item.name}</h3>
                {item.description && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-600 dark:text-ink-200">{item.description}</p>
                )}
                <p className="mt-1.5 font-mono text-sm font-semibold text-saffron-600 dark:text-saffron-400">
                  {formatPKR(item.price)}
                </p>
              </div>
              <Button
                size="sm"
                variant={item.is_available ? "primary" : "secondary"}
                disabled={!item.is_available}
                loading={addingId === item.id}
                onClick={() => handleAddToCart(item.id)}
                className="shrink-0 gap-1"
              >
                <Plus className="size-4" /> {item.is_available ? "Add" : "Sold out"}
              </Button>
            </Card>
          ))}
        </div>
      )}

      <KOTDivider label="Reviews" className="my-10" />

      {reviews.length === 0 ? (
        <EmptyState icon={Store} title="No reviews yet" body="Be the first to order and leave a review." />
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <RatingStars value={review.rating} />
              {review.comment && <p className="mt-2 text-sm text-ink-700 dark:text-cream-200">{review.comment}</p>}
              <p className="mt-2 text-xs text-ink-400">{new Date(review.created_at).toLocaleDateString("en-PK")}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
