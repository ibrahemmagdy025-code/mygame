# قواعد Firestore المطلوبة

لتجنب أخطاء الصلاحيات، يجب تحديث قواعد Firestore في Firebase Console.

## الخطوات:

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Firestore Database** > **Rules**
4. استبدل القواعد الحالية بالقواعد التالية:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - كل مستخدم يمكنه قراءة وكتابة بياناته فقط
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Games collection - كل مستخدم يمكنه قراءة وكتابة ألعابه فقط
    match /games/{gameId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.judgeId == request.auth.uid);
    }
    
    // History collection - كل مستخدم يمكنه قراءة وكتابة تاريخه فقط
    match /history/{historyId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.judgeId == request.auth.uid);
    }
  }
}
```

5. اضغط **Publish** لحفظ القواعد

## ملاحظات:

- هذه القواعد تسمح لكل مستخدم بالوصول فقط لبياناته الخاصة
- `request.auth != null` يعني أن المستخدم يجب أن يكون مسجل دخول
- `request.auth.uid == userId` يضمن أن المستخدم يصل فقط لبياناته
- `resource == null` يسمح بإنشاء مستندات جديدة
- `resource.data.judgeId == request.auth.uid` يضمن أن المستخدم يصل فقط للألعاب/التاريخ الذي أنشأه

## للاختبار (غير آمن للإنتاج):

إذا كنت تريد قواعد مفتوحة للاختبار فقط:

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

**تحذير**: هذه القواعد تسمح لأي مستخدم مسجل دخول بالوصول لجميع البيانات. استخدمها للاختبار فقط!

