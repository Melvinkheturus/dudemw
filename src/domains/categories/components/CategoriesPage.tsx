'use client';

import { CategoryGrid } from './CategoryGrid';

export function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-gray-600">
          Discover our wide range of products organized by category
        </p>
      </div>
      
      <CategoryGrid />
    </div>
  );
}
