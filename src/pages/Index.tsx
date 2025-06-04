
import React from 'react';
import Hero from '../components/Hero';
import QuickCategories from '../components/QuickCategories';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import Statistics from '../components/Statistics';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />
      <Hero />
      <QuickCategories />
      <FeaturedBusinesses />
      <Statistics />
      <Footer />
    </div>
  );
};

export default Index;
