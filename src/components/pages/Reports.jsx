import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { reportsService } from "@/services/api/reportsService";
import Chart from 'react-apexcharts';

const Reports = () => {
  const { toggleSidebar } = useOutletContext();

const [metrics, setMetrics] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [topPerformers, setTopPerformers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, pipelineData, revenueDataResponse, topPerformersData] = await Promise.all([
        reportsService.getMetrics(),
        reportsService.getDealPipeline(),
        reportsService.getRevenueData(),
        reportsService.getTopPerformers()
      ]);

      setMetrics(metricsData);
      setPipeline(pipelineData);
      setRevenueData(revenueDataResponse);
      setTopPerformers(topPerformersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const pipelineChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    colors: ['#94a3b8', '#60a5fa', '#34d399', '#fbbf24', '#10b981', '#ef4444'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 280
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const revenueChartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: revenueData?.months || []
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value)
      }
    },
    grid: {
      borderColor: '#f1f5f9'
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Reports & Analytics" 
        onMenuToggle={toggleSidebar}
      />
      
      <div className="mt-8 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(metrics?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <ApperIcon name="DollarSign" className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Deals Closed</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.totalDeals || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.conversionRate || 0}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <ApperIcon name="Target" className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Deal Value</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(metrics?.averageDealValue || 0)}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <ApperIcon name="BarChart3" className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deal Pipeline */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <ApperIcon name="PieChart" className="h-5 w-5 mr-2" />
                Deal Pipeline Distribution
              </Card.Title>
            </Card.Header>
            <Card.Content>
              {pipeline && (
                <Chart
                  options={pipelineChartOptions}
                  series={Object.values(pipeline)}
                  type="donut"
                  height={300}
                />
              )}
            </Card.Content>
          </Card>

          {/* Revenue Trends */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <ApperIcon name="TrendingUp" className="h-5 w-5 mr-2" />
                Revenue Trends (6 Months)
              </Card.Title>
            </Card.Header>
            <Card.Content>
              {revenueData && (
                <Chart
                  options={revenueChartOptions}
                  series={[{
                    name: 'Revenue',
                    data: revenueData.revenues
                  }]}
                  type="line"
                  height={300}
                />
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <ApperIcon name="Award" className="h-5 w-5 mr-2" />
              Top Performing Companies
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {topPerformers?.topCompanies?.map((company, index) => (
                <div key={company.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{company.name}</p>
                      <p className="text-sm text-slate-600">{company.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(company.totalValue)}
                    </p>
                    <p className="text-sm text-slate-600">Total Deal Value</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Reports;