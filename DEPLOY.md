# دليل رفع المشروع على GitHub والنشر

هذا الدليل يوضح كيفية رفع المشروع على GitHub ونشره بحيث يكون له رابط حقيقي.

## الطريقة الأولى: GitHub Pages (مجاني وسهل)

### الخطوة 1: رفع المشروع على GitHub

#### أ) إنشاء Repository جديد

1. اذهب إلى [GitHub](https://github.com) وسجل دخولك
2. اضغط على **+** في أعلى الصفحة > **New repository**
3. أدخل اسم المستودع (مثلاً: `quiz-game`)
4. اختر **Public** (مطلوب لـ GitHub Pages)
5. **لا** تضع علامة على "Initialize this repository with a README"
6. اضغط **Create repository**

#### ب) رفع الملفات من الكمبيوتر

افتح PowerShell أو Terminal في مجلد المشروع وقم بتنفيذ الأوامر التالية:

```bash
# تهيئة Git (إذا لم تكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# عمل commit أولي
git commit -m "Initial commit: Quiz Game App"

# إضافة remote repository (استبدل YOUR_USERNAME و YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# رفع الملفات
git branch -M main
git push -u origin main
```

**ملاحظة**: إذا طُلب منك اسم المستخدم وكلمة المرور:
- اسم المستخدم: اسمك على GitHub
- كلمة المرور: استخدم **Personal Access Token** (ليس كلمة المرور العادية)
  - كيفية إنشاء Token: Settings > Developer settings > Personal access tokens > Generate new token
  - اختر scope: `repo`

### الخطوة 2: تفعيل GitHub Pages

1. اذهب إلى repository على GitHub
2. اضغط على **Settings** (الإعدادات)
3. في القائمة الجانبية، اضغط على **Pages**
4. تحت **Source**، اختر **Deploy from a branch**
5. اختر **main** branch و **/ (root)** folder
6. اضغط **Save**

### الخطوة 3: الحصول على الرابط

بعد بضع دقائق، ستحصل على رابط المشروع:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

مثال:
```
https://ibrahemmagdy025-code.github.io/quiz-game/
```

---

## الطريقة الثانية: Firebase Hosting (أفضل للأداء)

### الخطوة 1: تثبيت Firebase CLI

```bash
npm install -g firebase-tools
```

### الخطوة 2: تسجيل الدخول

```bash
firebase login
```

سيفتح المتصفح - سجل دخولك بحساب Google المرتبط بـ Firebase.

### الخطوة 3: تهيئة المشروع

```bash
firebase init hosting
```

عند الأسئلة:
- **What do you want to use as your public directory?** → اكتب: `.` (نقطة)
- **Configure as a single-page app?** → اكتب: `Yes`
- **Set up automatic builds and deploys with GitHub?** → اكتب: `No` (يمكنك تفعيله لاحقاً)
- **File public/index.html already exists. Overwrite?** → اكتب: `No`

### الخطوة 4: النشر

```bash
firebase deploy --only hosting
```

### الخطوة 5: الحصول على الرابط

بعد النشر، ستحصل على رابط مثل:
```
https://YOUR_PROJECT_ID.web.app
```
أو
```
https://YOUR_PROJECT_ID.firebaseapp.com
```

---

## الطريقة الثالثة: رفع على GitHub فقط (بدون نشر)

إذا أردت فقط رفع الكود على GitHub بدون نشر:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## تحديث المشروع لاحقاً

عندما تقوم بتعديلات وتريد رفعها:

```bash
git add .
git commit -m "وصف التعديلات"
git push
```

---

## استكشاف الأخطاء

### مشكلة: "git is not recognized"
- قم بتثبيت Git من [git-scm.com](https://git-scm.com)

### مشكلة: "Permission denied"
- تأكد من استخدام Personal Access Token بدلاً من كلمة المرور
- أو استخدم SSH keys

### مشكلة: GitHub Pages لا يعمل
- تأكد من أن Repository **Public**
- انتظر 5-10 دقائق بعد التفعيل
- تأكد من أن الملف `index.html` موجود في root

### مشكلة: Firebase deploy فشل
- تأكد من تسجيل الدخول: `firebase login`
- تأكد من أنك في المجلد الصحيح
- تأكد من وجود ملف `firebase.json`

---

## نصائح مهمة

1. **لا ترفع ملفات حساسة**: تأكد من وجود `.gitignore` وعدم رفع:
   - معلومات Firebase الحساسة (يمكن تركها لكن احذر)
   - ملفات كبيرة غير ضرورية

2. **README.md**: أضف ملف README.md يشرح المشروع

3. **التحديثات**: قم بعمل commit و push بعد كل تعديل مهم

4. **النسخ الاحتياطي**: GitHub يعمل كنسخة احتياطية تلقائية

---

## روابط مفيدة

- [GitHub](https://github.com)
- [Firebase Console](https://console.firebase.google.com)
- [Git Documentation](https://git-scm.com/doc)

---

## مثال كامل

إذا كان اسم المستخدم: `ibrahemmagdy025-code` واسم المستودع: `quiz-game`

```bash
git init
git add .
git commit -m "Initial commit: Quiz Game App"
git remote add origin https://github.com/ibrahemmagdy025-code/quiz-game.git
git branch -M main
git push -u origin main
```

الرابط بعد تفعيل GitHub Pages:
```
https://ibrahemmagdy025-code.github.io/quiz-game/
```

