import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiDollarSign, FiTag, FiCalendar, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Expenses.css';

const Expenses = () => {
    const { t, language, formatCurrency, formatDate } = useLanguage();
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: 'expenseParking',
        title: '',
        cost: '',
        notes: ''
    });

    // Load data from localStorage
    useEffect(() => {
        const savedEntries = localStorage.getItem('expenseEntries');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem('expenseEntries', JSON.stringify(entries));
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
            cost: parseFloat(formData.cost) || 0
        };
        setEntries([newEntry, ...entries]);
        setShowForm(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            category: 'expenseParking',
            title: '',
            cost: '',
            notes: ''
        });
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirmDelete'))) {
            setEntries(entries.filter(entry => entry.id !== id));
        }
    };

    // Stats
    const totalExpenses = entries.reduce((sum, entry) => sum + entry.cost, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = entries.filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, entry) => sum + entry.cost, 0);

    const getCategoryIcon = (category) => {
        return <FiTag />;
    };

    return (
        <div className="expenses-page fade-in">
            <div className="expenses-header">
                <div>
                    <h1>{t('expensesTracking')}</h1>
                    <p className="text-muted">{t('expensesDesc')}</p>
                </div>
                <button
                    className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    <FiPlus /> {showForm ? t('cancel') : t('addExpense')}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="expenses-summary">
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <FiDollarSign />
                    </div>
                    <div className="summary-content">
                        <h3>{t('totalExpenses')}</h3>
                        <p>{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <FiCalendar />
                    </div>
                    <div className="summary-content">
                        <h3>{t('thisMonth')}</h3>
                        <p>{formatCurrency(monthlyExpenses)}</p>
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="expenses-form-container">
                    <form onSubmit={handleSubmit} className="expenses-form">
                        <div className="form-group">
                            <label>{t('category')}</label>
                            <select name="category" value={formData.category} onChange={handleInputChange}>
                                <option value="expenseParking">{t('expenseParking')}</option>
                                <option value="expenseInsurance">{t('expenseInsurance')}</option>
                                <option value="expenseFine">{t('expenseFine')}</option>
                                <option value="expenseTax">{t('expenseTax')}</option>
                                <option value="expenseCarWash">{t('expenseCarWash')}</option>
                                <option value="expenseAccessories">{t('expenseAccessories')}</option>
                                <option value="expenseToll">{t('expenseToll')}</option>
                                <option value="expenseOther">{t('expenseOther')}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('date')}</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('titleDescription')}</label>
                            <input type="text" name="title" placeholder="e.g. Monthly Parking" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('cost')}</label>
                            <input type="number" name="cost" placeholder="0.00" value={formData.cost} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group full-width">
                            <label>{t('notes')}</label>
                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>{t('cancel')}</button>
                            <button type="submit" className="btn btn-primary">{t('saveExpense')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* History List */}
            <div className="expenses-history">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <p>{t('noExpensesRecords')}</p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="expense-item">
                            <div className="expense-icon-wrapper">
                                {getCategoryIcon(entry.category)}
                            </div>
                            <div className="expense-details">
                                <h3>{entry.title}</h3>
                                <div className="expense-meta">
                                    <span>{formatDate(entry.date)}</span>
                                    <span>•</span>
                                    <span className="category-tag">{t(entry.category)}</span>
                                </div>
                                {entry.notes && <p className="text-muted text-sm mt-sm">{entry.notes}</p>}
                            </div>
                            <div className="expense-cost">
                                {formatCurrency(entry.cost)}
                            </div>
                            <div className="expense-actions">
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

export default Expenses;
