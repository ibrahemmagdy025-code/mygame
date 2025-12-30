# دليل الإعداد السريع

## خطوات الإعداد

### 1. إعداد Firebase Project

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط على "Add project" أو "إضافة مشروع"
3. أدخل اسم المشروع (مثلاً: quiz-game)
4. اتبع الخطوات لإكمال إنشاء المشروع

### 2. تفعيل Authentication

1. في Firebase Console، اذهب إلى **Authentication**
2. اضغط على **Get started**
3. اذهب إلى **Sign-in method**
4. فعّل **Google** كطريقة تسجيل دخول
5. أدخل معلومات المشروع واحفظ

### 3. إنشاء Firestore Database

1. في Firebase Console، اذهب إلى **Firestore Database**
2. اضغط على **Create database**
3. اختر **Start in test mode** (للبداية)
4. اختر موقع قاعدة البيانات (اختر الأقرب لك)
5. اضغط **Enable**

### 4. الحصول على بيانات الإعداد

1. في Firebase Console، اضغط على ⚙️ (Settings) > **Project settings**
2. اذهب إلى قسم **Your apps**
3. اضغط على **</>** (Web icon)
4. أدخل اسم التطبيق (مثلاً: quiz-game-web)
5. انسخ بيانات الإعداد (firebaseConfig)

### 5. تحديث ملف الإعداد

افتح `js/firebase-config.js` واستبدل القيم:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // الصق من Firebase
    authDomain: "YOUR_AUTH_DOMAIN",      // الصق من Firebase
    projectId: "YOUR_PROJECT_ID",        // الصق من Firebase
    storageBucket: "YOUR_STORAGE_BUCKET", // الصق من Firebase
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // الصق من Firebase
    appId: "YOUR_APP_ID"                 // الصق من Firebase
};
```

### 6. إضافة صوت التايمر (اختياري)

1. احصل على ملف صوت MP3 (مدة قصيرة، مثلاً 1-2 ثانية)
2. ضع الملف في مجلد `assets/` باسم `timer-sound.mp3`
3. إذا لم تضيف الصوت، التايمر سيعمل بدون صوت

### 7. تشغيل التطبيق محلياً

#### الطريقة الأولى: استخدام Live Server (VS Code)
1. افتح المشروع في VS Code
2. اضغط بزر الماوس الأيمن على `index.html`
3. اختر **Open with Live Server**

#### الطريقة الثانية: استخدام Python
```bash
# Python 3
python -m http.server 8000

# ثم افتح المتصفح على
http://localhost:8000
```

#### الطريقة الثالثة: استخدام Node.js
```bash
npx http-server
```

### 8. النشر على Firebase Hosting (اختياري)

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting

# عند السؤال عن public directory، اكتب: .
# عند السؤال عن single-page app، اختر: Yes
# عند السؤال عن overwrite index.html، اختر: No

# النشر
firebase deploy
```

## اختبار التطبيق

1. افتح التطبيق في المتصفح
2. سجل دخولك بـ Gmail
3. أنشئ لعبة جديدة
4. اختر المواضيع
5. أضف لاعبين
6. ابدأ اللعبة

## استكشاف الأخطاء

### مشكلة: "Firebase is not defined"
- تأكد من أن Firebase SDK محمّل قبل ملفات JavaScript
- تحقق من أن `js/firebase-config.js` موجود وصحيح

### مشكلة: "Permission denied" في Firestore
- اذهب إلى Firestore Database > Rules
- تأكد من أن القواعد تسمح بالقراءة والكتابة (للاختبار فقط):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### مشكلة: لا يمكن تسجيل الدخول
- تأكد من تفعيل Google Sign-in في Authentication
- تحقق من أن بيانات الإعداد صحيحة

### مشكلة: الصوت لا يعمل
- تأكد من وجود ملف `assets/timer-sound.mp3`
- تحقق من أن المتصفح يسمح بتشغيل الصوت
- التطبيق سيعمل بدون صوت إذا لم يكن الملف موجوداً

## ملاحظات مهمة

- **الأمان**: في الإنتاج، يجب تحديث قواعد Firestore لتكون أكثر أماناً
- **الأسئلة**: يمكنك إضافة المزيد من الأسئلة في ملفات JSON في مجلد `questions/`
- **التصميم**: يمكنك تخصيص الألوان والتصميم في `css/style.css`

## الدعم

إذا واجهت أي مشاكل، تحقق من:
1. Console في المتصفح (F12) للأخطاء
2. Firebase Console للتأكد من الإعدادات
3. ملفات JSON للأسئلة للتأكد من التنسيق الصحيح

