import { Category } from '@/types';

export const categories: Category[] = [
  { id: 'retail', name: 'Retail Shops', icon: 'store' },
  { id: 'restaurant', name: 'Restaurants', icon: 'restaurant' },
  { id: 'farm', name: 'Farm Produce', icon: 'agriculture' },
  { id: 'handyman', name: 'Handyman', icon: 'build' },
  { id: 'other', name: 'Other Services', icon: 'miscellaneous_services' },
];

export const getCategoryName = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Other';
};

export const getCategoryIcon = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.icon : 'category';
};
