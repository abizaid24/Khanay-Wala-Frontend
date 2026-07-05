import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Store, UtensilsCrossed } from "lucide-react";
import { browseRestaurants } from "../lib/services/restaurantService";
import { searchFoods } from "../lib/services/foodService";
import { RestaurantCard } from "../components/shared/RestaurantCard";
import { FoodCard } from "../components/shared/FoodCard";
import { EmptyState } from "../components/shared/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { SectionHeading } from "../components/shared/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiErrorMessage } from "../lib/api";
import { ROLES } from "../constants/roles";
import { cn } from "../lib/utils";

const TABS = [
  { id: "restaurants", label: "Restaurants", icon: Store },
  { id: "dishes", label: "Dishes", icon: UtensilsCrossed },
];

export default function RestaurantsPage() {
  const [tab, setTab] = useState("restaurants");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [addingId, setAddingId] = useState(null);

  const { isAuthenticated, role } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const timer = setTimeout(() => {
      const term = search.trim();

      if (tab === "dishes") {
        if (!term) {
          setResults([]);
          setIsLoading(false);
          return;
        }
        searchFoods({ q: term })
          .then(setResults)
          .catch(() => setError("Couldn't search dishes right now. Please try again."))
          .finally(() => setIsLoading(false));
      } else {
        browseRestaurants({ search: term || undefined })
          .then(setResults)
          .catch(() => setError("Couldn't load restaurants right now. Please try again."))
          .finally(() => setIsLoading(false));
      }
    }, 300); // debounce while typing

    return () => clearTimeout(timer);
  }, [search, tab]);

  const handleAddDish = async (foodItemId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/restaurants" } } });
      return;
    }
    if (role !== ROLES.CUSTOMER) {
      setNotice("Only customer accounts can order food.");
      return;
    }
    setAddingId(foodItemId);
    setNotice("");
    try {
      await addItem(foodItemId, 1);
      setNotice("Added to cart.");
    } catch (err) {
      setNotice(apiErrorMessage(err, "Couldn't add that item to your cart."));
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <SectionHeading
        eyebrow="Browse"
        title="Kya khaane ka dil hai?"
        description="Search restaurants by name, or jump straight to a dish across the whole platform."
      />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-ink-900/10 bg-cream-50 p-1 dark:border-cream-100/10 dark:bg-ink-800">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSearch(""); setResults([]); }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === id
                  ? "bg-saffron-500 text-cream-50"
                  : "text-ink-600 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-cream-100/10"
              )}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-2.5 dark:border-cream-100/10 dark:bg-ink-800">
          <Search className="size-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "dishes" ? "Search dishes — e.g. Biryani, Karahi..." : "Search restaurants by name..."}
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:text-cream-50"
          />
        </div>
      </div>

      {notice && (
        <div className="mt-4 rounded-2xl bg-saffron-50 px-4 py-3 text-sm font-medium text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-300">
          {notice}
        </div>
      )}

      <div className="mt-8">
        {isLoading && <Spinner label={tab === "dishes" ? "Searching dishes" : "Finding restaurants"} className="py-16" />}

        {!isLoading && error && <EmptyState icon={Store} title="Something went wrong" body={error} />}

        {!isLoading && !error && tab === "dishes" && !search.trim() && (
          <EmptyState
            icon={UtensilsCrossed}
            title="Type a dish to search"
            body={'Try "Biryani", "Karahi", or "Nihari" — search runs across every restaurant\'s menu.'}
          />
        )}

        {!isLoading && !error && results.length === 0 && (search.trim() || tab === "restaurants") && (
          <EmptyState
            icon={tab === "dishes" ? UtensilsCrossed : Store}
            title={tab === "dishes" ? "No dishes found" : "No restaurants found"}
            body={search ? `Nothing matched "${search}" — try a different word.` : "Nothing is live yet."}
          />
        )}

        {!isLoading && !error && results.length > 0 && tab === "restaurants" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}

        {!isLoading && !error && results.length > 0 && tab === "dishes" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <FoodCard key={item.id} item={item} onAdd={handleAddDish} adding={addingId === item.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
