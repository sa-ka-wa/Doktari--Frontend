import React from "react";
import AppRouter from "./router";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { BrandProvider } from "./context/BrandContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrandProvider>
        <UserProvider>
          <CartProvider>
            <OrderProvider>
              <AppRouter />
            </OrderProvider>
          </CartProvider>
        </UserProvider>
      </BrandProvider>
    </AuthProvider>
  );
}

export default App;
