import React from 'react';
import { Link } from 'wouter';
import { CategoryIcon } from '../assets/icons/CategoryIcons';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/businesses?category=${category.id}`}>
      <a className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition cursor-pointer">
        <div className="bg-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CategoryIcon name={category.icon} className="text-white text-3xl" />
        </div>
        <h3 className="font-semibold text-lg font-heading">{category.name}</h3>
      </a>
    </Link>
  );
};

export default CategoryCard;
