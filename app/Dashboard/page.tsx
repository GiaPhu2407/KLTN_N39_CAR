"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Users,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

// Types
interface DashboardData {
  totalDeposits: number;
  pendingDeposits: number;
  totalLichhen: number;
  totalCustomers: number;
  monthlyData: MonthlyData[];
  recentDatCoc: ChiTietDatCoc[];
}

interface MonthlyData {
  NgayDat: string;
  _sum: {
    SotienDat: number;
  };
}

interface ChiTietDatCoc {
  idDatCoc: number;
  NgayDat: string;
  SotienDat: number;
  TrangThaiDat: string;
  khachHang: {
    Hoten: string;
  };
  LichHenLayXe?: {
    DiaDiem: string;
  };
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  isLoading = false,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <h3 className="text-2xl font-bold">{value}</h3>
        )}
      </div>
      <div className="p-3 rounded-full bg-gradient-to-tr from-[#ff0080] to-[#7928ca]">
        {icon}
      </div>
    </div>
    {trendValue && !isLoading && (
      <div className="mt-4 flex items-center">
        <ArrowUpRight className="text-green-500" size={16} />
        <span className="ml-1 text-sm text-green-500">{trendValue}</span>
        <span className="text-gray-500 text-sm ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const SalesDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/overviews');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatMonthlyData = (data: MonthlyData[]) => {
    return data.map(item => ({
      name: new Date(item.NgayDat).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item._sum.SotienDat,
      profit: item._sum.SotienDat * 0.3
    }));
  };

  const preparePieChartData = () => {
    if (!dashboardData) return [];

    const totalRevenue = dashboardData.monthlyData.reduce(
      (sum, item) => sum + item._sum.SotienDat, 0
    );
    const totalProfit = totalRevenue * 0.3;
    const totalCost = totalRevenue - totalProfit;

    return [
      { name: "Lợi Nhuận", value: totalProfit },
      { name: "Chi Phí", value: totalCost }
    ];
  };

  const COLORS = ['#7928ca', '#ff0080'];

  const renderStatsCards = () => (
    <div className="flex h-[500px]">
      <div className="flex flex-col gap-7 pb-7">
        <div className="flex gap-10">
          <div className="w-72">
            <StatsCard
              title="Tổng Đơn Đặt Cọc"
              value={dashboardData?.totalDeposits || 0}
              icon={<DollarSign size={24} className="text-white" />}
              isLoading={isLoading}
            />
          </div>
          <div className="w-72">
            <StatsCard
              title="Đơn Đặt Cọc Chờ Xác Nhận"
              value={dashboardData?.pendingDeposits || 0}
              icon={<DollarSign size={24} className="text-white" />}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-10">
          <div className="w-72">
            <StatsCard
              title="Tổng Khách Hàng"
              value={dashboardData?.totalCustomers || 0}
              icon={<Users size={24} className="text-white" />}
              isLoading={isLoading}
            />
          </div>
          <div className="w-72">
            <StatsCard
              title="Tổng Lịch Hẹn"
              value={dashboardData?.totalLichhen || 0}
              icon={<Users size={24} className="text-white" />}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        {/* Có thể thêm widget khác tại đây nếu muốn */}
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Thống Kê Doanh Thu Trong Tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData ? formatMonthlyData(dashboardData.monthlyData) : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => value.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}
                  width={120}
                />
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh Thu" fill="#8884d8" />
                <Bar dataKey="profit" name="Lợi Nhuận" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tổng Quan Doanh Thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={preparePieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {preparePieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDatCoc = () => (
    <Card>
      <CardHeader>
        <CardTitle>Đơn Đặt Cọc Gần Đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 font-medium">Mã Đơn Đặt Cọc</th>
                <th className="p-4 font-medium">Khách Hàng</th>
                <th className="p-4 font-medium">Tổng Tiền Đặt</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium">Ngày Đặt</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentDatCoc.map((transaction) => (
                <tr key={transaction.idDatCoc} className="border-t">
                  <td className="p-4">#{transaction.idDatCoc}</td>
                  <td className="p-4">{transaction.khachHang.Hoten}</td>
                  <td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.SotienDat)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.TrangThaiDat === "Đã giao"
                          ? "bg-green-100 text-green-800"
                          : transaction.TrangThaiDat === "Chờ xác nhận"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.TrangThaiDat}
                    </span>
                  </td>
                  <td className="p-4">{new Date(transaction.NgayDat).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full ml-20 bg-white">
      <div className="w-full">
        <div className="">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Tổng Quan Dashboard
            </h1>
            <p className="">Chào mừng bạn quay trở lại</p>
          </div>
          {renderStatsCards()}
          {renderCharts()}
          {renderDatCoc()}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
