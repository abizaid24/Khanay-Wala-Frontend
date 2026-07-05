import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, clearCart as clearCartRequest, getCart, removeCartItem, updateCartItem } from "../lib/services/cartService";
import { useAuth } from "./AuthContext";
import { ROLES } from "../constants/roles";

const CartContext = createContext(null);

const EMPTY_CART = { id: null, items: [], total: 0 };

export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuth();
  const isCustomer = isAuthenticated && role === ROLES.CUSTOMER;

  const [cart, setCart] = useState(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isCustomer) return;
    setIsLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    if (isCustomer) {
      refreshCart();
    } else {
      setCart(EMPTY_CART);
    }
  }, [isCustomer, refreshCart]);

  // addItem lets errors (e.g. "items from another restaurant") bubble up so
  // the calling page can show the exact backend message.
  const addItem = useCallback(async (foodItemId, quantity = 1) => {
    const data = await addCartItem({ food_item_id: foodItemId, quantity });
    setCart(data);
    return data;
  }, []);

  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    const data = await updateCartItem(itemId, quantity);
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const data = await removeCartItem(itemId);
    setCart(data);
    return data;
  }, []);

  const emptyCart = useCallback(async () => {
    await clearCartRequest();
    setCart(EMPTY_CART);
  }, []);

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      itemCount,
      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
      emptyCart,
    }),
    [cart, isLoading, itemCount, refreshCart, addItem, updateItemQuantity, removeItem, emptyCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
