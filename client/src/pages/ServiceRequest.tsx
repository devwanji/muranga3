import React, { useState } from 'react';
import { useLocation } from 'wouter';
import NotificationToast from '@/components/NotificationToast';
import { ServiceRequestFormData, ToastProps } from '@/types';
import { addServiceRequest } from '@/lib/storage';
import { validateEmail, validatePhone } from '@/lib/utils';

const ServiceRequest: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    serviceName: '',
    serviceCategory: '',
    requestLocation: '',
    requestDescription: '',
    requestContact: '',
    requestEmail: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastProps>({
    type: 'success',
    message: '',
    isVisible: false
  });
  
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
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service title is required';
    }
    
    if (!formData.serviceCategory) {
      newErrors.serviceCategory = 'Please select a category';
    }
    
    if (!formData.requestLocation.trim()) {
      newErrors.requestLocation = 'Location is required';
    }
    
    if (!formData.requestDescription.trim()) {
      newErrors.requestDescription = 'Description is required';
    }
    
    if (!formData.requestContact.trim()) {
      newErrors.requestContact = 'Phone number is required';
    } else if (!validatePhone(formData.requestContact)) {
      newErrors.requestContact = 'Please enter a valid phone number (e.g., 0712345678)';
    }
    
    if (formData.requestEmail && !validateEmail(formData.requestEmail)) {
      newErrors.requestEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Add request to storage
    const serviceRequest = {
      title: formData.serviceName,
      category: formData.serviceCategory,
      location: formData.requestLocation,
      description: formData.requestDescription,
      phone: formData.requestContact,
      email: formData.requestEmail,
      status: 'new'
    };
    
    addServiceRequest(serviceRequest);
    
    // Show success toast
    setToast({
      type: 'success',
      message: 'Service request submitted! Businesses will contact you soon.',
      isVisible: true
    });
    
    // Reset form
    setFormData({
      serviceName: '',
      serviceCategory: '',
      requestLocation: '',
      requestDescription: '',
      requestContact: '',
      requestEmail: ''
    });
    
    // Redirect back to home after a delay
    setTimeout(() => {
      setLocation('/');
    }, 3000);
  };
  
  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-heading">Request a Service</h1>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <label htmlFor="serviceName" className="block text-sm font-medium text-secondary mb-2">
                    Service Title
                  </label>
                  <input 
                    type="text" 
                    id="serviceName" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.serviceName ? 'border-red-500' : ''
                    }`}
                    placeholder="What service do you need?" 
                    value={formData.serviceName}
                    onChange={handleChange}
                  />
                  {errors.serviceName && (
                    <p className="text-red-500 text-xs mt-1">{errors.serviceName}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="serviceCategory" className="block text-sm font-medium text-secondary mb-2">
                    Service Category
                  </label>
                  <select 
                    id="serviceCategory" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.serviceCategory ? 'border-red-500' : ''
                    }`}
                    value={formData.serviceCategory}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="retail">Retail Shop</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="farm">Farm Produce</option>
                    <option value="handyman">Handyman Services</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.serviceCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.serviceCategory}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="requestLocation" className="block text-sm font-medium text-secondary mb-2">
                    Your Location
                  </label>
                  <input 
                    type="text" 
                    id="requestLocation" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.requestLocation ? 'border-red-500' : ''
                    }`}
                    placeholder="Town/Area in Murang'a" 
                    value={formData.requestLocation}
                    onChange={handleChange}
                  />
                  {errors.requestLocation && (
                    <p className="text-red-500 text-xs mt-1">{errors.requestLocation}</p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <label htmlFor="requestDescription" className="block text-sm font-medium text-secondary mb-2">
                    Service Description
                  </label>
                  <textarea 
                    id="requestDescription" 
                    rows={4} 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.requestDescription ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe what you need in detail" 
                    value={formData.requestDescription}
                    onChange={handleChange}
                  />
                  {errors.requestDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.requestDescription}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="requestContact" className="block text-sm font-medium text-secondary mb-2">
                    Your Contact Information
                  </label>
                  <input 
                    type="tel" 
                    id="requestContact" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 ${
                      errors.requestContact ? 'border-red-500' : ''
                    }`}
                    placeholder="Phone number" 
                    value={formData.requestContact}
                    onChange={handleChange}
                  />
                  {errors.requestContact && (
                    <p className="text-red-500 text-xs mt-1">{errors.requestContact}</p>
                  )}
                  
                  <input 
                    type="email" 
                    id="requestEmail" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.requestEmail ? 'border-red-500' : ''
                    }`}
                    placeholder="Email (optional)" 
                    value={formData.requestEmail}
                    onChange={handleChange}
                  />
                  {errors.requestEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.requestEmail}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark transition"
              >
                Submit Service Request
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <NotificationToast 
        toast={toast} 
        onClose={handleToastClose} 
      />
    </div>
  );
};

export default ServiceRequest;
