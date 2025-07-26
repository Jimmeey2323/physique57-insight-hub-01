
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface YearOverYearTableProps {
  data: any[];
  loading: boolean;
}

const YearOverYearTable = ({ data, loading }: YearOverYearTableProps) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const metrics = [
    { id: 'revenue', label: 'Revenue', format: 'currency' },
    { id: 'transactions', label: 'Transactions', format: 'number' },
    { id: 'members', label: 'Unique Members', format: 'number' },
    { id: 'atv', label: 'Average Transaction Value', format: 'currency' }
  ];

  const getYearOverYearData = () => {
    if (!data || data.length === 0) return [];

    const yearlyData = data.reduce((acc, item) => {
      const date = new Date(item['Payment Date']);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = new Date(2000, month).toLocaleDateString('en-US', { month: 'long' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }
      
      if (!acc[monthKey][year]) {
        acc[monthKey][year] = {
          revenue: 0,
          transactions: 0,
          members: new Set(),
          totalValue: 0
        };
      }
      
      acc[monthKey][year].revenue += item['Payment Value'] || 0;
      acc[monthKey][year].transactions += 1;
      acc[monthKey][year].members.add(item['Member ID']);
      acc[monthKey][year].totalValue += item['Payment Value'] || 0;
      
      return acc;
    }, {});

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    return months.map(month => {
      const monthData = { month };
      const currentYearData = yearlyData[month]?.[currentYear];
      const previousYearData = yearlyData[month]?.[previousYear];
      
      if (currentYearData) {
        switch (selectedMetric) {
          case 'revenue':
            monthData[`${currentYear}`] = currentYearData.revenue;
            break;
          case 'transactions':
            monthData[`${currentYear}`] = currentYearData.transactions;
            break;
          case 'members':
            monthData[`${currentYear}`] = currentYearData.members.size;
            break;
          case 'atv':
            monthData[`${currentYear}`] = currentYearData.transactions > 0 ? currentYearData.revenue / currentYearData.transactions : 0;
            break;
        }
      } else {
        monthData[`${currentYear}`] = 0;
      }
      
      if (previousYearData) {
        switch (selectedMetric) {
          case 'revenue':
            monthData[`${previousYear}`] = previousYearData.revenue;
            break;
          case 'transactions':
            monthData[`${previousYear}`] = previousYearData.transactions;
            break;
          case 'members':
            monthData[`${previousYear}`] = previousYearData.members.size;
            break;
          case 'atv':
            monthData[`${previousYear}`] = previousYearData.transactions > 0 ? previousYearData.revenue / previousYearData.transactions : 0;
            break;
        }
      } else {
        monthData[`${previousYear}`] = 0;
      }
      
      // Calculate growth rate
      const current = monthData[`${currentYear}`] || 0;
      const previous = monthData[`${previousYear}`] || 0;
      monthData.growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
      
      return monthData;
    });
  };

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') return formatCurrency(value);
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const yearOverYearData = getYearOverYearData();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const selectedMetricData = metrics.find(m => m.id === selectedMetric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-white">
            <span>📅 Year-over-Year Comparison</span>
            <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
              Annual Trends
            </Badge>
          </CardTitle>
          
          {/* Metric Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {metrics.map((metric) => (
              <Button
                key={metric.id}
                variant={selectedMetric === metric.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric(metric.id)}
                className={`${
                  selectedMetric === metric.id 
                    ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600' 
                    : 'border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400'
                }`}
              >
                <Calendar className="w-4 h-4 mr-1" />
                {metric.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-slate-700">
                  <TableHead className="text-gray-700 dark:text-slate-300 relative">
                    <div className="relative overflow-hidden">
                      <span>Month</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]"></div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-gray-700 dark:text-slate-300 relative">
                    <div className="relative overflow-hidden">
                      <span>{previousYear}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-gray-700 dark:text-slate-300 relative">
                    <div className="relative overflow-hidden">
                      <span>{currentYear}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-gray-700 dark:text-slate-300 relative">
                    <div className="relative overflow-hidden">
                      <span>Growth Rate</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearOverYearData.map((item: any, index) => (
                  <TableRow 
                    key={item.month} 
                    className="border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 h-[25px] transition-all duration-200 hover:shadow-md"
                  >
                    <TableCell className="text-gray-800 dark:text-white font-medium">{item.month}</TableCell>
                    <TableCell className="text-center text-gray-600 dark:text-slate-300">
                      {formatValue(item[`${previousYear}`] || 0, selectedMetricData?.format || 'number')}
                    </TableCell>
                    <TableCell className="text-center text-gray-800 dark:text-white font-semibold">
                      {formatValue(item[`${currentYear}`] || 0, selectedMetricData?.format || 'number')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`flex items-center justify-center ${item.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.growth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span className="font-semibold">{Math.abs(item.growth).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Totals Row */}
                <TableRow className="border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/30 font-semibold">
                  <TableCell className="text-blue-600 dark:text-yellow-400">TOTAL</TableCell>
                  <TableCell className="text-center text-blue-600 dark:text-yellow-400">
                    {formatValue(yearOverYearData.reduce((sum, item) => sum + (item[`${previousYear}`] || 0), 0), selectedMetricData?.format || 'number')}
                  </TableCell>
                  <TableCell className="text-center text-blue-600 dark:text-yellow-400">
                    {formatValue(yearOverYearData.reduce((sum, item) => sum + (item[`${currentYear}`] || 0), 0), selectedMetricData?.format || 'number')}
                  </TableCell>
                  <TableCell className="text-center">
                    {(() => {
                      const totalCurrent = yearOverYearData.reduce((sum, item) => sum + (item[`${currentYear}`] || 0), 0);
                      const totalPrevious = yearOverYearData.reduce((sum, item) => sum + (item[`${previousYear}`] || 0), 0);
                      const totalGrowth = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;
                      return (
                        <div className={`flex items-center justify-center ${totalGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {totalGrowth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          <span className="font-semibold">{Math.abs(totalGrowth).toFixed(1)}%</span>
                        </div>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Annual Performance Summary:</h4>
            <ul className="text-sm text-gray-600 dark:text-slate-300 space-y-1">
              <li>• Year-over-year comparison reveals long-term business trends and seasonality patterns</li>
              <li>• Growth rates highlight months with strongest performance improvements</li>
              <li>• Use different metrics to analyze various aspects of business performance</li>
              <li>• Consistent positive growth indicates healthy business expansion</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default YearOverYearTable;
