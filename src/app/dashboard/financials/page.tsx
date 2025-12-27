"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "../components/revenue-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancialsPage() {
  const [financials, setFinancials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
      setIsLoading(true);
      const response = await fetch("/api/financials");
      const data = await response.json();
      setFinancials(data);
      setIsLoading(false);
    };

    fetchFinancials();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Financials</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Financials</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financials.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={financials.chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.mpesaReceipt}</TableCell>
                    <TableCell>{transaction.order.id}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
