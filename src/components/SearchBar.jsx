import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search for services or providers...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', icon: '🔍' },
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'plumber', name: 'Plumber', icon: '🔧' },
    { id: 'ac', name: 'AC Service', icon: '❄️' },
    { id: 'cleaning', name: 'Cleaning', icon: '🏠' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ term: searchTerm, category: selectedCategory });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onSearch({ term: searchTerm, category: categoryId });
  };

  // Instant search as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        onSearch({ term: searchTerm, category: selectedCategory });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, onSearch]);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
          {/* Category Indicator */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <span className="text-lg">{selectedCategoryData?.icon}</span>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-20 pr-32 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 shadow-lg"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>

        {/* Search Suggestions (shown when focused) */}
        {isFocused && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
            <div className="p-4">
              <div className="text-sm text-gray-500 mb-2">Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                {['Emergency plumber', 'AC repair', 'Home cleaning', 'Electric installation'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setIsFocused(false);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== 'all') && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {selectedCategoryData?.icon} {selectedCategoryData?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
