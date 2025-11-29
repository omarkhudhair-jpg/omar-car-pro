import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiDroplet, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Fuel.css';

const Fuel = () => {
    const { t, language, formatCurrency, formatDate } = useLanguage();
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        liters: '',
        pricePerLiter: '',
        totalCost: '',
        fullTank: true,
        station: ''
    });

    // Load data from localStorage on mount
    useEffect(() => {
        const savedEntries = localStorage.getItem('fuelEntries');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }
    }, []);

    // Save data to localStorage whenever entries change
    useEffect(() => {
        localStorage.setItem('fuelEntries', JSON.stringify(entries));
    }, [entries]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };

        // Auto-calculate total cost if liters and price are present
        if ((name === 'liters' || name === 'pricePerLiter') && value !== '') {
            const liters = name === 'liters' ? parseFloat(value) : parseFloat(formData.liters);
            const price = name === 'pricePerLiter' ? parseFloat(value) : parseFloat(formData.pricePerLiter);

            if (!isNaN(liters) && !isNaN(price)) {
                newFormData.totalCost = (liters * price).toFixed(2);
            }
        }

        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newEntry = {
            id: Date.now(),
            ...formData,
            liters: parseFloat(formData.liters),
            pricePerLiter: parseFloat(formData.pricePerLiter),
            totalCost: parseFloat(formData.totalCost),
            odometer: parseFloat(formData.odometer)
        };

        setEntries([newEntry, ...entries]);
        setShowForm(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            odometer: '',
            liters: '',
            pricePerLiter: '',
            totalCost: '',
            fullTank: true,
            station: ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirmDelete'))) {
            setEntries(entries.filter(entry => entry.id !== id));
        }
    };

    // Calculate Stats
    const totalCost = entries.reduce((sum, entry) => sum + entry.totalCost, 0);
    const totalLiters = entries.reduce((sum, entry) => sum + entry.liters, 0);
    const avgPrice = totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : 0;

    return (
        <div className="fuel-page fade-in">
            <div className="fuel-header">
                <div>
                    <h1>{t('fuelTracking')}</h1>
                    <p className="text-muted">{t('fuelDesc')}</p>
                </div>
                <button
                    className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    <FiPlus /> {showForm ? t('cancel') : t('addFuel')}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="fuel-summary">
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <FiDollarSign />
                    </div>
                    <div className="summary-content">
                        <h3>{t('totalCost')}</h3>
                        <p>{formatCurrency(totalCost)}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <FiDroplet />
                    </div>
                    <div className="summary-content">
                        <h3>{t('totalVolume')}</h3>
                        <p>{totalLiters.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <FiTrendingUp />
                    </div>
                    <div className="summary-content">
                        <h3>{t('avgPrice')}</h3>
                        <p>{formatCurrency(avgPrice)} / L</p>
                    </div>
                </div>
            </div>

            {/* Add Entry Form */}
            {showForm && (
                <div className="fuel-form-container">
                    <form onSubmit={handleSubmit} className="fuel-form">
                        <div className="form-group">
                            <label>{t('date')}</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('odometer')}</label>
                            <input
                                type="number"
                                name="odometer"
                                placeholder="e.g. 15000"
                                value={formData.odometer}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('liters')}</label>
                            <input
                                type="number"
                                name="liters"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.liters}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('pricePerLiter')}</label>
                            <input
                                type="number"
                                name="pricePerLiter"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.pricePerLiter}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('totalCost')}</label>
                            <input
                                type="number"
                                name="totalCost"
                                placeholder="0.00"
                                step="0.01"
                                value={formData.totalCost}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('stationName')}</label>
                            <input
                                type="text"
                                name="station"
                                placeholder="e.g. Shell, BP"
                                value={formData.station}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group full-width checkbox-group">
                            <input
                                type="checkbox"
                                id="fullTank"
                                name="fullTank"
                                checked={formData.fullTank}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="fullTank">{t('fullTank')}</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>{t('cancel')}</button>
                            <button type="submit" className="btn btn-primary">{t('saveEntry')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Entries List */}
            <div className="fuel-history">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('noFuelEntries')}</p>
                    </div>
                ) : (
                    entries.map(entry => {
                        return (
                            <div key={entry.id} className="history-item">
                                <div className="history-date">
                                    <span className="date-day">{formatDate(entry.date)}</span>
                                </div>
                                <div className="history-details">
                                    <span className="history-station">{entry.station || t('unknownStation')}</span>
                                    <div className="history-meta">
                                        <span>{entry.odometer.toLocaleString()} km</span>
                                        <span>•</span>
                                        <span>{entry.fullTank ? t('fullTank') : t('partial')}</span>
                                    </div>
                                </div>
                                <div className="history-stats">
                                    <div className="stat-group">
                                        <label>{t('volume')}</label>
                                        <span>{entry.liters} L</span>
                                    </div>
                                    <div className="stat-group">
                                        <label>{t('price')}</label>
                                        <span>{formatCurrency(entry.pricePerLiter)}/L</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span className="history-cost">{formatCurrency(entry.totalCost)}</span>
                                    <button
                                        className="btn btn-icon btn-ghost text-danger"
                                        onClick={() => handleDelete(entry.id)}
                                        title={t('delete')}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Fuel;
