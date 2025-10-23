

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ScrollRestoration from "@/components/ScrollRestoration";
import Preloader from "@/components/Preloader";
import Chatbot from "@/components/Chatbot";
import React, { Suspense } from "react";

const Index = React.lazy(() => import("@/pages/Index"));
const Products = React.lazy(() => import("@/pages/Products"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const CheckoutSuccess = React.lazy(() => import("@/pages/CheckoutSuccess"));
const About = React.lazy(() => import("@/pages/About"));
const Testimonials = React.lazy(() => import("@/pages/Testimonials"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Preloader />
          <ScrollRestoration />
          <Header />
          <main className="min-h-screen">
            <Suspense fallback={<Preloader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/about" element={<About />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <CartSidebar />
          <Chatbot />
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
