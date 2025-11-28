import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        // Update document direction for Arabic
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const translations = {
        en: {
            dashboard: 'Dashboard',
            fuel: 'Fuel',
            maintenance: 'Maintenance',
            expenses: 'Expenses',
            vehicles: 'Vehicles',
            settings: 'Settings',
            appTitle: 'Omar Car Pro',
            welcome: 'Welcome back',
            totalExpenses: 'Total Expenses',
            fuelEfficiency: 'Fuel Efficiency',
            upcomingMaintenance: 'Upcoming Maintenance',
            exportData: 'Export Data',
            importData: 'Import Data',
            clearData: 'Clear Data',
            language: 'Language',
            darkMode: 'Dark Mode',
            save: 'Save',
            cancel: 'Cancel',
            add: 'Add',
            delete: 'Delete',
            edit: 'Edit',
            confirmDelete: 'Are you sure you want to delete this?',
            dataManagement: 'Data Management',
            preferences: 'Preferences',
            exportDesc: 'Download a backup of your data',
            importDesc: 'Restore data from a backup file',
            clearDesc: 'Delete all data permanently',
            successImport: 'Data imported successfully!',
            errorImport: 'Error importing data. Invalid file.',
            successClear: 'All data cleared.',
            // Dashboard specific
            monthlyExpensesTrend: 'Monthly Expenses Trend',
            expenseBreakdown: 'Expense Breakdown',
            fuelEfficiencyHistory: 'Fuel Efficiency History',
            thisMonth: 'This Month',
            avgEfficiency: 'Avg Efficiency',
            maintenanceDue: 'Maintenance Due',
            lifetimeTotal: 'Lifetime total',
            basedOnRecent: 'Based on recent fills',
            currentMonthSpending: 'Current month spending',
            itemsNeedAttention: 'Items need attention',
            dueIn: 'Due in',
            overdueBy: 'Overdue by',
            soon: 'Soon',
            scheduled: 'Scheduled',
            overdue: 'Overdue',
            noUpcomingMaintenance: 'No upcoming maintenance due.',
            days: 'days',
            km: 'km',
            // Fuel
            fuelTracking: 'Fuel Tracking',
            fuelDesc: 'Log your refuels and track consumption',
            addFuel: 'Add Fuel',
            totalCost: 'Total Cost',
            totalVolume: 'Total Volume',
            avgPrice: 'Avg Price',
            date: 'Date',
            odometer: 'Odometer (km)',
            liters: 'Liters',
            pricePerLiter: 'Price / Liter',
            stationName: 'Station Name (Optional)',
            fullTank: 'Full Tank',
            saveEntry: 'Save Entry',
            noFuelEntries: 'No fuel entries yet. Click "Add Fuel" to start tracking.',
            unknownStation: 'Unknown Station',
            partial: 'Partial',
            volume: 'Volume',
            price: 'Price',
            // Maintenance
            maintenanceTracking: 'Maintenance Tracking',
            maintenanceDesc: 'Track your vehicle services and repairs',
            addRecord: 'Add Record',
            totalSpent: 'Total Spent',
            lastService: 'Last Service',
            upcoming: 'Upcoming',
            serviceType: 'Service Type',
            cost: 'Cost',
            provider: 'Provider (Shop Name)',
            nextDueDate: 'Next Due Date (Optional)',
            notes: 'Notes',
            saveRecord: 'Save Record',
            noMaintenanceRecords: 'No maintenance records yet.',
            nextDue: 'Next Due',
            // Expenses
            expensesTracking: 'Expenses Tracking',
            expensesDesc: 'Track miscellaneous costs like insurance, parking, and fines',
            addExpense: 'Add Expense',
            category: 'Category',
            titleDescription: 'Title / Description',
            saveExpense: 'Save Expense',
            noExpensesRecords: 'No expenses recorded yet.',
            // Vehicles
            manageGarage: 'Manage your garage',
            addVehicle: 'Add Vehicle',
            editVehicle: 'Edit Vehicle',
            addNewVehicle: 'Add New Vehicle',
            make: 'Make',
            model: 'Model',
            year: 'Year',
            licensePlate: 'License Plate',
            color: 'Color',
            currentOdometer: 'Current Odometer (km)',
            vin: 'VIN (Optional)',
            setAsDefault: 'Set as Default Vehicle',
            saveVehicle: 'Save Vehicle',
            updateVehicle: 'Update Vehicle',
            noVehicles: 'No vehicles added yet',
            addFirstCar: 'Add your first car to start tracking expenses.',
            default: 'Default',
            plate: 'Plate'
        },
        ar: {
            dashboard: 'لوحة التحكم',
            fuel: 'الوقود',
            maintenance: 'الصيانة',
            expenses: 'المصاريف',
            vehicles: 'المركبات',
            settings: 'الإعدادات',
            appTitle: 'عمر كار برو',
            welcome: 'مرحباً بعودتك',
            totalExpenses: 'إجمالي المصاريف',
            fuelEfficiency: 'كفاءة الوقود',
            upcomingMaintenance: 'الصيانة القادمة',
            exportData: 'تصدير البيانات',
            importData: 'استيراد البيانات',
            clearData: 'مسح البيانات',
            language: 'اللغة',
            darkMode: 'الوضع الليلي',
            save: 'حفظ',
            cancel: 'إلغاء',
            add: 'إضافة',
            delete: 'حذف',
            edit: 'تعديل',
            confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا؟',
            dataManagement: 'إدارة البيانات',
            preferences: 'التفضيلات',
            exportDesc: 'تحميل نسخة احتياطية من بياناتك',
            importDesc: 'استعادة البيانات من ملف نسخ احتياطي',
            clearDesc: 'حذف جميع البيانات نهائياً',
            successImport: 'تم استيراد البيانات بنجاح!',
            errorImport: 'خطأ في استيراد البيانات. ملف غير صالح.',
            successClear: 'تم مسح جميع البيانات.',
            // Dashboard specific
            monthlyExpensesTrend: 'اتجاه المصاريف الشهرية',
            expenseBreakdown: 'توزيع المصاريف',
            fuelEfficiencyHistory: 'سجل كفاءة الوقود',
            thisMonth: 'هذا الشهر',
            avgEfficiency: 'متوسط الكفاءة',
            maintenanceDue: 'صيانة مستحقة',
            lifetimeTotal: 'الإجمالي الكلي',
            basedOnRecent: 'بناءً على التعبئات الأخيرة',
            currentMonthSpending: 'إنفاق الشهر الحالي',
            itemsNeedAttention: 'عناصر تحتاج انتباه',
            dueIn: 'مستحق خلال',
            overdueBy: 'متأخر بـ',
            soon: 'قريباً',
            scheduled: 'مجدول',
            overdue: 'متأخر',
            noUpcomingMaintenance: 'لا توجد صيانة قادمة.',
            days: 'أيام',
            km: 'كم',
            // Fuel
            fuelTracking: 'تتبع الوقود',
            fuelDesc: 'سجل تعبئات الوقود وتتبع الاستهلاك',
            addFuel: 'إضافة وقود',
            totalCost: 'التكلفة الإجمالية',
            totalVolume: 'إجمالي الكمية',
            avgPrice: 'متوسط السعر',
            date: 'التاريخ',
            odometer: 'العداد (كم)',
            liters: 'لترات',
            pricePerLiter: 'السعر / لتر',
            stationName: 'اسم المحطة (اختياري)',
            fullTank: 'خزان ممتلئ',
            saveEntry: 'حفظ السجل',
            noFuelEntries: 'لا توجد سجلات وقود بعد. انقر على "إضافة وقود" للبدء.',
            unknownStation: 'محطة غير معروفة',
            partial: 'جزئي',
            volume: 'الكمية',
            price: 'السعر',
            // Maintenance
            maintenanceTracking: 'تتبع الصيانة',
            maintenanceDesc: 'تتبع خدمات وإصلاحات مركبتك',
            addRecord: 'إضافة سجل',
            totalSpent: 'إجمالي المنفق',
            lastService: 'آخر خدمة',
            upcoming: 'قادم',
            serviceType: 'نوع الخدمة',
            cost: 'التكلفة',
            provider: 'المزود (اسم الورشة)',
            nextDueDate: 'تاريخ الاستحقاق القادم (اختياري)',
            notes: 'ملاحظات',
            saveRecord: 'حفظ السجل',
            noMaintenanceRecords: 'لا توجد سجلات صيانة بعد.',
            nextDue: 'الاستحقاق القادم',
            // Expenses
            expensesTracking: 'تتبع المصاريف',
            expensesDesc: 'تتبع التكاليف المتنوعة مثل التأمين، المواقف، والمخالفات',
            addExpense: 'إضافة مصروف',
            category: 'الفئة',
            titleDescription: 'العنوان / الوصف',
            saveExpense: 'حفظ المصروف',
            noExpensesRecords: 'لا توجد مصاريف مسجلة بعد.',
            // Vehicles
            manageGarage: 'إدارة مرآبك',
            addVehicle: 'إضافة مركبة',
            editVehicle: 'تعديل المركبة',
            addNewVehicle: 'إضافة مركبة جديدة',
            make: 'الشركة المصنعة',
            model: 'الموديل',
            year: 'السنة',
            licensePlate: 'رقم اللوحة',
            color: 'اللون',
            currentOdometer: 'العداد الحالي (كم)',
            vin: 'رقم الهيكل (اختياري)',
            setAsDefault: 'تعيين كمركبة افتراضية',
            saveVehicle: 'حفظ المركبة',
            updateVehicle: 'تحديث المركبة',
            noVehicles: 'لم تتم إضافة مركبات بعد',
            addFirstCar: 'أضف سيارتك الأولى لبدء تتبع المصاريف.',
            default: 'افتراضي',
            plate: 'اللوحة'
        }
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
