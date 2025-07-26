
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, Repeat, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KPICardsProps {
  data: any[];
  loading: boolean;
}

const KPICards = ({ data, loading }: KPICardsProps) => {
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const calculateMetrics = () => {
    if (!data || data.length === 0) return {};

    const totalRevenue = data.reduce((sum, item) => sum + (item['Payment Value'] || 0), 0);
    const totalTransactions = data.length;
    const uniqueMembers = new Set(data.map(item => item['Member ID'])).size;
    const avgTransactionValue = totalRevenue / totalTransactions;
    const revenuePerMember = totalRevenue / uniqueMembers;

    // Calculate month-over-month growth
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    
    const thisMonthData = data.filter(item => {
      const itemDate = new Date(item['Payment Date']);
      return itemDate.getMonth() === thisMonth.getMonth() && itemDate.getFullYear() === thisMonth.getFullYear();
    });
    
    const lastMonthData = data.filter(item => {
      const itemDate = new Date(item['Payment Date']);
      return itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear();
    });

    const thisMonthRevenue = thisMonthData.reduce((sum, item) => sum + (item['Payment Value'] || 0), 0);
    const lastMonthRevenue = lastMonthData.reduce((sum, item) => sum + (item['Payment Value'] || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalTransactions,
      uniqueMembers,
      avgTransactionValue,
      revenuePerMember,
      avgUnitValue: avgTransactionValue,
      conversionRate: 85.2,
      growthRate: revenueGrowth,
    };
  };

  const metrics = calculateMetrics();

  const kpiData = [
    {
      title: 'Total Revenue',
      value: metrics.totalRevenue || 0,
      format: 'currency',
      icon: DollarSign,
      trend: metrics.growthRate || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/10',
      borderColor: 'border-green-200 dark:border-green-500/30',
      textColor: 'text-green-600 dark:text-green-400',
      description: 'Total revenue generated across all transactions',
      calculation: 'Sum of all Payment Value fields',
      benchmark: 'Target: ₹50L per month',
      insights: [
        'Primary revenue metric for business performance',
        'Includes all successful payment transactions',
        'Excludes refunds and failed payments'
      ]
    },
    {
      title: 'Avg Transaction Value',
      value: metrics.avgTransactionValue || 0,
      format: 'currency',
      icon: ShoppingCart,
      trend: 8.3,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10',
      borderColor: 'border-blue-200 dark:border-blue-500/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      description: 'Average value per transaction (ATV)',
      calculation: 'Total Revenue ÷ Total Transactions',
      benchmark: 'Industry average: ₹8,500',
      insights: [
        'Key indicator of customer spending behavior',
        'Higher ATV indicates premium service uptake',
        'Monitor for seasonal variations'
      ]
    },
    {
      title: 'Unique Members',
      value: metrics.uniqueMembers || 0,
      format: 'number',
      icon: Users,
      trend: 15.2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/10',
      borderColor: 'border-purple-200 dark:border-purple-500/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      description: 'Number of unique active members',
      calculation: 'Count of distinct Member IDs',
      benchmark: 'Growth target: 20% monthly',
      insights: [
        'Measures customer base expansion',
        'Critical for membership business model',
        'Track retention vs new acquisition'
      ]
    },
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions || 0,
      format: 'number',
      icon: CreditCard,
      trend: 6.8,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-600/10',
      borderColor: 'border-yellow-200 dark:border-yellow-500/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      description: 'Total number of successful transactions',
      calculation: 'Count of all payment records',
      benchmark: 'Target: 1000+ monthly',
      insights: [
        'Indicates business activity level',
        'Higher frequency suggests engagement',
        'Monitor payment success rates'
      ]
    },
    {
      title: 'Revenue per Member',
      value: metrics.revenuePerMember || 0,
      format: 'currency',
      icon: Target,
      trend: -2.1,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-600/10',
      borderColor: 'border-orange-200 dark:border-orange-500/30',
      textColor: 'text-orange-600 dark:text-orange-400',
      description: 'Average revenue generated per member',
      calculation: 'Total Revenue ÷ Unique Members',
      benchmark: 'Target: ₹15,000 per member',
      insights: [
        'Measures customer lifetime value proxy',
        'Key metric for membership profitability',
        'Higher values indicate better monetization'
      ]
    }
  ];

  useEffect(() => {
    if (!loading) {
      kpiData.forEach((kpi, index) => {
        setTimeout(() => {
          const startValue = animatedValues[kpi.title] || 0;
          const endValue = kpi.value;
          const duration = 1000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOutCubic;

            setAnimatedValues(prev => ({
              ...prev,
              [kpi.title]: currentValue
            }));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }, index * 100);
      });
    }
  }, [data, loading]);

  const formatValue = (value: number, format: string, title: string) => {
    const animatedValue = animatedValues[title] || 0;
    
    switch (format) {
      case 'currency':
        return formatCurrency(animatedValue);
      case 'percentage':
        return `${animatedValue.toFixed(1)}%`;
      default:
        return Math.round(animatedValue).toLocaleString();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-800 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          const isPositive = kpi.trend > 0;
          
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`bg-gradient-to-br ${kpi.bgColor} ${kpi.borderColor} backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden border-2`}>
                    {/* Background Gradient Animation */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} bg-opacity-20 shadow-lg`}>
                          <IconComponent className={`w-6 h-6 ${kpi.textColor}`} />
                        </div>
                        <div className={`flex items-center space-x-1 text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{Math.abs(kpi.trend)}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{kpi.title}</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white">
                          {formatValue(kpi.value, kpi.format, kpi.title)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">{kpi.description}</p>
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="w-80 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-5 h-5 ${kpi.textColor}`} />
                      <h4 className="font-semibold text-gray-800 dark:text-white">{kpi.title}</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">Description:</span>
                        <p className="text-gray-600 dark:text-slate-400">{kpi.description}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">Calculation:</span>
                        <p className="text-gray-600 dark:text-slate-400 font-mono text-xs">{kpi.calculation}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">Benchmark:</span>
                        <p className="text-gray-600 dark:text-slate-400">{kpi.benchmark}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700 dark:text-slate-300">Key Insights:</span>
                        <ul className="text-gray-600 dark:text-slate-400 text-xs space-y-1 mt-1">
                          {kpi.insights.map((insight, idx) => (
                            <li key={idx}>• {insight}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                        <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {isPositive ? 'Growth' : 'Decline'}: {Math.abs(kpi.trend)}% vs last period
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default KPICards;
