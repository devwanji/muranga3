import React from 'react';
import { Link } from 'wouter';
import CategoryCard from '@/components/CategoryCard';
import BusinessCard from '@/components/BusinessCard';
import { ArrowForwardIcon } from '@/assets/icons/CategoryIcons';
import { generateCategories, generateFeaturedBusinesses } from '@/lib/utils';
import { Category, Business } from '@/types';

const Home: React.FC = () => {
  const categories: Category[] = generateCategories();
  const featuredBusinesses: Business[] = generateFeaturedBusinesses();
  
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading">Welcome to Murang'a Marketplace</h1>
            <p className="text-lg mb-8">Connect with local businesses and service providers in Murang'a County.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/businesses">
                <a className="inline-block bg-white text-primary font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition">
                  Find Businesses
                </a>
              </Link>
              <Link href="/service-request">
                <a className="inline-block bg-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-secondary-light transition">
                  Request a Service
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* Service Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center font-heading">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/businesses">
              <a className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition">
                View All Categories
                <ArrowForwardIcon className="ml-1" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center font-heading">Featured Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/businesses">
              <a className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition">
                View All Businesses
                <ArrowForwardIcon className="ml-1" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Join Marketplace CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Grow Your Business in Murang'a</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">Join our marketplace today and connect with customers looking for your products and services.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register-business">
              <a className="inline-block bg-white text-primary font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition">
                Register Your Business
              </a>
            </Link>
            <a href="#pricing" className="inline-block bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition">
              View Pricing Plans
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
