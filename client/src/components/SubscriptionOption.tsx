import React from 'react';

interface SubscriptionOptionProps {
  type: 'monthly' | 'yearly';
  isSelected: boolean;
  onSelect: (type: 'monthly' | 'yearly') => void;
}

const SubscriptionOption: React.FC<SubscriptionOptionProps> = ({ 
  type, 
  isSelected, 
  onSelect 
}) => {
  const handleClick = () => {
    onSelect(type);
  };
  
  return (
    <div 
      className={`border rounded-lg p-4 hover:border-primary cursor-pointer ${isSelected ? 'border-primary' : ''}`}
      onClick={handleClick}
    >
      <input 
        type="radio" 
        id={type} 
        name="subscription" 
        value={type} 
        className="hidden" 
        checked={isSelected}
        onChange={() => {}}
        required 
      />
      <label htmlFor={type} className="cursor-pointer">
        <span className="block font-bold text-lg mb-1 font-heading capitalize">{type}</span>
        <span className="block text-2xl font-bold text-primary mb-1">
          {type === 'monthly' ? 'Ksh 200' : 'Ksh 3,000'}
        </span>
        <span className="block text-sm text-neutral">
          {type === 'monthly' ? 'Per month' : 'Save Ksh 400'}
        </span>
      </label>
    </div>
  );
};

export default SubscriptionOption;
