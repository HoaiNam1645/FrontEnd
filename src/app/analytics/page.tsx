"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { FaCalendarAlt, FaChartBar, FaBoxOpen } from "react-icons/fa";
import AdminRoute from "@/components/protected-route/AdminRoute";
import "../admin/admin.css";
import "./analytics.css";

// Dynamic import for ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyStats {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalOrders: number;
}

interface TopProduct {
  productId: string;
  name: string;
  image_url: string;
  totalQuantitySold: number;
}

interface StatisticsData {
  monthlyStats: MonthlyStats[];
  topProducts: TopProduct[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

function AnalyticsPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  // Initialize with current month's start and end dates
  useEffect(() => {
    const now = new Date();
    // Set start date to January 1, 2025
    const firstDay = new Date(2025, 0, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  // Fetch statistics whenever date range changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchStatistics();
    }
  }, [startDate, endDate]);

  // Calculate totals whenever statistics change
  useEffect(() => {
    if (statistics && statistics.monthlyStats.length > 0) {
      const revenueSum = statistics.monthlyStats.reduce((sum, stat) => sum + stat.totalRevenue, 0);
      const ordersSum = statistics.monthlyStats.reduce((sum, stat) => sum + stat.totalOrders, 0);
      
      setTotalRevenue(revenueSum);
      setTotalOrders(ordersSum);
    } else {
      setTotalRevenue(0);
      setTotalOrders(0);
    }
  }, [statistics]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("login_token");
      const response = await axios.post(
        "http://localhost:5001/api/orders/getSaleStatistics",
        {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate + "T23:59:59").toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setStatistics(response.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const getChartOptions = () => {
    if (!statistics || !statistics.monthlyStats.length) return {};

    // Sort monthly stats by year and month
    const sortedStats = [...statistics.monthlyStats].sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });

    const categories = sortedStats.map(
      stat => `${stat._id.month}/${stat._id.year}`
    );

    const options = {
      chart: {
        type: 'bar',
        height: 500,
        stacked: false,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 4,
        },
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Tháng'
        }
      },
      yaxis: [
        {
          title: {
            text: 'Doanh thu',
          },
          labels: {
            formatter: function(val: number) {
              return formatCurrency(val).replace(/₫/g, '');
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Số đơn hàng'
          }
        }
      ],
      colors: ['#4299e1', '#48bb78'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [0, 0],
        curve: 'smooth'
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      title: {
        text: 'Thống kê doanh thu và đơn hàng',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function(value: number, { seriesIndex }: { seriesIndex: number }) {
            if (seriesIndex === 0) {
              return formatCurrency(value);
            }
            return value + ' đơn hàng';
          }
        }
      }
    };

    return options;
  };

  const getChartSeries = () => {
    if (!statistics || !statistics.monthlyStats.length) return [];

    // Sort monthly stats by year and month
    const sortedStats = [...statistics.monthlyStats].sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });

    return [
      {
        name: 'Doanh thu',
        type: 'column',
        data: sortedStats.map(stat => stat.totalRevenue)
      },
      {
        name: 'Số đơn hàng',
        type: 'column',
        data: sortedStats.map(stat => stat.totalOrders)
      }
    ];
  };

  return (
    <div className="admin-list-container">
      <div className="page-header text-center">
        <h1>Phân Tích Doanh Thu</h1>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h5 className="mb-0 d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Chọn khoảng thời gian
              </h5>
            </div>
            <div className="date-range-container">
              <div className="date-input-wrapper">
                <label htmlFor="startDate" className="date-label">Từ:</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-separator">-</div>
              <div className="date-input-wrapper">
                <label htmlFor="endDate" className="date-label">Đến:</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stats-card">
          <div className="stats-card-title">Tổng doanh thu</div>
          <div className="stats-card-value">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-title">Tổng đơn hàng</div>
          <div className="stats-card-value">{totalOrders}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-title">Trung bình đơn hàng</div>
          <div className="stats-card-value">
            {totalOrders ? formatCurrency(totalRevenue / totalOrders) : formatCurrency(0)}
          </div>
        </div>
      </div>

      {/* Revenue & Orders Chart */}
      <div className="chart-container mb-4">
        <div className="chart-header">
          <h3><FaChartBar className="me-2" /> Biểu đồ doanh thu và đơn hàng</h3>
        </div>
        <div className="chart-body">
          {loading ? (
            <div className="loading-spinner-container">
              <div className="spinner"></div>
            </div>
          ) : statistics && statistics.monthlyStats.length > 0 ? (
            <div id="revenue-orders-chart">
              <ReactApexChart
                options={getChartOptions()}
                series={getChartSeries()}
                type="bar"
                height={500}
              />
            </div>
          ) : (
            <div className="text-center py-5">
              <p>Không có dữ liệu thống kê trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products-card">
        <div className="top-products-header">
          <h3><FaBoxOpen className="me-2" /> Sản phẩm bán chạy</h3>
        </div>
        <div className="top-products-body">
          {loading ? (
            <div className="loading-spinner-container py-3">
              <div className="spinner"></div>
            </div>
          ) : statistics && statistics.topProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Hình ảnh</th>
                    <th style={{ width: '50%' }}>Tên sản phẩm</th>
                    <th style={{ width: '20%' }}>ID sản phẩm</th>
                    <th style={{ width: '20%' }}>Số lượng bán</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.topProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-image"
                        />
                      </td>
                      <td className="product-name">{product.name}</td>
                      <td className="product-id">{product.productId}</td>
                      <td className="product-quantity">{product.totalQuantitySold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3">
              <p>Không có dữ liệu sản phẩm bán chạy trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Bọc component chính bằng AdminRoute để phân quyền
export default function Analytics() {
  return (
    <AdminRoute>
      <AnalyticsPage />
    </AdminRoute>
  );
} 