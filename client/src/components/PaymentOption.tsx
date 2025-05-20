import React from 'react';

interface PaymentOptionProps {
  type: 'mpesa' | 'card' | 'bank';
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  isActive: boolean;
  onClick: () => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ 
  type, 
  title, 
  description, 
  icon, 
  bgColor, 
  isActive, 
  onClick 
}) => {
  return (
    <div 
      className={`${
        isActive ? 'bg-green-50 border border-green-200' : 'border'
      } rounded-lg p-4 cursor-pointer mb-4`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white mr-3`}>
          <span className="material-icons">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-neutral">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
