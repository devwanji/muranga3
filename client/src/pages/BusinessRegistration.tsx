import React, { useState } from 'react';
import { useLocation } from 'wouter';
import SubscriptionOption from '@/components/SubscriptionOption';
import { RegisterBusinessFormData } from '@/types';
import { addBusiness } from '@/lib/storage';
import { useUser } from '@/components/UserContext';
import { validateEmail, validatePhone } from '@/lib/utils';

const BusinessRegistration: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, login } = useUser();
  
  const [formData, setFormData] = useState<RegisterBusinessFormData>({
    businessName: '',
    businessCategory: '',
    phone: '',
    email: '',
    location: '',
    description: '',
    subscription: 'monthly'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  const handleSubscriptionChange = (type: 'monthly' | 'yearly') => {
    setFormData(prev => ({ ...prev, subscription: type }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.businessCategory) {
      newErrors.businessCategory = 'Please select a category';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., 0712345678)';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If not logged in, create a business user
    if (!user || user.userType !== 'business') {
      login('business');
    }
    
    // Add business to storage
    const business = {
      userId: user?.id || 1,
      name: formData.businessName,
      category: formData.businessCategory,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      description: formData.description,
      subscriptionType: formData.subscription,
      status: 'pending'
    };
    
    addBusiness(business);
    
    // Redirect to payment page
    setLocation('/payment');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-heading">Register Your Business</h1>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <label htmlFor="businessName" className="block text-sm font-medium text-secondary mb-2">
                    Business Name
                  </label>
                  <input 
                    type="text" 
                    id="businessName" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.businessName ? 'border-red-500' : ''
                    }`}
                    placeholder="Your business name" 
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="businessCategory" className="block text-sm font-medium text-secondary mb-2">
                    Business Category
                  </label>
                  <select 
                    id="businessCategory" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.businessCategory ? 'border-red-500' : ''
                    }`}
                    value={formData.businessCategory}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="retail">Retail Shop</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="farm">Farm Produce</option>
                    <option value="handyman">Handyman Services</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.businessCategory}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g. 0712345678" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="your@email.com" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-secondary mb-2">
                    Business Location
                  </label>
                  <input 
                    type="text" 
                    id="location" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.location ? 'border-red-500' : ''
                    }`}
                    placeholder="Town/Area in Murang'a" 
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">
                    Business Description
                  </label>
                  <textarea 
                    id="description" 
                    rows={4} 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe your business and services offered" 
                    value={formData.description}
                    onChange={handleChange}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Subscription Plan
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <SubscriptionOption 
                      type="monthly" 
                      isSelected={formData.subscription === 'monthly'} 
                      onSelect={handleSubscriptionChange} 
                    />
                    <SubscriptionOption 
                      type="yearly" 
                      isSelected={formData.subscription === 'yearly'} 
                      onSelect={handleSubscriptionChange} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition"
              >
                Register & Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;
