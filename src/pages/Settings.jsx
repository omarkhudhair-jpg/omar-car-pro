import { useRef } from 'react';
import { FiDownload, FiUpload, FiTrash2, FiGlobe, FiDatabase } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Settings.css';

const Settings = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const data = {
            fuelEntries: JSON.parse(localStorage.getItem('fuelEntries') || '[]'),
            maintenanceEntries: JSON.parse(localStorage.getItem('maintenanceEntries') || '[]'),
            expenseEntries: JSON.parse(localStorage.getItem('expenseEntries') || '[]'),
            vehicles: JSON.parse(localStorage.getItem('vehicles') || '[]'),
            language: localStorage.getItem('language') || 'en'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `omar-car-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (data.fuelEntries) localStorage.setItem('fuelEntries', JSON.stringify(data.fuelEntries));
                if (data.maintenanceEntries) localStorage.setItem('maintenanceEntries', JSON.stringify(data.maintenanceEntries));
                if (data.expenseEntries) localStorage.setItem('expenseEntries', JSON.stringify(data.expenseEntries));
                if (data.vehicles) localStorage.setItem('vehicles', JSON.stringify(data.vehicles));
                if (data.language) toggleLanguage(data.language);

                alert(t('successImport'));
                window.location.reload(); // Reload to reflect changes
            } catch (error) {
                alert(t('errorImport'));
            }
        };
        reader.readAsText(file);
    };

    const handleClearData = () => {
        if (window.confirm(t('confirmDelete'))) {
            localStorage.clear();
            // Preserve language setting
            localStorage.setItem('language', language);
            alert(t('successClear'));
            window.location.reload();
        }
    };

    return (
        <div className="settings-page fade-in">
            <div className="settings-header">
                <h1>{t('settings')}</h1>
                <p className="text-muted">{t('preferences')} & {t('dataManagement')}</p>
            </div>

            {/* Preferences */}
            <div className="settings-section">
                <h2>{t('preferences')}</h2>
                <div className="settings-item">
                    <div className="item-info">
                        <h3>{t('language')}</h3>
                        <p>English / العربية</p>
                    </div>
                    <div className="language-toggle">
                        <button
                            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                            onClick={() => toggleLanguage('en')}
                        >
                            English
                        </button>
                        <button
                            className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
                            onClick={() => toggleLanguage('ar')}
                        >
                            العربية
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="settings-section">
                <h2>{t('dataManagement')}</h2>

                <div className="settings-item">
                    <div className="item-info">
                        <h3>{t('exportData')}</h3>
                        <p>{t('exportDesc')}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <FiDownload /> {t('exportData')}
                    </button>
                </div>

                <div className="settings-item">
                    <div className="item-info">
                        <h3>{t('importData')}</h3>
                        <p>{t('importDesc')}</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="file-input"
                        accept=".json"
                        onChange={handleImport}
                    />
                    <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
                        <FiUpload /> {t('importData')}
                    </button>
                </div>

                <div className="settings-item">
                    <div className="item-info">
                        <h3>{t('clearData')}</h3>
                        <p>{t('clearDesc')}</p>
                    </div>
                    <button className="btn btn-ghost text-danger" onClick={handleClearData}>
                        <FiTrash2 /> {t('clearData')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
