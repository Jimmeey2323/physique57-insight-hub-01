
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';

interface MonthOverMonthTableProps {
  data: any[];
  loading: boolean;
}

const MonthOverMonthTable = ({ data, loading }: MonthOverMonthTableProps) => {
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
    { id: 'atv', label: 'Average Transaction Value', format: 'currency' },
    { id: 'auv', label: 'Average Unit Value', format: 'currency' }
  ];

  const getMonthOverMonthData = () => {
    if (!data || data.length === 0) return [];

    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item['Payment Date']);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const product = item['Cleaned Product'] || 'Unknown';
      
      if (!acc[product]) {
        acc[product] = {};
      }
      
      if (!acc[product][monthKey]) {
        acc[product][monthKey] = {
          revenue: 0,
          transactions: 0,
          members: new Set(),
          totalValue: 0
        };
      }
      
      acc[product][monthKey].revenue += item['Payment Value'] || 0;
      acc[product][monthKey].transactions += 1;
      acc[product][monthKey].members.add(item['Member ID']);
      acc[product][monthKey].totalValue += item['Payment Value'] || 0;
      
      return acc;
    }, {});

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }

    return Object.keys(monthlyData).map(product => {
      const productData = { product };
      let total = 0;
      
      months.forEach(month => {
        const monthData = monthlyData[product][month];
        if (monthData) {
          switch (selectedMetric) {
            case 'revenue':
              productData[month] = monthData.revenue;
              total += monthData.revenue;
              break;
            case 'transactions':
              productData[month] = monthData.transactions;
              total += monthData.transactions;
              break;
            case 'members':
              productData[month] = monthData.members.size;
              total += monthData.members.size;
              break;
            case 'atv':
              productData[month] = monthData.transactions > 0 ? monthData.revenue / monthData.transactions : 0;
              total += productData[month];
              break;
            case 'auv':
              productData[month] = monthData.transactions > 0 ? monthData.revenue / monthData.transactions : 0;
              total += productData[month];
              break;
          }
        } else {
          productData[month] = 0;
        }
      });
      
      productData.total = total;
      return productData;
    });
  };

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') return formatCurrency(value);
    return value.toLocaleString();
  };

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
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

  const monthOverMonthData = getMonthOverMonthData();
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  const selectedMetricData = metrics.find(m => m.id === selectedMetric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-white">
            <span>📊 Month-over-Month Analysis</span>
            <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">
              Trending Data
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
                    ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600' 
                    : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400'
                }`}
              >
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
                      <span>Product</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]"></div>
                    </div>
                  </TableHead>
                  {months.map((month) => (
                    <TableHead key={month.key} className="text-center text-gray-700 dark:text-slate-300 relative">
                      <div className="relative overflow-hidden">
                        <span>{month.label}</span>
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]" style={{ animationDelay: `${months.indexOf(month) * 0.1}s` }}></div>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center text-gray-700 dark:text-slate-300 relative">
                    <div className="relative overflow-hidden">
                      <span>Total</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-full animate-[slideIn_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthOverMonthData.slice(0, 10).map((item: any, index) => (
                  <TableRow 
                    key={item.product} 
                    className="border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 h-[25px] transition-all duration-200 hover:shadow-md"
                  >
                    <TableCell className="text-gray-800 dark:text-white font-medium">{item.product}</TableCell>
                    {months.map((month, idx) => {
                      const value = item[month.key] || 0;
                      const prevValue = idx > 0 ? item[months[idx - 1].key] || 0 : 0;
                      const growth = idx > 0 ? getGrowthRate(value, prevValue) : 0;
                      
                      return (
                        <TableCell key={month.key} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-gray-800 dark:text-white font-semibold">
                              {formatValue(value, selectedMetricData?.format || 'number')}
                            </span>
                            {idx > 0 && (
                              <div className={`flex items-center text-xs ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {Math.abs(growth).toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center text-blue-600 dark:text-blue-400 font-bold">
                      {formatValue(item.total, selectedMetricData?.format || 'number')}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Totals Row */}
                <TableRow className="border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/30 font-semibold">
                  <TableCell className="text-blue-600 dark:text-yellow-400">TOTAL</TableCell>
                  {months.map((month) => {
                    const total = monthOverMonthData.reduce((sum, item) => sum + (item[month.key] || 0), 0);
                    return (
                      <TableCell key={month.key} className="text-center text-blue-600 dark:text-yellow-400">
                        {formatValue(total, selectedMetricData?.format || 'number')}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center text-blue-600 dark:text-yellow-400">
                    {formatValue(monthOverMonthData.reduce((sum, item) => sum + item.total, 0), selectedMetricData?.format || 'number')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Key Insights:</h4>
            <ul className="text-sm text-gray-600 dark:text-slate-300 space-y-1">
              <li>• Month-over-month analysis shows performance trends across the last 6 months</li>
              <li>• Growth indicators help identify improving or declining products</li>
              <li>• Use metric selector to analyze different performance dimensions</li>
              <li>• Totals row provides aggregate performance across all products</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthOverMonthTable;
