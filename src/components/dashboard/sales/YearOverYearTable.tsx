import React, { useMemo, useState } from 'react';
import { SalesData, YearOnYearMetricType } from '@/types/dashboard';
import { YearOnYearMetricTabs } from '../YearOnYearMetricTabs';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface YearOverYearTableProps {
  data: SalesData[];
  onRowClick: (row: any) => void;
  selectedMetric?: YearOnYearMetricType;
}

export const YearOverYearTable: React.FC<YearOverYearTableProps> = ({
  data,
  onRowClick,
  selectedMetric: initialMetric = 'revenue'
}) => {
  const [selectedMetric, setSelectedMetric] = useState<YearOnYearMetricType>(initialMetric);

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    const yyyymmdd = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (yyyymmdd) {
      const [, year, month, day] = yyyymmdd;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    return null;
  };

  const getMetricValue = (items: SalesData[], metric: YearOnYearMetricType) => {
    if (!items.length) return 0;
    const totalRevenue = items.reduce((sum, item) => sum + (item.paymentValue || 0), 0);
    const totalTransactions = items.length;
    const uniqueMembers = new Set(items.map(item => item.memberId)).size;
    const totalUnits = items.length;
    
    switch (metric) {
      case 'revenue':
        return totalRevenue;
      case 'transactions':
        return totalTransactions;
      case 'members':
        return uniqueMembers;
      case 'atv':
        return totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      case 'auv':
        return totalUnits > 0 ? totalRevenue / totalUnits : 0;
      case 'asv':
        return uniqueMembers > 0 ? totalRevenue / uniqueMembers : 0;
      case 'upt':
        return totalTransactions > 0 ? totalUnits / totalTransactions : 0;
      case 'vat':
        return items.reduce((sum, item) => sum + (item.paymentVAT || 0), 0);
      default:
        return 0;
    }
  };

  const formatMetricValue = (value: number, metric: YearOnYearMetricType) => {
    switch (metric) {
      case 'revenue':
      case 'auv':
      case 'atv':
      case 'asv':
      case 'vat':
        return formatCurrency(value);
      case 'transactions':
      case 'members':
        return formatNumber(value);
      case 'upt':
        return value.toFixed(2);
      default:
        return formatNumber(value);
    }
  };

  const processedData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const results = monthNames.map((monthName, index) => {
      const monthNum = index + 1;
      
      // Get 2024 data for this month
      const data2024 = data.filter(item => {
        const itemDate = parseDate(item.paymentDate);
        return itemDate && itemDate.getFullYear() === 2024 && itemDate.getMonth() + 1 === monthNum;
      });
      
      // Get 2025 data for this month
      const data2025 = data.filter(item => {
        const itemDate = parseDate(item.paymentDate);
        return itemDate && itemDate.getFullYear() === 2025 && itemDate.getMonth() + 1 === monthNum;
      });
      
      const value2024 = getMetricValue(data2024, selectedMetric);
      const value2025 = getMetricValue(data2025, selectedMetric);
      
      const growth = value2024 > 0 ? ((value2025 - value2024) / value2024) * 100 : 0;
      
      return {
        month: monthName,
        value2024,
        value2025,
        growth,
        data2024,
        data2025
      };
    });
    
    return results;
  }, [data, selectedMetric]);

  const getGrowthBadge = (growth: number) => {
    if (growth > 10) {
      return <Badge className="bg-green-100 text-green-800 text-xs">+{growth.toFixed(1)}%</Badge>;
    } else if (growth > 0) {
      return <Badge className="bg-blue-100 text-blue-800 text-xs">+{growth.toFixed(1)}%</Badge>;
    } else if (growth > -10) {
      return <Badge className="bg-orange-100 text-orange-800 text-xs">{growth.toFixed(1)}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 text-xs">{growth.toFixed(1)}%</Badge>;
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const total2024 = getMetricValue(
      data.filter(item => {
        const itemDate = parseDate(item.paymentDate);
        return itemDate && itemDate.getFullYear() === 2024;
      }), 
      selectedMetric
    );
    
    const total2025 = getMetricValue(
      data.filter(item => {
        const itemDate = parseDate(item.paymentDate);
        return itemDate && itemDate.getFullYear() === 2025;
      }), 
      selectedMetric
    );
    
    const totalGrowth = total2024 > 0 ? ((total2025 - total2024) / total2024) * 100 : 0;
    
    return {
      total2024,
      total2025,
      totalGrowth
    };
  }, [data, selectedMetric]);

  return (
    <Card className="bg-gradient-to-br from-white via-slate-50/30 to-white border-0 shadow-xl rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Year-on-Year Comparison (2024 vs 2025)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Monthly comparison between 2024 and 2025 performance
              </p>
            </div>
          </div>
          
          <YearOnYearMetricTabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border-t border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold text-sm uppercase tracking-wider sticky top-0 z-20">
              <tr>
                <th className="text-white font-semibold uppercase tracking-wider px-6 py-3 text-left rounded-tl-lg sticky left-0 bg-blue-800 z-30">
                  Month
                </th>
                <th className="text-white font-semibold text-sm uppercase tracking-wider px-4 py-3 text-center border-l border-blue-600">
                  2024
                </th>
                <th className="text-white font-semibold text-sm uppercase tracking-wider px-4 py-3 text-center border-l border-blue-600">
                  2025
                </th>
                <th className="text-white font-semibold text-sm uppercase tracking-wider px-4 py-3 text-center border-l border-blue-600">
                  Growth %
                </th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item, index) => (
                <tr 
                  key={item.month} 
                  className="hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors duration-200" 
                  onClick={() => onRowClick({
                    month: item.month,
                    data2024: item.data2024,
                    data2025: item.data2025,
                    growth: item.growth,
                    rawData: [...item.data2024, ...item.data2025]
                  })}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">#{index + 1}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-800 border-purple-200">
                        {item.month}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900 font-mono border-l border-gray-100">
                    {formatMetricValue(item.value2024, selectedMetric)}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-900 font-mono border-l border-gray-100">
                    {formatMetricValue(item.value2025, selectedMetric)}
                  </td>
                  <td className="px-4 py-4 text-center border-l border-gray-100">
                    <div className="flex items-center justify-center">
                      {getGrowthBadge(item.growth)}
                      {item.growth > 5 ? 
                        <TrendingUp className="w-3 h-3 text-green-500 ml-1" /> : 
                        item.growth < -5 ? 
                        <TrendingDown className="w-3 h-3 text-red-500 ml-1" /> : 
                        null
                      }
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200 font-bold">
                <td className="px-6 py-4 text-sm font-bold text-blue-900 sticky left-0 bg-blue-100 border-r border-blue-200">
                  TOTAL
                </td>
                <td className="px-4 py-4 text-center text-sm text-blue-900 font-mono font-bold border-l border-blue-200">
                  {formatMetricValue(totals.total2024, selectedMetric)}
                </td>
                <td className="px-4 py-4 text-center text-sm text-blue-900 font-mono font-bold border-l border-blue-200">
                  {formatMetricValue(totals.total2025, selectedMetric)}
                </td>
                <td className="px-4 py-4 text-center border-l border-blue-200">
                  {getGrowthBadge(totals.totalGrowth)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};