import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import BusinessCard from '@/components/BusinessCard';
import { Business, Category } from '@/types';
import { getBusinesses } from '@/lib/storage';
import { generateCategories } from '@/lib/utils';

const BusinessListing: React.FC = () => {
  const [location] = useLocation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories: Category[] = generateCategories();
  
  useEffect(() => {
    // Get businesses from storage
    const allBusinesses = getBusinesses();
    setBusinesses(allBusinesses);
    
    // Check for category in URL
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
      filterBusinesses(allBusinesses, category, searchTerm);
    } else {
      setFilteredBusinesses(allBusinesses);
    }
  }, [location]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterBusinesses(businesses, selectedCategory, e.target.value);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    filterBusinesses(businesses, e.target.value, searchTerm);
  };
  
  const filterBusinesses = (
    allBusinesses: Business[], 
    category: string, 
    search: string
  ) => {
    let filtered = allBusinesses;
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(business => business.category === category);
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(business => 
        business.name.toLowerCase().includes(searchLower) ||
        business.description.toLowerCase().includes(searchLower) ||
        business.location.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBusinesses(filtered);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-heading">Explore Businesses</h1>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div className="md:w-1/3">
          <input
            type="text"
            placeholder="Search businesses..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="md:w-1/4">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No businesses found</h2>
          <p className="text-neutral">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default BusinessListing;
