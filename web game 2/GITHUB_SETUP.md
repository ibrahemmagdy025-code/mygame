# إعداد الأسئلة من GitHub

هذا الدليل يوضح كيفية رفع ملفات الأسئلة على GitHub واستخدامها في التطبيق.

## الخطوات:

### 1. إنشاء Repository جديد على GitHub

1. اذهب إلى [GitHub](https://github.com) وسجل دخولك
2. اضغط على **New repository** أو **+** > **New repository**
3. أدخل اسم للمستودع (مثلاً: `quiz-questions`)
4. اختر **Public** (يجب أن يكون public للوصول للملفات)
5. اضغط **Create repository**

### 2. رفع ملفات JSON

#### الطريقة الأولى: من خلال GitHub Website

1. بعد إنشاء المستودع، اضغط على **Add file** > **Upload files**
2. اسحب ملفات JSON من مجلد `questions/` في مشروعك:
   - `general.json`
   - `sports.json`
   - `history.json`
   - `science.json`
3. أنشئ مجلد `questions` في GitHub (اكتب `questions/` قبل اسم الملف)
4. اضغط **Commit changes**

#### الطريقة الثانية: من خلال Git

```bash
# في مجلد المشروع
git init
git add questions/
git commit -m "Add questions files"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. تحديث إعدادات التطبيق

1. افتح ملف `js/questions-config.js`
2. استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك على GitHub
3. استبدل `YOUR_REPO_NAME` باسم المستودع الذي أنشأته

مثال:
```javascript
githubBaseUrl: 'https://raw.githubusercontent.com/ahmed123/quiz-questions/main/questions/',
```

### 4. التحقق من الروابط

يمكنك التحقق من أن الملفات متاحة عبر زيارة الرابط مباشرة في المتصفح:

```
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/questions/general.json
```

يجب أن ترى محتوى ملف JSON.

## تنسيق ملفات JSON

تأكد من أن ملفات JSON تتبع هذا التنسيق:

```json
{
  "questions": [
    {
      "question": "السؤال هنا؟",
      "answer": "الإجابة هنا"
    },
    {
      "question": "سؤال آخر؟",
      "answer": "إجابة أخرى"
    }
  ]
}
```

## إضافة مواضيع جديدة

1. أضف ملف JSON جديد في مجلد `questions/` على GitHub
2. افتح `js/questions-config.js`
3. أضف الموضوع الجديد في مصفوفة `topics`:

```javascript
topics: [
    { id: 'general', name: 'أسئلة عامة', file: 'general.json' },
    { id: 'sports', name: 'رياضة', file: 'sports.json' },
    { id: 'history', name: 'تاريخ', file: 'history.json' },
    { id: 'science', name: 'علوم', file: 'science.json' },
    { id: 'new-topic', name: 'موضوع جديد', file: 'new-topic.json' } // جديد
]
```

## تحديث الأسئلة

عندما تريد تحديث الأسئلة:

1. عدل ملفات JSON على GitHub
2. احفظ التغييرات
3. التطبيق سيحمل الأسئلة المحدثة تلقائياً عند بدء لعبة جديدة

**ملاحظة**: لا حاجة لتحديث التطبيق نفسه - فقط قم بتحديث الملفات على GitHub!

## استكشاف الأخطاء

### المشكلة: "Error loading file"
- تأكد من أن المستودع **Public**
- تأكد من صحة اسم المستخدم واسم المستودع
- تأكد من أن الملفات موجودة في مجلد `questions/`
- تأكد من أن اسم الفرع صحيح (`main` أو `master`)

### المشكلة: "CORS error"
- GitHub Raw URLs تدعم CORS بشكل افتراضي
- إذا واجهت مشكلة، تأكد من أن الرابط يبدأ بـ `https://raw.githubusercontent.com`

### المشكلة: الملفات لا تظهر
- تأكد من أنك حفظت الملفات في GitHub (Commit)
- انتظر بضع ثوانٍ بعد الحفظ
- جرب فتح الرابط مباشرة في المتصفح

## مثال كامل

إذا كان اسم المستخدم: `ahmed123` واسم المستودع: `quiz-questions`

```javascript
githubBaseUrl: 'https://raw.githubusercontent.com/ahmed123/quiz-questions/main/questions/',
```

الروابط ستكون:
- `https://raw.githubusercontent.com/ahmed123/quiz-questions/main/questions/general.json`
- `https://raw.githubusercontent.com/ahmed123/quiz-questions/main/questions/sports.json`
- إلخ...

