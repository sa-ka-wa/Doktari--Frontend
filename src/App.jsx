import React from "react";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { BrandProvider } from "./context/BrandContext";
import { CartProvider } from './context/CartContext';
import "./App.css";

function App() {
  return (
    <BrandProvider>
      <AuthProvider>
         <CartProvider>
        <div className="App">
          <AppRouter />
        </div>
         </CartProvider>
      </AuthProvider>
    </BrandProvider>
  );
}

export default App;
