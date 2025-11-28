import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiTool, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Maintenance.css';

const Maintenance = () => {
    const { t, language } = useLanguage();
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        serviceType: 'Oil Change',
        odometer: '',
        cost: '',
        provider: '',
        nextDueOdometer: '',
        nextDueDate: '',
        notes: ''
    });

    // Load data from localStorage
    useEffect(() => {
        const savedEntries = localStorage.getItem('maintenanceEntries');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem('maintenanceEntries', JSON.stringify(entries));
    }, [entries]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(),
            ...formData,
            cost: parseFloat(formData.cost) || 0,
            odometer: parseFloat(formData.odometer) || 0
        };
        setEntries([newEntry, ...entries]);
        setShowForm(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            serviceType: 'Oil Change',
            odometer: '',
            cost: '',
            provider: '',
            nextDueOdometer: '',
            nextDueDate: '',
            notes: ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirmDelete'))) {
            setEntries(entries.filter(entry => entry.id !== id));
        }
    };

    // Stats
    const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0);
    const lastService = entries.length > 0 ? new Date(entries[0].date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'default') : 'N/A';
    const upcomingServices = entries.filter(e => e.nextDueDate || e.nextDueOdometer).length;

    const getServiceIcon = (type) => {
        // You could return different icons based on type if you imported more
        return <FiTool />;
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'Oil Change': return 'type-oil';
            case 'Tires': return 'type-tires';
            case 'Repair': return 'type-repair';
            case 'Inspection': return 'type-inspection';
            default: return '';
        }
    };

    return (
        <div className="maintenance-page fade-in">
            <div className="maintenance-header">
                <div>
                    <h1>{t('maintenanceTracking')}</h1>
                    <p className="text-muted">{t('maintenanceDesc')}</p>
                </div>
                <button
                    className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    <FiPlus /> {showForm ? t('cancel') : t('addRecord')}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="maintenance-summary">
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <FiDollarSign />
                    </div>
                    <div className="summary-content">
                        <h3>{t('totalSpent')}</h3>
                        <p>${totalCost.toLocaleString()}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <FiCalendar />
                    </div>
                    <div className="summary-content">
                        <h3>{t('lastService')}</h3>
                        <p>{lastService}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <FiClock />
                    </div>
                    <div className="summary-content">
                        <h3>{t('upcoming')}</h3>
                        <p>{upcomingServices}</p>
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="maintenance-form-container">
                    <form onSubmit={handleSubmit} className="maintenance-form">
                        <div className="form-group">
                            <label>{t('serviceType')}</label>
                            <select name="serviceType" value={formData.serviceType} onChange={handleInputChange}>
                                <option>Oil Change</option>
                                <option>Tires</option>
                                <option>Brakes</option>
                                <option>Battery</option>
                                <option>Inspection</option>
                                <option>Repair</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('date')}</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('odometer')}</label>
                            <input type="number" name="odometer" value={formData.odometer} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('cost')}</label>
                            <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('provider')}</label>
                            <input type="text" name="provider" value={formData.provider} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>{t('nextDueDate')}</label>
                            <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleInputChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>{t('notes')}</label>
                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>{t('cancel')}</button>
                            <button type="submit" className="btn btn-primary">{t('saveRecord')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* History List */}
            <div className="maintenance-history">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('noMaintenanceRecords')}</p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className={`maintenance-item ${getTypeClass(entry.serviceType)}`}>
                            <div className="maintenance-icon-wrapper">
                                {getServiceIcon(entry.serviceType)}
                            </div>
                            <div className="maintenance-details">
                                <h3>{entry.serviceType}</h3>
                                <div className="maintenance-meta">
                                    <span>{new Date(entry.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'default')}</span>
                                    <span>•</span>
                                    <span>{entry.odometer.toLocaleString()} km</span>
                                    {entry.provider && (
                                        <>
                                            <span>•</span>
                                            <span>{entry.provider}</span>
                                        </>
                                    )}
                                </div>
                                {(entry.nextDueDate || entry.nextDueOdometer) && (
                                    <div className="next-due-badge">
                                        <FiClock size={12} />
                                        {t('nextDue')}: {entry.nextDueDate ? new Date(entry.nextDueDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'default') : ''}
                                        {entry.nextDueDate && entry.nextDueOdometer ? ' ' + t('or') + ' ' : ''}
                                        {entry.nextDueOdometer ? `${entry.nextDueOdometer} km` : ''}
                                    </div>
                                )}
                            </div>
                            <div className="maintenance-cost">
                                ${entry.cost.toFixed(2)}
                            </div>
                            <div className="maintenance-actions">
                                <button
                                    className="btn btn-icon btn-ghost text-danger"
                                    onClick={() => handleDelete(entry.id)}
                                    title={t('delete')}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Maintenance;
