
import React, { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FilterPanel = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const quickFilters = [
    'Today', 'This Week', 'This Month', 'This Quarter', 'This Year'
  ];

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-slate-300">Active Filters:</span>
          {activeFilters.map(filter => (
            <Badge key={filter} variant="secondary" className="bg-yellow-500/20 text-yellow-400">
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-2 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilters([])}
            className="text-slate-400 hover:text-white"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Range
          </label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
            <option>Custom range</option>
          </select>
        </Card>

        {/* Payment Method */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <Filter className="w-4 h-4 inline mr-2" />
            Payment Method
          </label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option>All Methods</option>
            <option>POS Machine</option>
            <option>Credit Card</option>
            <option>Multiple Payment</option>
            <option>Cash</option>
          </select>
        </Card>

        {/* Product Category */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Product Category</label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option>All Categories</option>
            <option>Membership</option>
            <option>Class Packages</option>
            <option>Personal Training</option>
            <option>Merchandise</option>
          </select>
        </Card>

        {/* Staff Member */}
        <Card className="bg-slate-800/50 border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Sold By</label>
          <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option>All Staff</option>
            <option>Akshay Rane</option>
            <option>Priya Sharma</option>
            <option>Rohit Patel</option>
            <option>Sneha Gupta</option>
          </select>
        </Card>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Quick Filters</label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              onClick={() => addFilter(filter)}
              className="border-slate-600 text-slate-300 hover:border-yellow-400 hover:text-yellow-400"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Revenue Range Slider */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <label className="block text-sm font-medium text-slate-300 mb-3">Revenue Range (₹)</label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100000"
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>₹0</span>
            <span>₹1L+</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FilterPanel;
