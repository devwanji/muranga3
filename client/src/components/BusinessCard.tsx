import React from 'react';
import { Link } from 'wouter';
import { LocationOnIcon } from '../assets/icons/CategoryIcons';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  // Map category to images
  const categoryImages: Record<string, string> = {
    retail: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    restaurant: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    farm: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    handyman: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    other: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
  };

  // Format category name
  const getCategoryName = (category: string) => {
    switch(category) {
      case 'retail': return 'Retail';
      case 'restaurant': return 'Restaurant';
      case 'farm': return 'Farm Produce';
      case 'handyman': return 'Handyman';
      default: return 'Other';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
      <img 
        src={categoryImages[business.category] || categoryImages.other} 
        alt={business.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <span className="inline-block bg-primary-light text-white text-xs font-semibold rounded-full px-3 py-1 mb-2">
          {getCategoryName(business.category)}
        </span>
        <h3 className="text-xl font-bold mb-2 font-heading">{business.name}</h3>
        <p className="text-neutral mb-4">{business.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral flex items-center">
            <LocationOnIcon className="text-sm mr-1" />
            {business.location}
          </span>
          <Link href={`/business/${business.id}`}>
            <a className="text-primary font-semibold hover:text-primary-dark">View Details</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
