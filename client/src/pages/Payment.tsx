import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import PaymentOption from '@/components/PaymentOption';
import NotificationToast from '@/components/NotificationToast';
import { addPayment } from '@/lib/storage';
import { ToastProps } from '@/types';
import { validatePhone } from '@/lib/utils';

const Payment: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly'>('monthly');
  const [subscriptionAmount, setSubscriptionAmount] = useState(200);
  const [totalAmount, setTotalAmount] = useState(200);
  const [activePaymentMethod, setActivePaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [toast, setToast] = useState<ToastProps>({
    type: 'success',
    message: '',
    isVisible: false
  });
  
  useEffect(() => {
    // Get subscription info from local storage or use default
    const businesses = JSON.parse(localStorage.getItem('muranga_businesses') || '[]');
    if (businesses.length > 0) {
      const latestBusiness = businesses[businesses.length - 1];
      setSubscriptionType(latestBusiness.subscriptionType || 'monthly');
      setSubscriptionAmount(latestBusiness.subscriptionType === 'yearly' ? 3000 : 200);
      setTotalAmount(latestBusiness.subscriptionType === 'yearly' ? 3000 : 200);
    }
  }, []);
  
  const handlePaymentMethodChange = (method: string) => {
    setActivePaymentMethod(method);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMpesaPhone(e.target.value);
    if (phoneError) setPhoneError('');
  };
  
  const handlePayment = () => {
    // Validate phone for M-Pesa
    if (activePaymentMethod === 'mpesa') {
      if (!mpesaPhone) {
        setPhoneError('Phone number is required');
        return;
      }
      
      if (!validatePhone(mpesaPhone)) {
        setPhoneError('Please enter a valid phone number (e.g., 0712345678)');
        return;
      }
    }
    
    // Simulate payment processing
    setToast({
      type: 'success',
      message: 'Processing payment...',
      isVisible: true
    });
    
    // Add payment to storage
    const payment = {
      businessId: 1, // This would normally come from the registered business
      amount: totalAmount,
      paymentMethod: activePaymentMethod,
      status: 'completed'
    };
    
    setTimeout(() => {
      addPayment(payment);
      
      setToast({
        type: 'success',
        message: 'Payment successful! Your business is now registered.',
        isVisible: true
      });
      
      // Redirect to business dashboard
      setTimeout(() => {
        setLocation('/business-dashboard');
      }, 2000);
    }, 1500);
  };
  
  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-heading text-center">Complete Your Payment</h1>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-bold text-lg mb-2 font-heading">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-neutral">Business Registration</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral">
                <span>{subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'}</span> Subscription
              </span>
              <span>Ksh {subscriptionAmount}</span>
            </div>
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>Ksh {totalAmount}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4 font-heading">Payment Method</h2>
            
            <PaymentOption 
              type="mpesa"
              title="M-Pesa"
              description="Pay using your M-Pesa mobile money"
              icon="phone_android"
              bgColor="bg-green-500"
              isActive={activePaymentMethod === 'mpesa'}
              onClick={() => handlePaymentMethodChange('mpesa')}
            />
            
            <PaymentOption 
              type="card"
              title="Credit/Debit Card"
              description="Pay using Visa, Mastercard or other cards"
              icon="credit_card"
              bgColor="bg-blue-500"
              isActive={activePaymentMethod === 'card'}
              onClick={() => handlePaymentMethodChange('card')}
            />
            
            <PaymentOption 
              type="bank"
              title="Bank Transfer"
              description="Pay directly from your bank account"
              icon="account_balance"
              bgColor="bg-gray-500"
              isActive={activePaymentMethod === 'bank'}
              onClick={() => handlePaymentMethodChange('bank')}
            />
          </div>
          
          {activePaymentMethod === 'mpesa' && (
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="mpesaPhone" className="block text-sm font-medium text-secondary mb-2">
                  M-Pesa Phone Number
                </label>
                <input 
                  type="tel" 
                  id="mpesaPhone" 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    phoneError ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g. 0712345678" 
                  value={mpesaPhone}
                  onChange={handlePhoneChange}
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>
              <button 
                onClick={handlePayment}
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Pay Now
              </button>
            </div>
          )}
          
          {activePaymentMethod === 'card' && (
            <div className="mb-6">
              <p className="text-center text-sm text-neutral mb-4">
                This is a simulation. In a real app, a card payment form would appear here.
              </p>
              <button 
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Pay with Card
              </button>
            </div>
          )}
          
          {activePaymentMethod === 'bank' && (
            <div className="mb-6">
              <p className="text-center text-sm text-neutral mb-4">
                This is a simulation. In a real app, bank transfer details would appear here.
              </p>
              <button 
                onClick={handlePayment}
                className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition"
              >
                Complete Bank Transfer
              </button>
            </div>
          )}
        </div>
      </div>
      
      <NotificationToast 
        toast={toast} 
        onClose={handleToastClose} 
      />
    </div>
  );
};

export default Payment;
