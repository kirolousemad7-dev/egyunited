# ايجي يونايتد للمصاعد

صفحة هبوط بالعربية والإنجليزية لشركة **EGY UNITED FOR ELEVATORS**. العربية هي اللغة الافتراضية واتجاهها من اليمين لليسار، والإنجليزية من اليسار لليمين. الموقع يعرّف بخدمات توريد وتركيب وإحلال وتجديد وإصلاح وصيانة المصاعد، ويعرض جزءًا من سابقة الأعمال، ويحوّل طلب عرض السعر إلى رسالة واتساب بلغة الصفحة.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000). الزيارة الأولى تذهب إلى [http://localhost:3000/ar](http://localhost:3000/ar)، والنسخة الإنجليزية على [http://localhost:3000/en](http://localhost:3000/en).

## البيئة

انسخ `.env.example` إلى `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=201210442451
```

- `NEXT_PUBLIC_SITE_URL`: عنوان الموقع بلا شرطة في الآخر. يُستخدم في الميتاداتا وOpen Graph وخريطة الموقع والبيانات المنظمة.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: رقم واتساب بالصيغة الدولية من غير `+` أو مسافات.

## الأوامر

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

## النشر على Hostinger

الموقع تطبيق Next.js يعمل على السيرفر، لأن توجيه اللغة في `src/proxy.ts` وصورة Next وبيانات SEO تحتاج Node.js. الاستضافة المشتركة التي ترفع ملفات HTML فقط لا تشغّل هذا المشروع. الخطة يجب أن تدعم **Node.js web apps** في hPanel.

1. ارفع الفرع `main` إلى GitHub.
2. من hPanel: Websites → Add Website → Node.js web app → Import Git repository.
3. اربط GitHub واختر المستودع والفرع `main`.
4. الإعدادات: نوع التطبيق `next`، أمر البناء `build`، مجلد الإخراج `.next`، واترك ملف الدخول فارغًا. Node.js 20 أو 22.
5. قبل أول بناء أضف متغيرات البيئة العامة:
   - `NEXT_PUBLIC_SITE_URL` = عنوان النطاق الحقيقي بلا شرطة في الآخر، مثل `https://example.com`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `201210442451` إذا بقي رقم الاستقبال كما هو
6. اضغط Deploy. بعد الربط، الدفع إلى `main` يعيد البناء تلقائيًا عبر تطبيق Hostinger على GitHub.

لا تضف عنوان مكتب أو بريدًا أو حسابات تواصل غير موجودة في بيانات الشركة.

لا تضف عنوان مكتب أو بريدًا أو حسابات تواصل غير موجودة في بيانات الشركة.

## الصور

الشعار المستخدم هو الشعار المسلّم، بعد قص الفراغ الأسود حوله فقط ومن غير تغيير الرسم.

صور المباني والمصاعد في الصفحة **توضيحية** لنوع الاستخدام، وليست صور المشروعات المذكورة في سابقة الأعمال. بطاقات الأعمال نصية لهذا السبب.

الصور التوضيحية من Unsplash وPexels تحت رخصتيهما المجانيتين، وليست صور مشروعات الشركة:

- بهو المصاعد: [Unsplash](https://unsplash.com/photos/modern-elevator-lobby-with-marble-and-glass-accents-713E0LsFGz0)
- بئر المصعد الزجاجي: [Unsplash](https://unsplash.com/photos/interior-of-building-Y-GnrESsjr0)
- مصاعد الكبسولة الذهبية: [Unsplash](https://unsplash.com/photos/two-gold-capsule-elevator--S87hxapFvU)
- مصاعد زجاجية بهيكل معدني: [Unsplash](https://unsplash.com/photos/grey-metal-elevators-cWLTaVPCGyA)
- مصاعد متحركة: [Unsplash](https://unsplash.com/photos/two-elevators-are-moving-up-and-down-a-building-toibju16f98)
- أبراج إدارية: Unsplash `photo-1486406146926-c627a92ad1ab`
- عمارة سكنية: Unsplash `photo-1545324418-cc1a3fa10c00`
- فيلا: [Unsplash](https://unsplash.com/photos/white-and-brown-concrete-building-hHz4yrvxwlA)
- مبنى صحي: Unsplash `photo-1586773860418-d37222d8fce3`
- قاعة صناعية: [Pexels](https://www.pexels.com/photo/empty-warehouse-with-high-ceiling-236705/)

## ملاحظات

- قائمة الأعمال المعروضة جزء من سابقة الأعمال، وليست سجلًا كاملًا.
- لا توجد شهادات أو سنوات خبرة أو ضمانات غير مذكورة في بيانات الشركة.
- سنة حقوق النشر تُحسب وقت بناء الصفحة.
