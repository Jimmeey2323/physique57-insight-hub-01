
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react';

interface ChartsProps {
  data: any[];
  loading: boolean;
}

const Charts = ({ data, loading }: ChartsProps) => {
  const [activeChart, setActiveChart] = useState<'revenue' | 'category' | 'trend' | 'comparison'>('revenue');

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const getRevenueByProduct = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const product = item['Cleaned Product'];
      if (!product) return acc;
      
      if (!acc[product]) {
        acc[product] = { name: product, revenue: 0, transactions: 0 };
      }
      
      acc[product].revenue += item['Payment Value'] || 0;
      acc[product].transactions += 1;
      
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 8);
  };

  const getCategoryDistribution = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const category = item['Cleaned Category'];
      if (!category) return acc;
      
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      
      acc[category].value += item['Payment Value'] || 0;
      acc[category].count += 1;
      
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const getRevenueByStaff = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const staff = item['Sold By'];
      if (!staff) return acc;
      
      if (!acc[staff]) {
        acc[staff] = { name: staff, revenue: 0, sales: 0 };
      }
      
      acc[staff].revenue += item['Payment Value'] || 0;
      acc[staff].sales += 1;
      
      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => b.revenue - a.revenue);
  };

  const getTimeSeriesData = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item['Payment Date']);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthKey, 
          revenue: 0, 
          transactions: 0,
          members: new Set()
        };
      }
      
      acc[monthKey].revenue += item['Payment Value'] || 0;
      acc[monthKey].transactions += 1;
      acc[monthKey].members.add(item['Member ID']);
      
      return acc;
    }, {});

    return Object.values(grouped).map((item: any) => ({
      ...item,
      uniqueMembers: item.members.size
    })).sort((a: any, b: any) => a.month.localeCompare(b.month));
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const chartButtons = [
    { id: 'revenue', label: 'Revenue Analysis', icon: BarChart3 },
    { id: 'category', label: 'Category Distribution', icon: PieChartIcon },
    { id: 'trend', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'comparison', label: 'Staff Comparison', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenueData = getRevenueByProduct();
  const categoryData = getCategoryDistribution();
  const staffData = getRevenueByStaff();
  const timeSeriesData = getTimeSeriesData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">📈 Interactive Analytics</h3>
        <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400">
          Dynamic Charts
        </Badge>
      </div>

      {/* Chart Selection Buttons */}
      <div className="flex flex-wrap gap-2">
        {chartButtons.map((chart) => {
          const IconComponent = chart.icon;
          return (
            <Button
              key={chart.id}
              variant={activeChart === chart.id ? 'default' : 'outline'}
              onClick={() => setActiveChart(chart.id as any)}
              className={`${
                activeChart === chart.id 
                  ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600' 
                  : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {chart.label}
            </Button>
          );
        })}
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-white">
                {activeChart === 'revenue' && '💰 Revenue by Product'}
                {activeChart === 'category' && '🏷️ Category Distribution'}
                {activeChart === 'trend' && '📊 Revenue Trend Over Time'}
                {activeChart === 'comparison' && '👥 Staff Performance Comparison'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'revenue' && (
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-slate-600" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6B7280" 
                        className="dark:stroke-slate-400"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#6B7280" 
                        className="dark:stroke-slate-400"
                        fontSize={12}
                        tickFormatter={formatCurrency}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          color: '#1F2937'
                        }}
                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}

                  {activeChart === 'category' && (
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          color: '#1F2937'
                        }}
                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      />
                    </PieChart>
                  )}

                  {activeChart === 'trend' && (
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-slate-600" />
                      <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-slate-400" fontSize={12} />
                      <YAxis stroke="#6B7280" className="dark:stroke-slate-400" fontSize={12} tickFormatter={formatCurrency} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          color: '#1F2937'
                        }}
                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  )}

                  {activeChart === 'comparison' && (
                    <BarChart data={staffData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-slate-600" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6B7280" 
                        className="dark:stroke-slate-400"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#6B7280" className="dark:stroke-slate-400" fontSize={12} tickFormatter={formatCurrency} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          color: '#1F2937'
                        }}
                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10 border-green-200 dark:border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {formatCurrency(data?.reduce((sum, item) => sum + (item['Payment Value'] || 0), 0) || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 border-blue-200 dark:border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {data?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10 border-purple-200 dark:border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                  <PieChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Transaction</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {formatCurrency((data?.reduce((sum, item) => sum + (item['Payment Value'] || 0), 0) || 0) / (data?.length || 1))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Charts;
