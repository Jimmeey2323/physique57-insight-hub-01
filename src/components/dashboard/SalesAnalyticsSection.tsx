
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SalesData } from '@/types/dashboard';
import { TopBottomSellers } from './TopBottomSellers';
import { YearOverYearTable } from './sales/YearOverYearTable';
import { MonthOverMonthTable } from './sales/MonthOverMonthTable';
import { SalesCharts } from './sales/Charts';
import { DrillDownModal } from './DrillDownModal';

interface SalesAnalyticsSectionProps {
  data: SalesData[] | null;
}

export const SalesAnalyticsSection: React.FC<SalesAnalyticsSectionProps> = ({ data }) => {
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  const handleRowClick = (rowData: any) => {
    console.log('Row clicked:', rowData);
    setDrillDownData(rowData);
    setIsDrillDownOpen(true);
  };

  const salesData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter(item => 
      item && 
      typeof item === 'object' && 
      'paymentValue' in item && 
      'paymentDate' in item
    );
  }, [data]);

  // Group data by different dimensions for analysis
  const soldByData = useMemo(() => {
    const grouped = salesData.reduce((acc, item) => {
      const seller = item.soldBy || 'Unknown Seller';
      if (!acc[seller]) {
        acc[seller] = {
          name: seller,
          totalValue: 0,
          transactions: 0,
          uniqueMembers: new Set(),
          rawData: []
        };
      }
      acc[seller].totalValue += item.paymentValue || 0;
      acc[seller].transactions += 1;
      acc[seller].uniqueMembers.add(item.memberId);
      acc[seller].rawData.push(item);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((item: any) => ({
      ...item,
      uniqueMembers: item.uniqueMembers.size
    }));
  }, [salesData]);

  const paymentMethodData = useMemo(() => {
    const grouped = salesData.reduce((acc, item) => {
      const method = item.paymentMethod || 'Unknown Method';
      if (!acc[method]) {
        acc[method] = {
          name: method,
          totalValue: 0,
          transactions: 0,
          uniqueMembers: new Set(),
          rawData: []
        };
      }
      acc[method].totalValue += item.paymentValue || 0;
      acc[method].transactions += 1;
      acc[method].uniqueMembers.add(item.memberId);
      acc[method].rawData.push(item);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((item: any) => ({
      ...item,
      uniqueMembers: item.uniqueMembers.size
    }));
  }, [salesData]);

  if (!salesData || salesData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sales data available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Sales Performance Charts
                <Badge variant="outline" className="text-blue-600">
                  {salesData.length} transactions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesCharts data={salesData} />
            </CardContent>
          </Card>

          <TopBottomSellers
            data={salesData}
            type="product"
            title="Product Performance"
            onRowClick={handleRowClick}
          />

          <TopBottomSellers
            data={salesData}
            type="category"
            title="Category Performance"
            onRowClick={handleRowClick}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-8">
          <MonthOverMonthTable
            data={salesData}
            onRowClick={handleRowClick}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          <TopBottomSellers
            data={soldByData}
            type="seller"
            title="Sold By Analysis"
            onRowClick={handleRowClick}
          />

          <TopBottomSellers
            data={paymentMethodData}
            type="paymentMethod"
            title="Payment Method Analysis"
            onRowClick={handleRowClick}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-8">
          <YearOverYearTable
            data={salesData}
            onRowClick={handleRowClick}
          />
        </TabsContent>
      </Tabs>

      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        data={drillDownData}
        type="product"
      />
    </div>
  );
};
