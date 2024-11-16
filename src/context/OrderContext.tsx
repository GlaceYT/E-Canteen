// src/context/OrderContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Order {
  id: string;
  items: string[];
  status: 'Received' | 'Picked' | 'Prepared';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Order) => setOrders([...orders, order]);
  const updateOrderStatus = (id: string, status: Order['status']) =>
    setOrders(orders.map(order => order.id === id ? { ...order, status } : order));

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
