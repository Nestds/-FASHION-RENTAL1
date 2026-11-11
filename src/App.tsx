/**
 * DRESSÉ – FASHION RENTAL
 * Haute Couture & Evening Dress Rental Web Application
 * Student Graduation Project Architecture
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { SizeChartModal } from './components/SizeChartModal';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyAccountPage } from './pages/MyAccountPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { store } from './services/store';
import { initFirebase } from './services/firebase';
import { Product, Booking } from './types';
import { Database, Sparkles, Shield, AlertCircle } from 'lucide-react';

export default function App() {
  const [, setTick] = useState(0);

  // Router state
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-001');
  const [activeBookingId, setActiveBookingId] = useState<string>('book-001');
  const [collectionCategoryId, setCollectionCategoryId] = useState<string>('');
  const [accountInitialTab, setAccountInitialTab] = useState<string>('profile');

  // Booking parameters from Product Detail
  const [bookingParams, setBookingParams] = useState<{
    productId: string;
    sizeId: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  // Modals state
  const [firebaseGuideOpen, setFirebaseGuideOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    initFirebase();
    const unsubscribe = store.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const currentUser = store.getCurrentUser();
  const products = store.getProducts();
  const categories = store.getCategories();
  const sizes = store.getSizes();
  const promotions = store.getPromotions();
  const reviews = store.getReviews();
  const bookings = store.getAllBookings();
  const payments = store.getAllPayments();
  const returns = store.getAllReturns();
  const users = store.getAllUsers();

  const userFavorites = currentUser ? store.getFavorites(currentUser.uid) : [];

  // Navigation router handler
  const handleNavigate = (path: string, params?: Record<string, any>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (params?.categoryId) {
      setCollectionCategoryId(params.categoryId);
    }
    if (params?.tab) {
      setAccountInitialTab(params.tab);
    }
    if (params?.scrollToAbout) {
      setCurrentPath('home');
      setTimeout(() => {
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (params?.scrollToCategories) {
      setCurrentPath('home');
      setTimeout(() => {
        document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    setCurrentPath(path);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    handleNavigate('product_detail');
  };

  const handleStartBooking = (params: {
    productId: string;
    sizeId: string;
    startDate: string;
    endDate: string;
  }) => {
    setBookingParams(params);
    handleNavigate('booking');
  };

  const handleBookingSuccess = (bookingId: string) => {
    setActiveBookingId(bookingId);
    handleNavigate('payment');
  };

  const handleSwitchRole = (role: 'admin' | 'member') => {
    if (role === 'admin') {
      store.loginAsAdmin();
    } else {
      store.loginAsCustomer();
    }
  };

  const activeProduct = store.getProductById(selectedProductId) || products[0];
  const activeBooking = store.getBookingById(activeBookingId) || bookings[0];

  // If Admin dashboard route is active
  if (currentPath === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <AdminLayout
          currentUser={currentUser || users[0]}
          products={products}
          categories={categories}
          sizes={sizes}
          bookings={bookings}
          payments={payments}
          returns={returns}
          users={users}
          onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
          onExitAdmin={() => handleNavigate('home')}
          onLogout={() => {
            store.logout();
            handleNavigate('home');
          }}
        />

        <FirebaseGuideModal
          isOpen={firebaseGuideOpen}
          onClose={() => setFirebaseGuideOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F9] flex flex-col selection:bg-[#B26571] selection:text-white">
      {/* Informative Banner */}
      <div className="bg-[#FAF5F6] border-b border-[#EED8DC]/80 px-4 py-2 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#7E6D70]">
            <span className="w-2 h-2 rounded-full bg-[#B26571]"></span>
            <span>
              <strong>DRESSÉ Graduation Project:</strong> ระบบเช่าชุดราตรีออนไลน์พร้อม Cloud Firestore Architecture (12 Collections) & Security Rules
            </span>
          </div>

          <button
            onClick={() => setFirebaseGuideOpen(true)}
            className="text-[11px] text-[#B26571] font-medium hover:underline flex items-center gap-1.5 shrink-0"
          >
            <Database className="w-3.5 h-3.5 text-[#D48C95]" />
            <span>ตรวจสอบโครงสร้างฐานข้อมูล & Security Rules</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar
        currentUser={currentUser}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        favoritesCount={userFavorites.length}
        onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={() => {
          store.logout();
          handleNavigate('home');
        }}
      />

      {/* Page Content Body */}
      <main className="flex-1">
        {currentPath === 'home' && (
          <HomePage
            categories={categories}
            products={products}
            promotions={promotions}
            reviews={reviews}
            favorites={userFavorites}
            onToggleFavorite={(pId) => {
              if (currentUser) {
                store.toggleFavorite(currentUser.uid, pId);
              } else {
                handleNavigate('login');
              }
            }}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPath === 'collection' && (
          <CollectionPage
            products={products}
            categories={categories}
            sizes={sizes}
            favorites={userFavorites}
            initialCategoryId={collectionCategoryId}
            onToggleFavorite={(pId) => {
              if (currentUser) {
                store.toggleFavorite(currentUser.uid, pId);
              } else {
                handleNavigate('login');
              }
            }}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPath === 'product_detail' && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            sizes={sizes}
            reviews={reviews}
            isFavorite={userFavorites.includes(activeProduct.productId)}
            onToggleFavorite={() => {
              if (currentUser) {
                store.toggleFavorite(currentUser.uid, activeProduct.productId);
              } else {
                handleNavigate('login');
              }
            }}
            onBack={() => handleNavigate('collection')}
            onOpenSizeChart={() => setSizeChartOpen(true)}
            onStartBooking={handleStartBooking}
          />
        )}

        {currentPath === 'booking' && activeProduct && (
          <BookingPage
            product={activeProduct}
            sizeId={bookingParams?.sizeId || activeProduct.sizes[0]?.sizeId || 'size-s'}
            startDate={bookingParams?.startDate || new Date().toISOString().split('T')[0]}
            endDate={bookingParams?.endDate || new Date().toISOString().split('T')[0]}
            currentUser={currentUser}
            onBack={() => handleNavigate('product_detail')}
            onNavigateToLogin={() => handleNavigate('login')}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {currentPath === 'payment' && activeBooking && (
          <PaymentPage
            booking={activeBooking}
            onViewBookings={() => handleNavigate('account', { tab: 'bookings' })}
          />
        )}

        {currentPath === 'login' && (
          <LoginPage
            onSuccess={() => handleNavigate('home')}
            onNavigateToRegister={() => handleNavigate('register')}
          />
        )}

        {currentPath === 'register' && (
          <RegisterPage
            onSuccess={() => handleNavigate('home')}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}

        {currentPath === 'account' && (
          currentUser ? (
            <MyAccountPage
              currentUser={currentUser}
              initialTab={accountInitialTab}
              onNavigateToPayment={(b) => {
                setActiveBookingId(b.bookingId);
                handleNavigate('payment');
              }}
              onSelectProduct={handleSelectProduct}
              onLogout={() => {
                store.logout();
                handleNavigate('home');
              }}
            />
          ) : (
            <LoginPage
              onSuccess={() => handleNavigate('account')}
              onNavigateToRegister={() => handleNavigate('register')}
            />
          )
        )}

        {currentPath === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
      />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        sizes={sizes}
      />

      {/* Firebase Diagnostics Guide Modal */}
      <FirebaseGuideModal
        isOpen={firebaseGuideOpen}
        onClose={() => setFirebaseGuideOpen(false)}
      />
    </div>
  );
}
