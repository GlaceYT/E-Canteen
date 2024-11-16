// src/types.ts
export type RootStackParamList = {
    Login: undefined;
    Admin: undefined;
    Student: undefined;
    Signup: undefined;
  };


// Type for each item in an order
// src/types.ts

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  image?: string | null; // Optional field for image
};

export type Order = {
  id: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'Received' | 'Preparing' | 'Finished';
};

