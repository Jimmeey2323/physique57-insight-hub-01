
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopBottomPerformersProps {
  data: any[];
  loading: boolean;
}

const TopBottomPerformers = ({ data, loading }: TopBottomPerformersProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const getTopPerformers = (field: string, limit = 5) => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const key = item[field];
      if (!key) return acc;
      
      if (!acc[key]) {
        acc[key] = {
          name: key,
          revenue: 0,
          transactions: 0,
          units: 0
        };
      }
      
      acc[key].revenue += item['Payment Value'] || 0;
      acc[key].transactions += 1;
      acc[key].units += 1;
      
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, limit);
  };

  const getBottomPerformers = (field: string, limit = 3) => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const key = item[field];
      if (!key) return acc;
      
      if (!acc[key]) {
        acc[key] = {
          name: key,
          revenue: 0,
          transactions: 0,
          units: 0
        };
      }
      
      acc[key].revenue += item['Payment Value'] || 0;
      acc[key].transactions += 1;
      acc[key].units += 1;
      
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a: any, b: any) => a.revenue - b.revenue)
      .slice(0, limit);
  };

  const performanceCategories = [
    { field: 'Cleaned Product', title: 'Products', icon: Target },
    { field: 'Cleaned Category', title: 'Categories', icon: Award },
    { field: 'Customer Name', title: 'Members', icon: TrendingUp },
    { field: 'Sold By', title: 'Staff', icon: TrendingDown }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-800 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-700 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">🏆 Top & Bottom Performers</h3>
        <Badge variant="outline" className="border-yellow-500 text-yellow-400">
          Real-time Rankings
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {performanceCategories.map((category, index) => {
          const IconComponent = category.icon;
          const topPerformers = getTopPerformers(category.field);
          const bottomPerformers = getBottomPerformers(category.field);

          return (
            <motion.div
              key={category.field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <IconComponent className="w-5 h-5 text-yellow-400" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Top Performers */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Top Performers</span>
                    </div>
                    <div className="space-y-2">
                      {topPerformers.map((performer: any, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              i === 0 ? 'bg-yellow-500 text-black' : 
                              i === 1 ? 'bg-gray-400 text-black' : 
                              i === 2 ? 'bg-orange-600 text-white' : 'bg-slate-600 text-white'
                            }`}>
                              {i + 1}
                            </div>
                            <span className="text-white text-sm font-medium truncate">{performer.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-400">
                              {formatCurrency(performer.revenue)}
                            </div>
                            <div className="text-xs text-slate-400">
                              {performer.transactions} transactions
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Performers */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Needs Attention</span>
                    </div>
                    <div className="space-y-2">
                      {bottomPerformers.map((performer: any, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-red-800/30">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-600 flex items-center justify-center text-xs font-bold text-red-400">
                              !
                            </div>
                            <span className="text-white text-sm font-medium truncate">{performer.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-red-400">
                              {formatCurrency(performer.revenue)}
                            </div>
                            <div className="text-xs text-slate-400">
                              {performer.transactions} transactions
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBottomPerformers;
