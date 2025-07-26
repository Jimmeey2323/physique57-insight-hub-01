
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Download, Filter } from 'lucide-react';

interface DataTablesProps {
  data: any[];
  loading: boolean;
}

const DataTables = ({ data, loading }: DataTablesProps) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const getProductPerformance = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const product = item['Cleaned Product'];
      if (!product) return acc;
      
      if (!acc[product]) {
        acc[product] = {
          product,
          grossRevenue: 0,
          vat: 0,
          netRevenue: 0,
          unitsSold: 0,
          transactions: 0,
          uniqueMembers: new Set(),
          paymentValues: []
        };
      }
      
      const paymentValue = item['Payment Value'] || 0;
      const vat = item['Payment VAT'] || 0;
      
      acc[product].grossRevenue += paymentValue;
      acc[product].vat += vat;
      acc[product].netRevenue += (paymentValue - vat);
      acc[product].unitsSold += 1;
      acc[product].transactions += 1;
      acc[product].uniqueMembers.add(item['Member ID']);
      acc[product].paymentValues.push(paymentValue);
      
      return acc;
    }, {});

    return Object.values(grouped).map((item: any) => ({
      ...item,
      uniqueMembers: item.uniqueMembers.size,
      unitsPerTransaction: (item.unitsSold / item.transactions).toFixed(2),
      atv: (item.grossRevenue / item.transactions).toFixed(0),
      auv: (item.grossRevenue / item.unitsSold).toFixed(0),
      asv: (item.grossRevenue / item.uniqueMembers).toFixed(0)
    }));
  };

  const getCategoryPerformance = () => {
    if (!data || data.length === 0) return [];
    
    const grouped = data.reduce((acc, item) => {
      const category = item['Cleaned Category'];
      if (!category) return acc;
      
      if (!acc[category]) {
        acc[category] = {
          category,
          grossRevenue: 0,
          vat: 0,
          netRevenue: 0,
          unitsSold: 0,
          transactions: 0,
          uniqueMembers: new Set()
        };
      }
      
      const paymentValue = item['Payment Value'] || 0;
      const vat = item['Payment VAT'] || 0;
      
      acc[category].grossRevenue += paymentValue;
      acc[category].vat += vat;
      acc[category].netRevenue += (paymentValue - vat);
      acc[category].unitsSold += 1;
      acc[category].transactions += 1;
      acc[category].uniqueMembers.add(item['Member ID']);
      
      return acc;
    }, {});

    return Object.values(grouped).map((item: any) => ({
      ...item,
      uniqueMembers: item.uniqueMembers.size,
      unitsPerTransaction: (item.unitsSold / item.transactions).toFixed(2),
      atv: (item.grossRevenue / item.transactions).toFixed(0),
      auv: (item.grossRevenue / item.unitsSold).toFixed(0),
      asv: (item.grossRevenue / item.uniqueMembers).toFixed(0)
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-yellow-400" /> : 
      <ChevronDown className="w-4 h-4 text-yellow-400" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-800 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-6 bg-slate-700 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const productData = getProductPerformance();
  const categoryData = getCategoryPerformance();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">📋 Advanced Data Analytics</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Live Tables
          </Badge>
          <Button variant="outline" size="sm" className="border-slate-700 hover:border-yellow-400">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Product Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>📦 Product Performance Analysis</span>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('product')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Product</span>
                        <SortIcon field="product" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-slate-300 cursor-pointer hover:text-white text-center"
                      onClick={() => handleSort('grossRevenue')}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>Gross Revenue</span>
                        <SortIcon field="grossRevenue" />
                      </div>
                    </TableHead>
                    <TableHead className="text-slate-300 text-center">VAT</TableHead>
                    <TableHead className="text-slate-300 text-center">Net Revenue</TableHead>
                    <TableHead className="text-slate-300 text-center">Units Sold</TableHead>
                    <TableHead className="text-slate-300 text-center">Transactions</TableHead>
                    <TableHead className="text-slate-300 text-center">ATV</TableHead>
                    <TableHead className="text-slate-300 text-center">AUV</TableHead>
                    <TableHead className="text-slate-300 text-center">Unique Members</TableHead>
                    <TableHead className="text-slate-300 text-center">ASV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productData.slice(0, 10).map((item: any, index) => (
                    <TableRow 
                      key={item.product} 
                      className="border-slate-700 hover:bg-slate-800/50 h-[25px]"
                    >
                      <TableCell className="text-white font-medium">{item.product}</TableCell>
                      <TableCell className="text-center text-green-400 font-semibold">
                        {formatCurrency(item.grossRevenue)}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">
                        {formatCurrency(item.vat)}
                      </TableCell>
                      <TableCell className="text-center text-green-400">
                        {formatCurrency(item.netRevenue)}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">{item.unitsSold}</TableCell>
                      <TableCell className="text-center text-slate-300">{item.transactions}</TableCell>
                      <TableCell className="text-center text-blue-400">
                        {formatCurrency(parseFloat(item.atv))}
                      </TableCell>
                      <TableCell className="text-center text-purple-400">
                        {formatCurrency(parseFloat(item.auv))}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">{item.uniqueMembers}</TableCell>
                      <TableCell className="text-center text-yellow-400">
                        {formatCurrency(parseFloat(item.asv))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="border-slate-700 bg-slate-800/30 font-semibold">
                    <TableCell className="text-yellow-400">TOTAL</TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(productData.reduce((sum, item) => sum + item.grossRevenue, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(productData.reduce((sum, item) => sum + item.vat, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(productData.reduce((sum, item) => sum + item.netRevenue, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {productData.reduce((sum, item) => sum + item.unitsSold, 0)}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {productData.reduce((sum, item) => sum + item.transactions, 0)}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>🏷️ Category Performance Analysis</span>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300 text-center">Gross Revenue</TableHead>
                    <TableHead className="text-slate-300 text-center">VAT</TableHead>
                    <TableHead className="text-slate-300 text-center">Net Revenue</TableHead>
                    <TableHead className="text-slate-300 text-center">Units Sold</TableHead>
                    <TableHead className="text-slate-300 text-center">Transactions</TableHead>
                    <TableHead className="text-slate-300 text-center">ATV</TableHead>
                    <TableHead className="text-slate-300 text-center">AUV</TableHead>
                    <TableHead className="text-slate-300 text-center">Unique Members</TableHead>
                    <TableHead className="text-slate-300 text-center">ASV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.map((item: any) => (
                    <TableRow 
                      key={item.category} 
                      className="border-slate-700 hover:bg-slate-800/50 h-[25px]"
                    >
                      <TableCell className="text-white font-medium">{item.category}</TableCell>
                      <TableCell className="text-center text-green-400 font-semibold">
                        {formatCurrency(item.grossRevenue)}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">
                        {formatCurrency(item.vat)}
                      </TableCell>
                      <TableCell className="text-center text-green-400">
                        {formatCurrency(item.netRevenue)}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">{item.unitsSold}</TableCell>
                      <TableCell className="text-center text-slate-300">{item.transactions}</TableCell>
                      <TableCell className="text-center text-blue-400">
                        {formatCurrency(parseFloat(item.atv))}
                      </TableCell>
                      <TableCell className="text-center text-purple-400">
                        {formatCurrency(parseFloat(item.auv))}
                      </TableCell>
                      <TableCell className="text-center text-slate-300">{item.uniqueMembers}</TableCell>
                      <TableCell className="text-center text-yellow-400">
                        {formatCurrency(parseFloat(item.asv))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="border-slate-700 bg-slate-800/30 font-semibold">
                    <TableCell className="text-yellow-400">TOTAL</TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(categoryData.reduce((sum, item) => sum + item.grossRevenue, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(categoryData.reduce((sum, item) => sum + item.vat, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {formatCurrency(categoryData.reduce((sum, item) => sum + item.netRevenue, 0))}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {categoryData.reduce((sum, item) => sum + item.unitsSold, 0)}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {categoryData.reduce((sum, item) => sum + item.transactions, 0)}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                    <TableCell className="text-center text-yellow-400">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DataTables;
