"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { getServerCart, syncServerCart } from "@/actions/cart";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  offerPrice: number | null;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "alimento-canino-cart";

function readLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hasMergedForUser = useRef<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    setItems(readLocalCart());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Merge local cart with server cart once per login.
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    if (hasMergedForUser.current === session.user.id) return;
    hasMergedForUser.current = session.user.id;

    (async () => {
      const serverItems = await getServerCart();
      setItems((current) => {
        const merged = new Map<string, CartItem>();
        for (const item of current) merged.set(item.productId, item);
        for (const serverItem of serverItems) {
          const existing = merged.get(serverItem.productId);
          if (existing) {
            existing.quantity = Math.max(existing.quantity, serverItem.quantity);
          }
        }
        return Array.from(merged.values());
      });
    })();
  }, [status, session?.user?.id]);

  // Push cart to server whenever it changes for a logged-in user.
  useEffect(() => {
    if (status !== "authenticated" || !hydrated.current) return;
    const timeout = setTimeout(() => {
      syncServerCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    }, 500);
    return () => clearTimeout(timeout);
  }, [items, status]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
            : i
        );
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const unitPrice = item.offerPrice ?? item.price;
        acc.count += item.quantity;
        acc.subtotal += unitPrice * item.quantity;
        return acc;
      },
      { count: 0, subtotal: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addItem, removeItem, updateQuantity, clear, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
