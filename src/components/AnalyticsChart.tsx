import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Download, Upload, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface ChartData {
  uploads: DataPoint[];
  downloads: DataPoint[];
  users: DataPoint[];
  views: DataPoint[];
}

interface AnalyticsChartProps {
  className?: string;
  data?: ChartData;
  isLoading?: boolean;
}

const timeRanges = [
  { value: '1h', label: 'Last Hour', hours: 1 },
  { value: '24h', label: 'Last 24 Hours', hours: 24 },
  { value: '7d', label: 'Last 7 Days', hours: 168 },
  { value: '30d', label: 'Last 30 Days', hours: 720 },
  { value: '90d', label: 'Last 90 Days', hours: 2160 }
];

const chartTypes = [
  { value: 'all', label: 'All Metrics', icon: TrendingUp },
  { value: 'uploads', label: 'Uploads', icon: Upload },
  { value: 'downloads', label: 'Downloads', icon: Download },
  { value: 'users', label: 'Active Users', icon: Users },
  { value: 'views', label: 'Page Views', icon: Eye }
];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ className, data, isLoading = false }) => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate mock data if none provided
  const generateMockData = (): ChartData => {
    const now = new Date();
    const points: DataPoint[] = [];
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      points.push({
        date: date.toISOString(),
        value: Math.floor(Math.random() * 100 + 20),
        label: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    return {
      uploads: points.map(p => ({ ...p, value: Math.floor(p.value * 0.8) })),
      downloads: points.map(p => ({ ...p, value: Math.floor(p.value * 1.2) })),
      users: points.map(p => ({ ...p, value: Math.floor(p.value * 0.6) })),
      views: points.map(p => ({ ...p, value: Math.floor(p.value * 1.5) }))
    };
  };

  const chartData = data || generateMockData();

  const getMetricData = () => {
    if (selectedMetric === 'all') {
      return {
        uploads: chartData.uploads,
        downloads: chartData.downloads,
        users: chartData.users,
        views: chartData.views
      };
    }
    return { [selectedMetric]: chartData[selectedMetric as keyof ChartData] };
  };

  const calculateStats = (data: DataPoint[]) => {
    const values = data.map(d => d.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const current = values[values.length - 1];
    const previous = values[values.length - 2] || 0;
    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
    return { total, avg, max, min, current, change };
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    ctx.clearRect(0, 0, width, height);
    const metricData = getMetricData();
    const allData = Object.values(metricData).flat();
    if (allData.length === 0) return;
    const maxValue = Math.max(...allData.map(d => d.value));
    const minValue = Math.min(...allData.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (allData.length - 1);
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    for (let i = 0; i < allData.length; i += Math.ceil(allData.length / 8)) {
      const x = padding + stepX * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    // Draw data series
    const colors: Record<string, string> = {
      uploads: '#3b82f6',
      downloads: '#10b981',
      users: '#f59e0b',
      views: '#8b5cf6'
    };
    Object.entries(metricData).forEach(([metric, data]) => {
      if (selectedMetric !== 'all' && selectedMetric !== metric) return;
      const color = colors[metric as keyof typeof colors];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      // Draw points
      data.forEach((point, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        // Hover effect
        if (hoveredPoint && hoveredPoint.date === point.date && hoveredPoint.value === point.value) {
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = color;
        }
      });
    });
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(Math.round(value).toString(), padding - 20, y + 4);
    }
    chartData.uploads.forEach((point, index) => {
      if (index % Math.ceil(chartData.uploads.length / 8) === 0) {
        const x = padding + stepX * index;
        const time = new Date(point.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        ctx.fillText(time, x, height - padding + 20);
      }
    });
  };

  useEffect(() => {
    drawChart();
    // eslint-disable-next-line
  }, [chartData, selectedRange, selectedMetric, hoveredPoint]);

  useEffect(() => {
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, []);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const metricData = getMetricData();
    const allData = Object.values(metricData).flat();
    if (allData.length === 0) return;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const stepX = chartWidth / (allData.length - 1);
    const index = Math.round((x - padding) / stepX);
    if (index >= 0 && index < allData.length) {
      setHoveredPoint(allData[index]);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredPoint(null);
  };

  const stats = calculateStats(chartData.uploads);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics</CardTitle>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analytics Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Uploads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.current}
            </div>
            <div className={`text-sm flex items-center gap-1 mt-1 ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(stats.change).toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Downloads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Math.floor(stats.current * 1.2)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +120.5
            </div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Math.floor(stats.current * 0.6)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +80.2
            </div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Page Views</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Math.floor(stats.current * 1.5)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +150.3
            </div>
          </div>
        </div>
        {/* Chart */}
        <div
          ref={containerRef}
          className="relative w-full h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
          />
          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-10"
              style={{
                left: '50%',
                top: 30
              }}
            >
              <div className="font-semibold">{hoveredPoint.label}</div>
              <div>{hoveredPoint.value} {selectedMetric === 'all' ? 'total' : selectedMetric}</div>
            </div>
          )}
        </div>
        {/* Legend */}
        {selectedMetric === 'all' && (
          <div className="flex items-center justify-center gap-6 mt-4">
            {Object.entries({
              uploads: '#3b82f6',
              downloads: '#10b981',
              users: '#f59e0b',
              views: '#8b5cf6'
            }).map(([metric, color]) => (
              <div key={metric} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metric}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 