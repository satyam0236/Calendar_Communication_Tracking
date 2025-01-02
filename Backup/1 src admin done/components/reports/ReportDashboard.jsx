import React, { useMemo } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportDashboard = () => {
  const { companies, communications, getCompanyCommunications } = useAdmin();

  const stats = useMemo(() => {
    const data = {
      totalCompanies: companies.length,
      totalCommunications: communications.length,
      communicationsByMonth: {},
      communicationsByType: {},
      companiesWithMostComms: []
    };

    // Calculate communications by month
    communications.forEach(comm => {
      const date = new Date(comm.date);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
      data.communicationsByMonth[monthKey] = (data.communicationsByMonth[monthKey] || 0) + 1;
      data.communicationsByType[comm.type] = (data.communicationsByType[comm.type] || 0) + 1;
    });

    // Sort months chronologically
    data.communicationsByMonth = Object.fromEntries(
      Object.entries(data.communicationsByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
    );

    // Calculate companies with most communications
    data.companiesWithMostComms = companies
      .map(company => ({
        name: company.name,
        count: getCompanyCommunications(company.id).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return data;
  }, [companies, communications, getCompanyCommunications]);

  const chartData = {
    labels: Object.keys(stats.communicationsByMonth).map(key => {
      const date = new Date(key);
      return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [{
      label: 'Communications per Month',
      data: Object.values(stats.communicationsByMonth),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animations for smoother updates
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 // Force integer steps
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Communication Trends'
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Communication Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Companies</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCompanies}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Communications</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalCommunications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg. Communications/Company</h3>
          <p className="text-3xl font-bold text-purple-600">
            {(stats.totalCommunications / stats.totalCompanies || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Communications Over Time</h3>
          <div className="h-[400px]"> {/* Fixed height container */}
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 Most Active Companies</h3>
          <div className="space-y-4">
            {stats.companiesWithMostComms.map(company => (
              <div key={company.name} className="flex items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{company.name}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(company.count / stats.companiesWithMostComms[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-sm font-medium text-gray-500">{company.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;