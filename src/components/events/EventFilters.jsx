import { useState } from 'react';

function EventFilters({ onFilterChange, onSortChange, categories }) {
  const [category, setCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');

  // Handle filter submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilterChange({
      category,
      startDate: startDate || null,
      endDate: endDate || null
    });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    
    // Parse the sort option and call the parent handler
    const [field, direction] = newSortOption.split('-');
    onSortChange({ field, direction });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setCategory('all');
    setStartDate('');
    setEndDate('');
    setSortOption('date-desc');
    
    // Notify parent components
    onFilterChange({ category: 'all', startDate: null, endDate: null });
    onSortChange({ field: 'date', direction: 'desc' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleFilterSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-payne-gray/40 rounded px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Filters */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-payne-gray/40 rounded px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-payne-gray/40 rounded px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus"
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="w-full border border-payne-gray/40 rounded px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus"
            >
              <option value="date-asc">Upcoming Events First</option>
              <option value="date-desc">Later Events First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 border border-payne-gray/40 rounded text-gunmetal hover:bg-snow transition-colors duration-200"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-asparagus text-snow rounded hover:bg-gold transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EventFilters;