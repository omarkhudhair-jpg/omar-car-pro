# نشر تطبيق Omar Car Pro على GitHub Pages

## الخطوات السريعة

### 1. تحضير الملفات
cd c:\Users\we\Opel\dist

### 2. إنشاء مستودع Git محلي
git init
git add .
git commit -m "Deploy Omar Car Pro v1.0"

### 3. ربط المستودع بـ GitHub
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك على GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/omar-car-pro.git

### 4. رفع الملفات
git push -u origin main

### 5. تفعيل GitHub Pages
# اذهب إلى:
# https://github.com/YOUR_USERNAME/omar-car-pro/settings/pages
# اختر: Source → Deploy from a branch → main → / (root) → Save

### 6. رابط التطبيق
# https://YOUR_USERNAME.github.io/omar-car-pro/

---

## ملاحظات مهمة

1. استبدل YOUR_USERNAME باسم المستخدم الخاص بك على GitHub
2. إذا طلب منك تسجيل الدخول، أدخل بيانات GitHub الخاصة بك
3. قد يستغرق النشر 1-2 دقيقة بعد التفعيل
4. تأكد من أن المستودع Public وليس Private

---

## تحديث التطبيق مستقبلاً

عندما تريد تحديث التطبيق:

```bash
# 1. أعد بناء التطبيق
cd c:\Users\we\Opel
npm run build

# 2. انتقل إلى مجلد dist
cd dist

# 3. ارفع التحديثات
git add .
git commit -m "Update application"
git push
```

سيتم تحديث التطبيق تلقائياً على نفس الرابط.
