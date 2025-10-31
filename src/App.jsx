import React from "react";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { BrandProvider } from "./context/BrandContext";
import "./App.css";

function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AuthProvider>
    </BrandProvider>
  );
}

export default App;
