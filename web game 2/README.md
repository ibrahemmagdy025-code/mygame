# لعبة الأسئلة العامة

تطبيق ويب لإدارة لعبة أسئلة عامة حيث يدير الحكم اللعبة، يعرض الأسئلة، ويدير نقاط اللاعبين.

## المميزات

- تسجيل الدخول بـ Gmail باستخدام Firebase Authentication
- إدارة اللاعبين وحفظهم في قاعدة البيانات
- اختيار مواضيع الأسئلة (عامة، رياضة، تاريخ، علوم، متنوع)
- عرض الأسئلة والإجابات
- إدارة النقاط (إضافة/خصم)
- تايمر 10 ثواني مع صوت
- تخطي الأسئلة
- حفظ تاريخ الألعاب

## الإعداد

### 1. إعداد Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. فعّل Authentication واختر Google Sign-in
4. أنشئ Firestore Database
5. انسخ بيانات الإعداد من Firebase Console
6. افتح `js/firebase-config.js` واستبدل القيم:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. إضافة صوت التايمر

ضع ملف `timer-sound.mp3` في مجلد `assets/`

### 3. النشر على Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## الاستخدام

1. سجل دخولك بـ Gmail
2. اختر لعبة الأسئلة العامة
3. اختر المواضيع المطلوبة
4. أضف اللاعبين وحدد من سيلعب
5. ابدأ اللعبة
6. أول لاعب يصل إلى 10 نقاط يفوز

## هيكل المشروع

```
web-game-2/
├── index.html          # الصفحة الرئيسية
├── css/
│   └── style.css       # التصميم
├── js/
│   ├── main.js         # نقطة الدخول
│   ├── auth.js         # المصادقة
│   ├── game.js         # إدارة الألعاب
│   ├── player.js       # إدارة اللاعبين
│   ├── question.js     # الأسئلة
│   ├── timer.js        # التايمر
│   ├── score.js        # النقاط
│   └── firebase-config.js
├── questions/          # ملفات الأسئلة JSON
└── assets/            # الملفات الثابتة
```

## الترخيص

هذا المشروع مجاني ومفتوح المصدر.

