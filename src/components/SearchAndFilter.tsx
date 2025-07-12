import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, FileText, Image, Video, Music, Archive, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
  className?: string;
}

export interface FilterOptions {
  fileType: string;
  dateRange: string;
  sizeRange: string;
  status: string;
}

export interface SortOption {
  field: 'name' | 'size' | 'date' | 'type';
  direction: 'asc' | 'desc';
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
  totalResults,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    fileType: 'all',
    dateRange: 'all',
    sizeRange: 'all',
    status: 'all'
  });
  const [sort, setSort] = useState<SortOption>({
    field: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field: SortOption['field']) => {
    const newSort: SortOption = {
      field,
      direction: sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    };
    setSort(newSort);
    onSortChange(newSort);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      fileType: 'all',
      dateRange: 'all',
      sizeRange: 'all',
      status: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
              {Object.values(filters).filter(v => v !== 'all').length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* File Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  File Type
                </label>
                <Select value={filters.fileType} onValueChange={(value) => handleFilterChange('fileType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="archive">Archives</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Range
                </label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  File Size
                </label>
                <Select value={filters.sizeRange} onValueChange={(value) => handleFilterChange('sizeRange', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Size</SelectItem>
                    <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
                    <SelectItem value="medium">Medium (1MB - 10MB)</SelectItem>
                    <SelectItem value="large">Large (10MB - 100MB)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (&gt; 100MB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="downloaded">Downloaded</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        {[
          { field: 'name' as const, label: 'Name', icon: FileText },
          { field: 'size' as const, label: 'Size', icon: FileText },
          { field: 'date' as const, label: 'Date', icon: Calendar },
          { field: 'type' as const, label: 'Type', icon: FileText }
        ].map(({ field, label, icon: Icon }) => (
          <Button
            key={field}
            variant={sort.field === field ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange(field)}
            className="flex items-center gap-1"
          >
            <Icon className="w-3 h-3" />
            {label}
            {sort.field === field && (
              sort.direction === 'asc' ? 
                <SortAsc className="w-3 h-3" /> : 
                <SortDesc className="w-3 h-3" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter; 