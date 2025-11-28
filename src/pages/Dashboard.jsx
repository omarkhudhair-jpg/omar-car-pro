import { useState, useEffect } from 'react';
import {
    FiDollarSign,
    FiDroplet,
    FiTool,
    FiTrendingUp,
    FiAlertCircle,
    FiCalendar
} from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { t, language } = useLanguage();

    const [stats, setStats] = useState({
        totalExpenses: 0,
        monthlyExpenses: 0,
        fuelConsumption: 0,
        upcomingMaintenance: 0
    });

    const [monthlyData, setMonthlyData] = useState({
        labels: [],
        datasets: []
    });

    const [expenseBreakdown, setExpenseBreakdown] = useState({
        labels: [],
        datasets: []
    });

    const [fuelEfficiencyData, setFuelEfficiencyData] = useState({
        labels: [],
        datasets: []
    });

    const [upcomingItems, setUpcomingItems] = useState([]);

    useEffect(() => {
        // Load data from localStorage
        const fuelEntries = JSON.parse(localStorage.getItem('fuelEntries') || '[]');
        const maintenanceEntries = JSON.parse(localStorage.getItem('maintenanceEntries') || '[]');
        const expenseEntries = JSON.parse(localStorage.getItem('expenseEntries') || '[]');
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');

        // --- Calculate Stats ---

        // 1. Total Expenses
        const totalFuelCost = fuelEntries.reduce((sum, e) => sum + (e.totalCost || 0), 0);
        const totalMaintenanceCost = maintenanceEntries.reduce((sum, e) => sum + (e.cost || 0), 0);
        const totalOtherExpenses = expenseEntries.reduce((sum, e) => sum + (e.cost || 0), 0);
        const totalExpenses = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

        // 2. Monthly Expenses (Current Month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const getMonthlySum = (entries, dateField = 'date', costField = 'cost') => {
            return entries.filter(e => {
                const d = new Date(e[dateField]);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            }).reduce((sum, e) => sum + (e[costField] || 0), 0);
        };

        const monthlyFuel = getMonthlySum(fuelEntries, 'date', 'totalCost');
        const monthlyMaintenance = getMonthlySum(maintenanceEntries);
        const monthlyOther = getMonthlySum(expenseEntries);
        const monthlyExpenses = monthlyFuel + monthlyMaintenance + monthlyOther;

        // 3. Fuel Consumption (Average km/l)
        let fuelConsumption = 0;
        let efficiencyHistory = [];

        if (fuelEntries.length > 1) {
            const sortedFuel = [...fuelEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

            let totalDist = 0;
            let totalLiters = 0;

            // Prepare data for efficiency chart (last 5 fills)
            const recentFills = [];

            for (let i = 1; i < sortedFuel.length; i++) {
                const current = sortedFuel[i];
                const prev = sortedFuel[i - 1];
                const dist = current.odometer - prev.odometer;

                if (dist > 0 && current.liters > 0) {
                    totalDist += dist;
                    totalLiters += current.liters;

                    const eff = dist / current.liters;
                    recentFills.push({
                        date: new Date(current.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
                        efficiency: eff
                    });
                }
            }

            if (totalLiters > 0) {
                fuelConsumption = (totalDist / totalLiters).toFixed(1);
            }

            efficiencyHistory = recentFills.slice(-5); // Last 5 entries
        }

        // 4. Upcoming Maintenance
        const defaultVehicle = vehicles.find(v => v.isDefault) || vehicles[0];
        const currentOdometer = defaultVehicle ? parseInt(defaultVehicle.odometer) : 0;

        // Find latest entry for each service type
        const latestServices = {};
        maintenanceEntries.forEach(e => {
            if (!latestServices[e.serviceType] || new Date(e.date) > new Date(latestServices[e.serviceType].date)) {
                latestServices[e.serviceType] = e;
            }
        });

        const upcoming = [];
        Object.values(latestServices).forEach(e => {
            let isDue = false;
            let dueText = '';
            let status = t('scheduled');
            let priority = 0; // Higher is more urgent

            if (e.nextDueOdometer) {
                const distLeft = e.nextDueOdometer - currentOdometer;
                if (distLeft < 0) {
                    isDue = true;
                    status = t('overdue');
                    dueText = `${t('overdueBy')} ${Math.abs(distLeft)} ${t('km')}`;
                    priority = 2;
                } else if (distLeft < 1000) {
                    isDue = true;
                    status = t('soon');
                    dueText = `${t('dueIn')} ${distLeft} ${t('km')}`;
                    priority = 1;
                }
            }

            if (e.nextDueDate) {
                const daysLeft = Math.ceil((new Date(e.nextDueDate) - now) / (1000 * 60 * 60 * 24));
                if (daysLeft < 0) {
                    isDue = true;
                    status = t('overdue');
                    dueText = `${t('overdueBy')} ${Math.abs(daysLeft)} ${t('days')}`;
                    priority = 2;
                } else if (daysLeft < 30) {
                    isDue = true;
                    status = t('soon');
                    dueText = `${t('dueIn')} ${daysLeft} ${t('days')}`;
                    priority = Math.max(priority, 1);
                }
            }

            if (isDue) {
                upcoming.push({
                    id: e.id,
                    title: e.serviceType,
                    dueText,
                    status,
                    priority
                });
            }
        });

        // Sort upcoming by priority
        upcoming.sort((a, b) => b.priority - a.priority);

        setStats({
            totalExpenses,
            monthlyExpenses,
            fuelConsumption,
            upcomingMaintenance: upcoming.length
        });
        setUpcomingItems(upcoming);

        // --- Prepare Chart Data ---

        // 1. Monthly Expenses Trend (Last 6 months)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                month: d.getMonth(),
                year: d.getFullYear(),
                label: d.toLocaleString(language === 'ar' ? 'ar-EG' : 'default', { month: 'short' })
            });
        }

        const monthlyTrendData = last6Months.map(m => {
            const fuel = fuelEntries.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === m.month && d.getFullYear() === m.year;
            }).reduce((sum, e) => sum + (e.totalCost || 0), 0);

            const maint = maintenanceEntries.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === m.month && d.getFullYear() === m.year;
            }).reduce((sum, e) => sum + (e.cost || 0), 0);

            const other = expenseEntries.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === m.month && d.getFullYear() === m.year;
            }).reduce((sum, e) => sum + (e.cost || 0), 0);

            return fuel + maint + other;
        });

        setMonthlyData({
            labels: last6Months.map(m => m.label),
            datasets: [
                {
                    label: t('monthlyExpenses'),
                    data: monthlyTrendData,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        });

        // 2. Expense Breakdown
        setExpenseBreakdown({
            labels: [t('fuel'), t('maintenance'), t('expenses')],
            datasets: [
                {
                    data: [totalFuelCost, totalMaintenanceCost, totalOtherExpenses],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                    ],
                    borderWidth: 2,
                },
            ],
        });

        // 3. Fuel Efficiency
        setFuelEfficiencyData({
            labels: efficiencyHistory.map(e => e.date),
            datasets: [
                {
                    label: `${t('fuelEfficiency')} (km/l)`,
                    data: efficiencyHistory.map(e => e.efficiency),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2,
                },
            ],
        });

    }, [language, t]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(51, 65, 85, 0.3)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: 'Inter',
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(51, 65, 85, 0.3)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: 'Inter',
                        size: 11,
                    },
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 12,
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
            },
        },
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1>{t('dashboard')}</h1>
                <p className="text-muted">{t('appTitle')} - {t('welcome')}</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <FiDollarSign size={24} color="#3b82f6" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('totalExpenses')}</p>
                        <h2 className="stat-value">${stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                        <p className="stat-change">
                            {t('lifetimeTotal')}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <FiDroplet size={24} color="#10b981" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('avgEfficiency')}</p>
                        <h2 className="stat-value">{stats.fuelConsumption} km/l</h2>
                        <p className="stat-change">
                            {t('basedOnRecent')}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <FiCalendar size={24} color="#f59e0b" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('thisMonth')}</p>
                        <h2 className="stat-value">${stats.monthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
                        <p className="stat-change">
                            {t('currentMonthSpending')}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <FiAlertCircle size={24} color="#ef4444" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('maintenanceDue')}</p>
                        <h2 className="stat-value">{stats.upcomingMaintenance}</h2>
                        <p className="stat-change">{t('itemsNeedAttention')}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">{t('monthlyExpensesTrend')}</h3>
                    </div>
                    <div className="chart-container">
                        <Line data={monthlyData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">{t('expenseBreakdown')}</h3>
                    </div>
                    <div className="chart-container">
                        <Doughnut data={expenseBreakdown} options={doughnutOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="card-header">
                        <h3 className="card-title">{t('fuelEfficiencyHistory')}</h3>
                    </div>
                    <div className="chart-container">
                        <Bar data={fuelEfficiencyData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Upcoming Maintenance */}
            <div className="card maintenance-card">
                <div className="card-header">
                    <h3 className="card-title">{t('upcomingMaintenance')}</h3>
                </div>
                <div className="maintenance-list">
                    {upcomingItems.length === 0 ? (
                        <div className="empty-state-small">
                            <p className="text-muted">{t('noUpcomingMaintenance')}</p>
                        </div>
                    ) : (
                        upcomingItems.map(item => (
                            <div key={item.id} className="maintenance-item">
                                <div className="maintenance-icon">
                                    <FiTool size={20} color={item.status === t('overdue') ? '#ef4444' : '#f59e0b'} />
                                </div>
                                <div className="maintenance-content">
                                    <h4>{item.title}</h4>
                                    <p className="text-muted">{item.dueText}</p>
                                </div>
                                <span className={`badge badge-${item.status === t('overdue') ? 'danger' : 'warning'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
