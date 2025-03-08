import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
  restaurantName: string;
  restaurantId: string; // Ajout de la propriété manquante restaurantId
}

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: string;
  addToCart: (meal: any, restaurantName: string) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<string>('0,00€');

  useEffect(() => {
    if (cartItems.length === 0) {
      setTotalPrice('0,00€');
      return;
    }

    const total = cartItems.reduce((sum, item) => {
      const priceNumber = parseFloat(item.price.replace('€', '').replace(',', '.'));
      return sum + (priceNumber * item.quantity);
    }, 0);

    setTotalPrice(total.toFixed(2).replace('.', ',') + '€');
  }, [cartItems]);

  const addToCart = (meal: any, restaurantName: string): void => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === meal.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, {
          id: meal.id,
          name: meal.name,
          price: meal.price,
          quantity: 1,
          imageUrl: meal.imageUrl,
          restaurantName,
          restaurantId: meal.restaurantId // Assurez-vous que meal contient restaurantId
        }];
      }
    });
  };

  const removeFromCart = (id: string): void => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const increaseQuantity = (id: string): void => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string): void => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const clearCart = (): void => {
    setCartItems([]);
  };

  const contextValue: CartContextType = {
    cartItems,
    totalPrice,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};