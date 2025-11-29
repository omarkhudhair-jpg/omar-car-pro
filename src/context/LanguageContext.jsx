import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [currency, setCurrency] = useState('SAR');
    const [calendarSystem, setCalendarSystem] = useState('gregorian');

    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        const savedCurrency = localStorage.getItem('currency');
        const savedCalendar = localStorage.getItem('calendarSystem');

        if (savedLang) setLanguage(savedLang);
        if (savedCurrency) setCurrency(savedCurrency);
        if (savedCalendar) setCalendarSystem(savedCalendar);
    }, []);

    const toggleLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const updateCurrency = (curr) => {
        setCurrency(curr);
        localStorage.setItem('currency', curr);
    };

    const updateCalendarSystem = (sys) => {
        setCalendarSystem(sys);
        localStorage.setItem('calendarSystem', sys);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        const gregOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const gregDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', gregOptions).format(date);

        if (calendarSystem === 'gregorian') return gregDate;

        const hijriOptions = { year: 'numeric', month: 'short', day: 'numeric', calendar: 'islamic-umalqura' };
        const hijriDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US-u-ca-islamic-umalqura', hijriOptions).format(date);

        if (calendarSystem === 'hijri') return hijriDate;

        // Both
        return `${gregDate} | ${hijriDate}`;
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
            // Regional Settings
            regionalSettings: 'Regional Settings',
            currency: 'Currency',
            calendarSystem: 'Calendar System',
            gregorian: 'Gregorian',
            hijri: 'Hijri',
            both: 'Both',
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
            plate: 'Plate',
            or: 'or',
            // Expense Categories
            expenseParking: 'Parking',
            expenseInsurance: 'Insurance',
            expenseFine: 'Fine',
            expenseTax: 'Tax',
            expenseCarWash: 'Car Wash',
            expenseAccessories: 'Accessories',
            expenseToll: 'Toll',
            expenseOther: 'Other',
            // Maintenance Service Types
            serviceOilChange: 'Oil Change',
            serviceTires: 'Tires',
            serviceBrakes: 'Brakes',
            serviceBattery: 'Battery',
            serviceInspection: 'Inspection',
            serviceRepair: 'Repair',
            serviceOther: 'Other',
            // Car Manufacturers
            makeToyota: 'Toyota',
            makeHonda: 'Honda',
            makeFord: 'Ford',
            makeChevrolet: 'Chevrolet',
            makeNissan: 'Nissan',
            makeBMW: 'BMW',
            makeMercedes: 'Mercedes-Benz',
            makeAudi: 'Audi',
            makeHyundai: 'Hyundai',
            makeKia: 'Kia',
            makeMazda: 'Mazda',
            makeVolkswagen: 'Volkswagen',
            makeSubaru: 'Subaru',
            makeLexus: 'Lexus',
            makeJeep: 'Jeep',
            makeGMC: 'GMC',
            makeDodge: 'Dodge',
            makeRam: 'Ram',
            makeMitsubishi: 'Mitsubishi',
            makeOther: 'Other',
            // Car Colors
            colorWhite: 'White',
            colorBlack: 'Black',
            colorSilver: 'Silver',
            colorGray: 'Gray',
            colorRed: 'Red',
            colorBlue: 'Blue',
            colorGreen: 'Green',
            colorYellow: 'Yellow',
            colorOrange: 'Orange',
            colorBrown: 'Brown',
            colorGold: 'Gold',
            colorBeige: 'Beige',
            colorOther: 'Other'
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
            // Regional Settings
            regionalSettings: 'الإعدادات الإقليمية',
            currency: 'العملة',
            calendarSystem: 'نظام التقويم',
            gregorian: 'ميلادي',
            hijri: 'هجري',
            both: 'كلاهما',
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
            plate: 'اللوحة',
            or: 'أو',
            // Expense Categories
            expenseParking: 'مواقف',
            expenseInsurance: 'تأمين',
            expenseFine: 'مخالفة',
            expenseTax: 'ضريبة',
            expenseCarWash: 'غسيل',
            expenseAccessories: 'إكسسوارات',
            expenseToll: 'رسوم طريق',
            expenseOther: 'أخرى',
            // Maintenance Service Types
            serviceOilChange: 'تغيير زيت',
            serviceTires: 'إطارات',
            serviceBrakes: 'فرامل',
            serviceBattery: 'بطارية',
            serviceInspection: 'فحص',
            serviceRepair: 'إصلاح',
            serviceOther: 'أخرى',
            // Car Manufacturers
            makeToyota: 'تويوتا',
            makeHonda: 'هوندا',
            makeFord: 'فورد',
            makeChevrolet: 'شيفروليه',
            makeNissan: 'نيسان',
            makeBMW: 'بي إم دبليو',
            makeMercedes: 'مرسيدس بنز',
            makeAudi: 'أودي',
            makeHyundai: 'هيونداي',
            makeKia: 'كيا',
            makeMazda: 'مازدا',
            makeVolkswagen: 'فولكس فاجن',
            makeSubaru: 'سوبارو',
            makeLexus: 'لكزس',
            makeJeep: 'جيب',
            makeGMC: 'جي إم سي',
            makeDodge: 'دودج',
            makeRam: 'رام',
            makeMitsubishi: 'ميتسوبيشي',
            makeOther: 'أخرى',
            // Car Colors
            colorWhite: 'أبيض',
            colorBlack: 'أسود',
            colorSilver: 'فضي',
            colorGray: 'رمادي',
            colorRed: 'أحمر',
            colorBlue: 'أزرق',
            colorGreen: 'أخضر',
            colorYellow: 'أصفر',
            colorOrange: 'برتقالي',
            colorBrown: 'بني',
            colorGold: 'ذهبي',
            colorBeige: 'بيج',
            colorOther: 'أخرى'
        }
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            toggleLanguage,
            t,
            currency,
            updateCurrency,
            calendarSystem,
            updateCalendarSystem,
            formatCurrency,
            formatDate
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
