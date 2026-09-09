// =========================================================
// 1. التبديل بين الوضع الداكن والوضع الفاتح
// =========================================================


// =========================================================
// أولاً: الحصول على عناصر HTML التي نحتاجها
// =========================================================

// الحصول على زر تغيير الوضع
const themeToggleBtn = document.getElementById('theme-toggle');

// الحصول على العنصر الذي يعرض أيقونة الوضع
const themeIcon = document.getElementById('theme-icon');

// الحصول على العنصر الذي يعرض اسم الوضع
const themeText = document.getElementById('theme-text');

// الحصول على عنصر HTML الرئيسي للصفحة
// document.documentElement يشير إلى عنصر <html>
const htmlElement = document.documentElement;

// مرجع موحد للحركات كي يحترم الموقع إعداد المستخدم لتقليل الحركة.
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


// =========================================================
// ثانياً: معرفة الوضع المحفوظ سابقاً
// =========================================================

// localStorage يسمح لنا بحفظ بيانات صغيرة داخل المتصفح.
//
// هنا نحاول الحصول على الوضع الذي اختاره المستخدم سابقاً.
//
// إذا لم نجد أي وضع محفوظ، نستخدم الوضع الفاتح light.
const savedTheme = localStorage.getItem('zaklab-theme') || 'light';


// تشغيل الوضع الذي تم الحصول عليه
setTheme(savedTheme);


// =========================================================
// ثالثاً: مراقبة الضغط على زر تغيير الوضع
// =========================================================

// عندما يضغط المستخدم على زر تغيير الوضع
if (themeToggleBtn) {
themeToggleBtn.addEventListener('click', function() {
  
  // الحصول على الوضع الحالي من عنصر HTML
  const currentTheme = htmlElement.getAttribute('data-theme');
  
  
  // إنشاء متغير سنضع بداخله الوضع الجديد
  let newTheme;
  
  
  // إذا كان الوضع الحالي فاتحاً
  if (currentTheme === 'light') {
    
    // نغيره إلى الوضع الداكن
    newTheme = 'dark';
    
  } else {
    
    // إذا لم يكن الوضع الحالي فاتحاً
    // نرجعه إلى الوضع الفاتح
    newTheme = 'light';
  }
  
  
  // تطبيق الوضع الجديد
  setTheme(newTheme);
  
});
}


// =========================================================
// رابعاً: دالة setTheme
// =========================================================

// هذه الدالة مسؤولة عن تغيير الوضع.
//
// تستقبل قيمة اسمها theme.
// يمكن أن تكون:
// light
// أو
// dark
function setTheme(theme) {
  const safeTheme = theme === 'dark' ? 'dark' : 'light';
  
  
  // تغيير قيمة data-theme الموجودة في عنصر <html>
  //
  // إذا كانت theme = dark
  // يصبح:
  //
  // <html data-theme="dark">
  //
  // وإذا كانت light:
  //
  // <html data-theme="light">
  htmlElement.setAttribute('data-theme', safeTheme);
  
  
  // حفظ الوضع في localStorage
  //
  // حتى إذا أغلق المستخدم الموقع
  // وفتحه مرة ثانية، يبقى نفس الوضع.
  localStorage.setItem('zaklab-theme', safeTheme);
  
  
  // =====================================================
  // إذا كان الوضع داكن
  // =====================================================
  
  if (safeTheme === 'dark') {
    
    // تغيير أيقونة الزر إلى الشمس
    if (themeIcon) { themeIcon.textContent = '☀️'; }
    
    // تغيير النص إلى "الوضع الفاتح"
    if (themeText) { themeText.textContent = 'الوضع الفاتح'; }
    
    
  } else {
    
    // =================================================
    // إذا كان الوضع فاتح
    // =================================================
    
    // تغيير الأيقونة إلى القمر
    if (themeIcon) { themeIcon.textContent = '🌙'; }
    
    // تغيير النص إلى "الوضع الداكن"
    if (themeText) { themeText.textContent = 'الوضع الداكن'; }
  }
  
}

// =========================================================
// 2. التحكم بظهور الأقسام بشكل مستقل تماماً
// =========================================================


// =========================================================
// أولاً: الحصول على روابط الـ Navbar
// =========================================================

// querySelectorAll يبحث عن جميع العناصر
// التي تحمل الكلاس .nav-item
//
// عندنا مثلاً:
// .nav-item
// .nav-item
// .nav-item
//
// وكلها يتم تخزينها داخل navItems.
const navItems = document.querySelectorAll('.nav-item');


// =========================================================
// ثانياً: الحصول على جميع أقسام الصفحات
// =========================================================

// نبحث عن جميع العناصر التي تحمل:
// class="page-section"
//
// مثل:
// tubes-page
// equipment-page
// tests-page
// urine-stool-page
// microbiology-page
// dev-page
const pageSections = document.querySelectorAll('.page-section');


// الحصول على قسم البحث
const searchSection = document.getElementById('search-section');


// الحصول على شعار الموقع
const navLogo = document.getElementById('nav-logo');


// مؤشر التبويب المتحرك داخل شريط التنقل. يبقى اختيار الرابط نفسه كما هو؛
// هذه الدالة تحسب موقع الرابط النشط فقط لكي ينتقل الإطار ذو الحواف الدائرية بسلاسة.
const navIndicator = document.querySelector('.nav-indicator');
const navLinksContainer = document.querySelector('.nav-links');
let navIndicatorFrame = 0;

const initialActiveNavItem = document.querySelector('.nav-item.active');
if (initialActiveNavItem) {
  initialActiveNavItem.setAttribute('aria-current', 'page');
}

function updateNavIndicator(activeItem, ensureVisible) {
  if (!navIndicator || !navLinksContainer || !activeItem) {
    return;
  }

  // يتحرك المؤشر داخل UL نفسه؛ لذلك يجب استعمال إحداثيات محتوى الشريط
  // (offsetLeft/offsetTop) وليس إحداثيات الشاشة المتغيرة أثناء الـscroll.
  const indicatorTarget = activeItem.closest('li') || activeItem;
  navIndicator.style.setProperty('--nav-indicator-x', indicatorTarget.offsetLeft + 'px');
  navIndicator.style.setProperty('--nav-indicator-y', indicatorTarget.offsetTop + 'px');
  navIndicator.style.setProperty('--nav-indicator-width', indicatorTarget.offsetWidth + 'px');
  navIndicator.style.setProperty('--nav-indicator-height', indicatorTarget.offsetHeight + 'px');
  navIndicator.classList.add('is-ready');

  // نحافظ على الـscroll الداخلي فقط عند اختيار تبويب جديد، لا عند كل حدث scroll.
  if (ensureVisible !== false) {
    activeItem.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

function scheduleNavIndicatorUpdate() {
  if (navIndicatorFrame) { return; }
  navIndicatorFrame = window.requestAnimationFrame(function() {
    navIndicatorFrame = 0;
    updateNavIndicator(document.querySelector('.nav-item.active'), false);
  });
}


// =========================================================
// ثالثاً: إضافة حدث الضغط لكل رابط
// =========================================================

// نمر على جميع عناصر navItems واحداً واحداً.
//
// forEach تعني:
// نفذ الكود الموجود بداخلها لكل عنصر.
navItems.forEach(function(item) {
  
  
  // عندما يضغط المستخدم على هذا الرابط
  item.addEventListener('click', function(e) {
    
    
    // منع الرابط من تنفيذ السلوك الافتراضي.
    //
    // لأن الرابط عندنا يستخدم href="#"
    // ولا نريد أن ينتقل المتصفح إلى مكان آخر.
    e.preventDefault();
    
    
    // =================================================
    // 1. تغيير الرابط النشط في Navbar
    // =================================================
    
    
    // أولاً نمر على جميع روابط الـ Navbar
    navItems.forEach(function(link) {
      
      // إزالة class اسمه active
      // من كل الروابط.
      //
      // بهذه الطريقة نضمن أن رابطاً واحداً
      // فقط هو الذي سيكون نشطاً.
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
    });
    
    
    // بعد إزالة active من الجميع
    // نضيف active للرابط الذي ضغط عليه المستخدم.
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');
    
    
    // =================================================
    // 2. إخفاء جميع الأقسام
    // =================================================
    
    
    // نمر على جميع أقسام الصفحة
    pageSections.forEach(function(section) {
      
      // نخفي القسم.
      //
      // display = 'none'
      // تعني أن العنصر لا يظهر على الصفحة.
      section.style.display = 'none';
      
    });
    
    
    // =================================================
    // 3. معرفة القسم المطلوب وإظهاره
    // =================================================
    
    
    // نأخذ قيمة data-target
    // الموجودة داخل الرابط الذي ضغط عليه المستخدم.
    //
    // مثال:
    //
    // <a data-target="tubes-page">
    //
    // هنا targetId سيكون:
    //
    // "tubes-page"
    const targetId = item.getAttribute('data-target');
    
    
    // بعد أن عرفنا اسم الـ ID
    // نبحث عن العنصر الذي يحمل هذا الـ ID.
    //
    // مثال:
    //
    // document.getElementById('tubes-page')
    //
    // سيعطينا قسم التيوبات.
    const targetSection = document.getElementById(targetId);
    
    
    // نتأكد أولاً أن القسم موجود.
    if (targetSection) {
      
      // إذا كان موجوداً، نظهره.
      targetSection.style.display = 'block';
      
    }

    if (targetId === 'interpretation-page' && typeof renderInterpretationPage === 'function') {
      renderInterpretationPage();
    }

    if (targetId === 'molecular-genetics-page' && typeof renderMolecularGeneticsPage === 'function') {
      renderMolecularGeneticsPage();
    }

    if (targetId === 'practical-lab-page' && typeof renderPracticalLab === 'function') {
      renderPracticalLab();
    }
    
    
    // =================================================
    // 4. التحكم بظهور شريط البحث
    // =================================================
    
    
    // إذا كان القسم المطلوب هو قسم المطور
    if (searchSection && targetId === 'dev-page') {
      
      // نخفي شريط البحث.
      searchSection.style.display = 'none';
      
    } else if (searchSection) {
      
      // إذا كان القسم أي قسم آخر
      // نظهر شريط البحث.
      searchSection.style.display = 'block';
      
    }

    // ننتظر إطار الرسم التالي لأن إظهار أو إخفاء القسم قد يغير عرض الصفحة
    // وموقع الرابط، خصوصاً عند الانتقال إلى قسم المطور في واجهة RTL.
    window.requestAnimationFrame(function() {
      updateNavIndicator(item, true);
    });
    
    
    // =================================================
    // 5. العودة إلى أعلى الصفحة
    // =================================================
    
    
    // عند الانتقال بين الأقسام
    // نرجع المستخدم إلى أعلى الصفحة.
    //
    // top: 0
    // تعني أعلى الصفحة.
    //
    // behavior: 'smooth'
    // تجعل الانتقال سلساً.
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
    
  });
  
});


// نحدد موضع الإطار بعد اكتمال تخطيط الصفحة، ثم نعيد حسابه عند تغير عرض الشاشة.
window.requestAnimationFrame(function() {
  updateNavIndicator(document.querySelector('.nav-item.active'));
});

window.addEventListener('load', function() {
  updateNavIndicator(document.querySelector('.nav-item.active'));
});

window.addEventListener('resize', function() {
  scheduleNavIndicatorUpdate();
});

if (navLinksContainer) {
  navLinksContainer.addEventListener('scroll', scheduleNavIndicatorUpdate, { passive: true });
}


// =========================================================
// 6. عند الضغط على Logo
// =========================================================

// نتأكد أولاً أن navLogo موجود.
if (navLogo) {
  
  
  // إضافة حدث عند الضغط على الشعار.
  navLogo.addEventListener('click', function(e) {
    
    
    // منع الرابط من تنفيذ السلوك الافتراضي.
    e.preventDefault();
    
    
    // navItems[0] يعني أول رابط في قائمة الـ Navbar.
    //
    // أول رابط عندنا هو قسم التيوبات.
    //
    // لذلك عندما نضغط على الشعار
    // نتصرف وكأن المستخدم ضغط على أول رابط.
    if (navItems.length) {
      navItems[0].click();
    }
    
  });
  
}

// =========================================================
// دالة لتوليد كروت التيوبات تلقائياً داخل الحاوية
// =========================================================

function renderTubes() {
  
  
  // =====================================================
  // 1. الحصول على حاوية التيوبات
  // =====================================================
  
  // نبحث عن العنصر الذي يحمل:
  //
  // id="tubes-container"
  //
  // وهذا هو المكان الذي ستظهر بداخله كروت التيوبات.
  const tubesContainer = document.getElementById('tubes-container');
  
  
  // =====================================================
  // 2. التأكد من وجود الحاوية
  // =====================================================
  
  // إذا لم نجد حاوية التيوبات
  // نوقف الدالة مباشرة.
  //
  // هذا يمنع حدوث خطأ في JavaScript.
  if (!tubesContainer) {
    
    return;
  }
  
  
  // =====================================================
  // 3. تنظيف الحاوية قبل إضافة الكروت
  // =====================================================
  
  // innerHTML يحتوي على المحتوى الموجود
  // داخل العنصر.
  //
  // عندما نضعه فارغاً:
  //
  // ''
  //
  // يتم حذف المحتوى القديم.
  tubesContainer.innerHTML = '';

  // سنجمع جميع الكروت هنا ثم نضيفها مرة واحدة في نهاية الدالة.
  // هذا أبسط من إعادة بناء الحاوية بعد كل تيوب.
  let tubesCardsHTML = '';
  const safeTubesData = Array.isArray(tubesData) ? tubesData : [];
  
  
  // =====================================================
  // 4. المرور على بيانات التيوبات
  // =====================================================
  
  // tubesData هي البيانات الموجودة
  // في ملف data.js.
  //
  // نستخدم for عادية حتى تكون الفكرة
  // واضحة للمبتدئ.
  for (let i = 0; i < safeTubesData.length; i++) {
    
    
    // الحصول على التيوب الحالي
    //
    // tubesData[0] = أول تيوب
    // tubesData[1] = ثاني تيوب
    // وهكذا...
    const tube = safeTubesData[i] || {};
    const tubeName = String(tube.name || '').trim();
    const tubeArabicName = String(tube.arabicName || '').trim();
    const tubeImage = String(tube.image || '').trim();
    const tubeAdditive = String(tube.additive || '').trim();
    const tubeSampleType = String(tube.sampleType || '').trim();
    const tubeMechanism = String(tube.mechanism || '').trim();
    const tubeNotes = String(tube.notes || '').trim();
    const tubeTests = Array.isArray(tube.usedTests) ? tube.usedTests.filter(Boolean) : [];
    const tubeImageMarkup = tubeImage ? `
                    <img
                        src="${tubeImage}"
                        alt="${tubeName}"
                        loading="lazy"
                        decoding="async"
                        onerror="
                            this.onerror=null;
                            this.parentElement.classList.add('image-unavailable');
                            this.remove();
                        "
                    >` : '';
    
    
    // =================================================
    // 5. إنشاء كارت جديد
    // =================================================
    
    // نضع HTML الخاص بالكارت داخل متغير.
    //
    // استخدمنا backticks حتى نستطيع
    // كتابة HTML على عدة أسطر.
    const tubeSearchName = tubeName
    .toLowerCase()
    .trim();

	let tubeCard = `

    <div
        class="card-tube"
        data-search-name="${tubeSearchName}"
    >
                <!-- ===================================== -->
                <!-- الهيدر ولوغ غطاء التيوب -->
                <!-- ===================================== -->

                <div class="tube-header">

                    <!--
                        لون غطاء التيوب يأتي من البيانات:

                        tube.capColor
                    -->
                    <div
                        class="tube-cap"
                        style="background: ${String(tube.capColor || '#a855f7')};"
                    ></div>


                    <div>

                        <!-- اسم التيوب -->
                        <h3>${tubeName}</h3>


                        <!-- الاسم العربي للتيوب -->
                        <small
                            style="
                                color: var(--text-muted);
                                font-weight: 700;
                            "
                        >
                            ${tubeArabicName}
                        </small>

                    </div>

                </div>


                <!-- ===================================== -->
                <!-- معاينة صورة الأنبوب -->
                <!-- ===================================== -->

                <div class="tube-image-holder">

                    <!--
                        نضع رابط الصورة الموجود
                        داخل tube.image
                    -->

                    ${tubeImageMarkup}

                </div>


                <!-- ===================================== -->
                <!-- التفاصيل والمعلومات -->
                <!-- ===================================== -->

                <div class="tube-details">

                    <!-- المادة المضافة -->
                    <p>
                        <strong>المادة المضافة:</strong>
                        ${tubeAdditive}
                    </p>


                    <!-- نوع العينة -->
                    <p>
                        <strong>نوع العينة:</strong>
                        ${tubeSampleType}
                    </p>


                    <!-- آلية العمل -->
                    <p>
                        <strong>آلية العمل:</strong>
                        ${tubeMechanism}
                    </p>

                </div>


                <!-- ===================================== -->
                <!-- قائمة التحاليل المستخدمة -->
                <!-- ===================================== -->

                <div class="tube-tests-list">

                    <strong>أبرز التحاليل:</strong>


                    <div style="margin-top: 6px;">

        `;
    
    
    // =================================================
    // 6. إضافة التحاليل داخل الكارت
    // =================================================
    
    // usedTests عبارة عن Array
    // تحتوي على أسماء التحاليل المستخدمة
    // لهذا التيوب.
    //
    // مثال:
    //
    // tube.usedTests
    //
    // يمكن أن تحتوي على:
    //
    // ["CBC", "HbA1c"]
    for (let j = 0; j < tubeTests.length; j++) {
      
      
      // الحصول على اسم التحليل الحالي.
      const test = tubeTests[j];
      
      
      // إنشاء Badge للتحليل.
      const testBadge = `
                <span class="badge-item">${test}</span>
            `;
      
      
      // إضافة الـ Badge إلى الكارت.
      tubeCard += testBadge;
    }
    
    
    // =================================================
    // 7. إكمال HTML الخاص بالكارت
    // =================================================
    
    tubeCard += `

                    </div>
                </div>


                <!-- ===================================== -->
                <!-- ملاحظات العمل المختبري -->
                <!-- ===================================== -->

                <div class="tube-note">

                    💡

                    <strong>ملاحظة:</strong>

                    ${tubeNotes}

                </div>

            </div>

        `;
    
    
    // =================================================
    // 8. إضافة الكارت إلى الصفحة
    // =================================================
    
    // نضيف كارت التيوب الحالي إلى النص المجمع.
    tubesCardsHTML += tubeCard;
    
  }

  // بعد تجهيز كل البطاقات، نعرضها داخل الحاوية مرة واحدة.
  tubesContainer.innerHTML = tubesCardsHTML;
  
}


// =========================================================
// تشغيل التوليد التلقائي عند تحميل الصفحة
// =========================================================

// DOMContentLoaded يعني:
// انتظر حتى يتم تحميل HTML بالكامل.
//
// بعد اكتمال تحميل HTML
// نقوم بتشغيل renderTubes().
document.addEventListener(
  'DOMContentLoaded',
  function() {
    
    renderTubes();
    
  }
);

// ============================================================
// دالة إضافة بطاقة جهاز المجهر (Microscope)
// ============================================================

// ============================================================
// 🧪 ZAK LAB — نظام عرض الأجهزة الموحد
// ============================================================

function renderEquipmentCard(data, config) {

    // --------------------------------------------------------
    // التأكد من وجود الحاوية والبيانات
    // --------------------------------------------------------

    const container = document.getElementById(config.containerId || 'equipment-container');

    if (!container || !data) {
        return;
    }

    // --------------------------------------------------------
    // منع تكرار الجهاز
    // --------------------------------------------------------

    if (document.getElementById(config.id)) {
        return;
    }

    // --------------------------------------------------------
    // إنشاء البطاقة
    // --------------------------------------------------------

    const equipmentName = String(data.name || data.shortName || 'جهاز مختبري').trim();
    const arabicName = String(data.arabicName || '').trim();
    const functionality = String(data.functionality || '').trim();
    const theoreticalBasis = String(data.theoreticalBasis || '').trim();
    const warningNote = String(data.warningNote || '').trim();
    const imagePath = String(data.image || '').trim();
    const card = document.createElement('div');

    card.className = 'card-equipment';

    card.id = config.id;
    card.dataset.searchName = [equipmentName, arabicName, data.shortName]
        .concat(Array.isArray(data.aliases) ? data.aliases : [])
        .filter(Boolean)
        .join(' ');

    // --------------------------------------------------------
    // إنشاء قائمة الخطوات
    // --------------------------------------------------------

    const practicalSteps = Array.isArray(data.practicalSteps)
        ? data.practicalSteps
        : [];

    const stepsHTML = practicalSteps.map(step => `
        <li>${step}</li>
    `).join('');

    // --------------------------------------------------------
    // إنشاء قائمة أجزاء الجهاز
    // --------------------------------------------------------

    const parts = Array.isArray(data.parts)
        ? data.parts
        : [];

    const partsHTML = parts.map(part => `
        <li>
            📌
            <strong>${part.name}:</strong>
            ${part.function}
        </li>
    `).join('');

    // --------------------------------------------------------
    // إنشاء الـ Badges
    // --------------------------------------------------------

    const badgesHTML = (config.badges || []).map(badge => `
        <span class="badge-item">
            ${badge}
        </span>
    `).join('');

    // --------------------------------------------------------
    // محتوى البطاقة
    // --------------------------------------------------------

    card.innerHTML = `

        <!-- ============================================= -->
        <!-- صورة الجهاز -->
        <!-- ============================================= -->

        <div class="equipment-image-wrapper">

            ${imagePath ? `<img
                src="${imagePath}"
                alt="${equipmentName}"
                loading="lazy"
                decoding="async"
                onerror="
                    this.onerror=null;
                    this.parentElement.classList.add('image-unavailable');
                    this.remove();
                "
            >` : ''}

        </div>


        <!-- ============================================= -->
        <!-- اسم الجهاز -->
        <!-- ============================================= -->

        <h3>
            ${equipmentName}
        </h3>


        <!-- ============================================= -->
        <!-- الاسم العربي -->
        <!-- ============================================= -->

        <p class="equipment-arabic-name">
            ${arabicName}
        </p>


        <!-- ============================================= -->
        <!-- الوظيفة والمبدأ: يبقيان ظاهرين داخل البطاقة مثل العرض السابق -->
        <!-- ============================================= -->

        ${functionality ? `<p class="equipment-description">
            <strong>الوظيفة الطبية:</strong>
            ${functionality}
        </p>` : ''}

        ${theoreticalBasis ? `<p class="equipment-description">
            <strong>مبدأ العمل:</strong>
            ${theoreticalBasis}
        </p>` : ''}


        <!-- ============================================= -->
        <!-- خطوات التشغيل -->
        <!-- ============================================= -->

        <details>

            <summary>
                ⚙️ خطوات التشغيل والعمل المخبري
            </summary>

            <ol>
                ${stepsHTML}
            </ol>

        </details>


        <!-- ============================================= -->
        <!-- أجزاء الجهاز -->
        <!-- ============================================= -->

        <details>

            <summary>
                🧩 تشريح ووظائف الأجزاء (${parts.length} أجزاء)
            </summary>

            <ul>
                ${partsHTML}
            </ul>

        </details>


        <!-- ============================================= -->
        <!-- التحذير -->
        <!-- ============================================= -->

        ${warningNote ? `<div class="equipment-warning">

            ${warningNote}

        </div>` : ''}


        <!-- ============================================= -->
        <!-- الوسوم -->
        <!-- ============================================= -->

        <div class="equipment-badges">

            ${badgesHTML}

        </div>

    `;


    // --------------------------------------------------------
    // إضافة البطاقة إلى الحاوية
    // --------------------------------------------------------

    container.appendChild(card);
}


// ============================================================
// 🚀 تشغيل جميع الأجهزة
// ============================================================

function getZakLabDataRoot() {
    const candidates = [
        typeof zakLabData !== 'undefined' ? zakLabData : null,
        typeof data !== 'undefined' ? data : null,
        typeof DATA !== 'undefined' ? DATA : null,
        typeof appData !== 'undefined' ? appData : null,
        typeof window !== 'undefined' ? window.zakLabData : null,
        typeof window !== 'undefined' ? window.ZakLabData : null,
        typeof window !== 'undefined' ? window.DATA : null
    ];
    return candidates.find(function (value) {
        return value && typeof value === 'object';
    }) || null;
}

function getDataCollection(keys, fallback) {
    const root = getZakLabDataRoot();
    const names = Array.isArray(keys) ? keys : [keys];
    for (const name of names) {
        const value = root && root[name] !== undefined ? root[name] :
            (typeof window !== 'undefined' ? window[name] : undefined);
        if (Array.isArray(value)) { return value; }
        if (value && typeof value === 'object') {
            return Object.keys(value).map(function (key) {
                const item = value[key];
                return item && typeof item === 'object' ? Object.assign({ id: key }, item) : null;
            }).filter(Boolean);
        }
    }
    return Array.isArray(fallback) ? fallback : [];
}

function getEquipmentEntries() {
    const legacyCatalog = typeof equipmentCatalog !== 'undefined' && Array.isArray(equipmentCatalog)
        ? equipmentCatalog
        : [];
    const catalog = legacyCatalog.length
        ? legacyCatalog
        : getDataCollection(['equipmentCatalog', 'equipment', 'devices', 'laboratoryEquipment'], []);
    return catalog.map(function (entry, index) {
        const wrapped = entry && typeof entry === 'object' && entry.data && typeof entry.data === 'object';
        const item = wrapped ? entry.data : entry;
        if (!item || typeof item !== 'object') { return null; }
        return {
            data: item,
            id: (wrapped && entry.cardId) || item.cardId || item.id || ('equipment-item-' + (index + 1)),
            badges: (wrapped && entry.badges) || item.badges || item.tags || [],
            containerId: (wrapped && entry.containerId) || item.containerId || 'equipment-container'
        };
    }).filter(Boolean);
}

function renderAllEquipment() {
    const container = document.getElementById('equipment-container');
    if (!container) { return; }
    container.innerHTML = '';
    getEquipmentEntries().forEach(function (entry) {
        renderEquipmentCard(entry.data, {
            id: String(entry.id),
            containerId: entry.containerId,
            badges: Array.isArray(entry.badges) ? entry.badges : []
        });
    });
}


// ============================================================
// 🧰 تبويبا الأجهزة والأدوات
// ============================================================

// يحفظ التبويب الظاهر داخل قسم الأجهزة والأدوات.
let currentEquipmentToolsTab = 'devices';


function renderLabTools() {

    const container = document.getElementById('lab-tools-container');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    const directTools = typeof labToolsData !== 'undefined' && Array.isArray(labToolsData) ? labToolsData : [];
    const tools = directTools.length ? directTools : getDataCollection(['labToolsData', 'labTools', 'tools', 'laboratoryTools'], []);
    tools.forEach(function (tool, index) {
        if (!tool || typeof tool !== 'object') { return; }
        renderEquipmentCard(tool, {
            id: 'lab-tool-' + String(tool.id || index + 1),
            containerId: 'lab-tools-container',
            badges: Array.isArray(tool.badges) ? tool.badges : [tool.category || 'Lab Tool']
        });
    });
}


function switchEquipmentToolsTab(tab) {

    const nextTab = tab === 'tools' ? 'tools' : 'devices';
    currentEquipmentToolsTab = nextTab;

    const devicesContainer = document.getElementById('equipment-container');
    const toolsContainer = document.getElementById('lab-tools-container');

    if (devicesContainer) {
        devicesContainer.hidden = nextTab !== 'devices';
    }

    if (toolsContainer) {
        toolsContainer.hidden = nextTab !== 'tools';
    }

    document.querySelectorAll('[data-equipment-tab]').forEach(function (button) {
        const isActive = button.dataset.equipmentTab === nextTab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });

    if (nextTab === 'tools') {
        renderLabTools();
    } else {
        renderAllEquipment();
    }
}


// ============================================================
// تشغيل الأجهزة والأدوات بعد تحميل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    renderAllEquipment();
    renderLabTools();
    switchEquipmentToolsTab('devices');

});

/* ========================================================= */
/* تفاصيل تعليمية مضافة لبطاقات التحاليل V6                  */
/* تحافظ على الكروت والدوال القائمة وتظهر فقط عند وجود بيانات. */
/* ========================================================= */
function escapeV6TestLearningText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderV6TestLearningDetails(card) {
    if (!card || card.querySelector('.v6-test-learning-details') || typeof v6TestEducationData === 'undefined') {
        return;
    }

    const title = card.querySelector('h3');
    const fullName = title ? String(title.textContent || '').trim() : '';
    const detail = v6TestEducationData[fullName];

    if (!detail) {
        return;
    }

    const items = [
        ['❓ لماذا نطلبه؟', detail.whyTest],
        ['🔬 مبدأ التحليل', detail.principle],
        ['🩺 الأهمية السريرية', detail.clinicalSignificance],
        ['⚠️ قبل التحليل', detail.preAnalyticalNotes],
        ['🧠 ببساطة', detail.simpleExplanation],
        ['📊 ملاحظة عن القيم المرجعية', detail.rangeCaveat]
    ].filter(function (item) { return item[1]; }).map(function (item) {
        return '<section class="v6-test-learning-item"><h4>' + escapeV6TestLearningText(item[0]) + '</h4><p>' + escapeV6TestLearningText(item[1]) + '</p></section>';
    }).join('');

    if (!items) {
        return;
    }

    card.insertAdjacentHTML('beforeend',
        '<details class="v6-test-learning-details">' +
            '<summary>🎓 دليل الطالب: لماذا؟ كيف؟ وكيف تُفسَّر النتيجة؟</summary>' +
            '<div class="v6-test-learning-grid">' + items + '</div>' +
        '</details>'
    );
}

function hydrateV6TestLearningDetails(container) {
    if (!container) {
        return;
    }
    container.querySelectorAll('.test-card').forEach(renderV6TestLearningDetails);
}

document.addEventListener('DOMContentLoaded', function () {
    const testsContainer = document.getElementById('tests-container');
    if (!testsContainer || typeof MutationObserver === 'undefined') {
        return;
    }

    hydrateV6TestLearningDetails(testsContainer);
    const v6LearningObserver = new MutationObserver(function () {
        hydrateV6TestLearningDetails(testsContainer);
    });
    v6LearningObserver.observe(testsContainer, { childList: true, subtree: true });
});
/* ========================================================= */
/* دالة عرض كروت التحاليل داخل مجموعة أمراض الدم */
/* ========================================================= */

if (false) { // عارضات المجموعات المتكررة استبدلت بعارض موحد في نهاية الملف مع بقاء واجهات الدوال نفسها.
// هذا المتغير يخزن حالة مجموعة أمراض الدم:
// false = المجموعة مغلقة
// true  = المجموعة مفتوحة
let isHematologyOpen = false;


function renderHematologyGroup() {

    // نجيب العنصر الذي سوف نعرض بداخله التحاليل
    const container = document.getElementById('tests-container');

    // نجيب زر مجموعة أمراض الدم
    const groupBtn = document.querySelector('.group-btn');

    // إذا كان العنصر غير موجود أو بيانات أمراض الدم غير موجودة
    // نوقف الدالة مباشرة
    if (!container || typeof hematologyGroupData === 'undefined') {
        return;
    }


    /* ========================================================= */
    /* إذا كانت المجموعة مفتوحة */
    /* ========================================================= */

    if (isHematologyOpen === true) {

        // نحذف كل التحاليل الموجودة داخل الحاوية
        container.innerHTML = '';

        // نغير حالة المجموعة إلى مغلقة
        isHematologyOpen = false;


        // نتأكد أن الزر موجود
        if (groupBtn) {

            // نرجع لون الزر الأصلي
            groupBtn.style.background = '#e11d48';

            // نرجع النص الأصلي للزر
            groupBtn.innerHTML = '🩸 أمراض الدم (Hematology)';
        }

        // نوقف الدالة هنا
        return;
    }


    /* ========================================================= */
    /* إذا كانت المجموعة مغلقة -> نفتحها */
    /* ========================================================= */

    // هذا المتغير سوف يحتوي على HTML الخاص بالمجموعة
    let html = '';


    /* ========================================================= */
    /* إنشاء عنوان مجموعة أمراض الدم */
    /* ========================================================= */

    html += `
        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #e11d48;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="margin: 0; color: #9f1239;">
                ${hematologyGroupData.icon}
                ${hematologyGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${hematologyGroupData.description}
            </p>

            <span style="
                display: inline-block;
                margin-top: 8px;
                background: #ffe4e6;
                color: #9f1239;
                font-size: 0.8rem;
                padding: 2px 10px;
                border-radius: 12px;
                font-weight: bold;
            ">
                عدد التحاليل: ${hematologyGroupData.tests.length}
            </span>

        </div>

        <div class="tests-grid"
            style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 15px;
            ">
    `;


    /* ========================================================= */
    /* المرور على جميع تحاليل أمراض الدم */
    /* ========================================================= */

    // نستخدم for عادية حتى يكون المنطق واضح للمبتدئ
    for (let i = 0; i < hematologyGroupData.tests.length; i++) {

        // نأخذ التحليل الحالي من المصفوفة
        const test = hematologyGroupData.tests[i];


        /* ========================================================= */
        /* إنشاء قسم الارتفاع والانخفاض بشكل شرطي */
        /* ========================================================= */

        let significanceHTML = '';


        // ---------------------------------------------------------
        // 🔴 إذا كان هناك معلومات عن الارتفاع
        // ---------------------------------------------------------
        if (
            Array.isArray(test.high_significance) &&
            test.high_significance.length > 0
        ) {

            significanceHTML += `
                <details style="
                    background: rgba(225, 29, 72, 0.04);
                    padding: 6px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(225, 29, 72, 0.12);
                    font-size: 0.8rem;
                    margin-top: 8px;
                ">

                    <summary style="
                        font-weight: bold;
                        color: #e11d48;
                        cursor: pointer;
                    ">
                        🔴 أسباب ودلالات الارتفاع
                    </summary>

                    <ul style="
                        margin: 8px 0 0 0;
                        padding-right: 20px;
                        color: #475569;
                        line-height: 1.6;
                    ">
            `;


            // نعرض جميع أسباب الارتفاع
            for (let h = 0; h < test.high_significance.length; h++) {

                significanceHTML += `
                    <li style="margin-bottom: 5px;">
                        ${test.high_significance[h]}
                    </li>
                `;
            }


            significanceHTML += `
                    </ul>

                </details>
            `;
        }


        // ---------------------------------------------------------
        // 🔵 إذا كان هناك معلومات عن الانخفاض
        // ---------------------------------------------------------
        if (
            Array.isArray(test.low_significance) &&
            test.low_significance.length > 0
        ) {

            significanceHTML += `
                <details style="
                    background: rgba(2, 132, 199, 0.04);
                    padding: 6px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(2, 132, 199, 0.12);
                    font-size: 0.8rem;
                    margin-top: 8px;
                ">

                    <summary style="
                        font-weight: bold;
                        color: #0284c7;
                        cursor: pointer;
                    ">
                        🔵 أسباب ودلالات الانخفاض
                    </summary>

                    <ul style="
                        margin: 8px 0 0 0;
                        padding-right: 20px;
                        color: #475569;
                        line-height: 1.6;
                    ">
            `;


            // نعرض جميع أسباب الانخفاض
            for (let l = 0; l < test.low_significance.length; l++) {

                significanceHTML += `
                    <li style="margin-bottom: 5px;">
                        ${test.low_significance[l]}
                    </li>
                `;
            }


            significanceHTML += `
                    </ul>

                </details>
            `;
        }


        /* ========================================================= */
        /* إنشاء كرت التحليل */
        /* ========================================================= */

        html += `
            <div class="test-card"
               data-search-name="${test.fullName || ''} ${test.shortName || ''}"
                style="
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 10px;
                    padding: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                ">

                <div>

                    <!-- ========================================= -->
                    <!-- اسم التحليل والاختصار -->
                    <!-- ========================================= -->

                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #f1f5f9;
                        padding-bottom: 8px;
                        margin-bottom: 10px;
                    ">

                        <!-- اختصار التحليل -->
                        <span style="
                            background: #0284c7;
                            color: white;
                            padding: 3px 8px;
                            border-radius: 6px;
                            font-weight: bold;
                            font-size: 0.85rem;
                        ">
                            ${test.shortName}
                        </span>

                        <!-- الاسم الكامل للتحليل -->
                        <h3 style="
                            margin: 0;
                            font-size: 1.05rem;
                            color: #1e293b;
                            text-align: right;
                        ">
                            ${test.fullName}
                        </h3>

                    </div>


                    <!-- ========================================= -->
                    <!-- وظيفة التحليل -->
                    <!-- ========================================= -->

                    <p style="
                        font-size: 0.85rem;
                        color: #334155;
                        line-height: 1.4;
                        margin-bottom: 10px;
                    ">
                        <strong>الوظيفة:</strong>
                        ${test.functionality}
                    </p>


                    <!-- ========================================= -->
                    <!-- نوع العينة ونوع التيوب -->
                    <!-- ========================================= -->

                    <div style="
                        background: #f8fafc;
                        padding: 8px;
                        border-radius: 6px;
                        font-size: 0.8rem;
                        margin-bottom: 10px;
                    ">

                        <div style="margin-bottom: 4px;">
                            💉
                            <strong>نوع العينة:</strong>
                            ${test.sampleType}
                        </div>

                        <div>
                            🧪
                            <strong>نوع التيوب:</strong>
                            ${test.tubeType}
                        </div>

                    </div>


                    <!-- ========================================= -->
                    <!-- القيم الطبيعية -->
                    <!-- ========================================= -->

                    <details style="
                        background: rgba(2, 132, 199, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(2, 132, 199, 0.1);
                        font-size: 0.8rem;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #0284c7;
                            cursor: pointer;
                        ">
                            📊 القيم الطبيعية (Normal Ranges)
                        </summary>

                        <ul style="
                            list-style: none;
                            padding-right: 0;
                            margin: 6px 0 0 0;
                            display: grid;
                            gap: 4px;
                            color: #475569;
                        ">

                            <li>
                                👨
                                <strong>الرجال:</strong>
                                ${test.referenceRanges.male}
                            </li>

                            <li>
                                👩
                                <strong>النساء:</strong>
                                ${test.referenceRanges.female}
                            </li>

                            <li>
                                👶
                                <strong>الأطفال:</strong>
                                ${test.referenceRanges.children}
                            </li>

                        </ul>

                    </details>


                    <!-- ========================================= -->
                    <!-- أسباب الارتفاع والانخفاض -->
                    <!-- يظهر فقط إذا كانت البيانات موجودة -->
                    <!-- ========================================= -->

                    ${significanceHTML}

                </div>

            </div>
        `;
    }


    // نغلق شبكة الكروت
    html += `
        </div>
    `;


    /* ========================================================= */
    /* عرض HTML داخل الصفحة */
    /* ========================================================= */

    container.innerHTML = html;


    // الآن أصبحت المجموعة مفتوحة
    isHematologyOpen = true;


    /* ========================================================= */
    /* تغيير شكل الزر */
    /* ========================================================= */

    if (groupBtn) {

        // نغير لون الزر حتى يعرف المستخدم أن المجموعة مفتوحة
        groupBtn.style.background = '#475569';

        // نغير النص إلى إغلاق
        groupBtn.innerHTML = '✖ إغلاق تحاليل أمراض الدم';
    }

}


/* ========================================================= */
/* دالة عرض كروت الكيمياء السريرية */
/* ========================================================= */

// false = مغلقة
// true = مفتوحة
let isChemistryOpen = false;


function renderClinicalChemistryGroup() {

    // العنصر الذي سوف نعرض داخله التحاليل
    const container = document.getElementById('tests-container');

    // زر الكيمياء السريرية
    const chemBtn = document.getElementById('chem-btn');


    // نتأكد من وجود العناصر والبيانات
    if (!container || typeof clinicalChemistryGroupData === 'undefined') {
        return;
    }


    /* ========================================================= */
    /* إغلاق المجموعة إذا كانت مفتوحة */
    /* ========================================================= */

    if (isChemistryOpen === true) {

        container.innerHTML = '';

        isChemistryOpen = false;


        if (chemBtn) {

            chemBtn.style.background = '#0284c7';

            chemBtn.innerHTML =
                '🧪 الكيمياء السريرية (Clinical Chemistry)';
        }

        return;
    }


    /* ========================================================= */
    /* فتح المجموعة */
    /* ========================================================= */

    let html = '';


    /* ========================================================= */
    /* عنوان المجموعة */
    /* ========================================================= */

    html += `
        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #0284c7;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #0369a1;
            ">
                ${clinicalChemistryGroupData.icon}
                ${clinicalChemistryGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${clinicalChemistryGroupData.description}
            </p>

            <span style="
                display: inline-block;
                margin-top: 8px;
                background: #e0f2fe;
                color: #0369a1;
                font-size: 0.8rem;
                padding: 2px 10px;
                border-radius: 12px;
                font-weight: bold;
            ">
                عدد المجموعات:
                ${clinicalChemistryGroupData.subGroups.length}
            </span>

        </div>
    `;


    /* ========================================================= */
    /* المرور على المجموعات الفرعية */
    /* ========================================================= */

    for (
        let i = 0;
        i < clinicalChemistryGroupData.subGroups.length;
        i++
    ) {

        const subGroup =
            clinicalChemistryGroupData.subGroups[i];


        /* ========================================================= */
        /* عنوان المجموعة الفرعية */
        /* ========================================================= */

        html += `
            <div style="margin-bottom: 25px;">

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        /* ========================================================= */
        /* المرور على تحاليل المجموعة */
        /* ========================================================= */

        for (let j = 0; j < subGroup.tests.length; j++) {

            const test = subGroup.tests[j];


            /* ========================================================= */
            /* إنشاء قسم الارتفاع والانخفاض */
            /* ========================================================= */

            let significanceHTML = '';


            // =====================================================
            // 🔴 الارتفاع
            // =====================================================

            if (
                test.highSignificance &&
                String(test.highSignificance).trim() !== ''
            ) {

                significanceHTML += `
                    <details style="
                        background: rgba(225, 29, 72, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid
                            rgba(225, 29, 72, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #e11d48;
                            cursor: pointer;
                        ">
                            🔴 أسباب ودلالات الارتفاع
                        </summary>

                        <div style="
                            margin-top: 8px;
                            padding-right: 8px;
                            color: #475569;
                            line-height: 1.6;
                        ">
                            ${test.highSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // 🔵 الانخفاض
            // =====================================================

            if (
                test.lowSignificance &&
                String(test.lowSignificance).trim() !== ''
            ) {

                significanceHTML += `
                    <details style="
                        background: rgba(2, 132, 199, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid
                            rgba(2, 132, 199, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #0284c7;
                            cursor: pointer;
                        ">
                            🔵 أسباب ودلالات الانخفاض
                        </summary>

                        <div style="
                            margin-top: 8px;
                            padding-right: 8px;
                            color: #475569;
                            line-height: 1.6;
                        ">
                            ${test.lowSignificance}
                        </div>

                    </details>
                `;
            }


            /* ========================================================= */
            /* إنشاء كرت التحليل */
            /* ========================================================= */

            html += `
                <div class="test-card"
                   data-search-name="${test.fullName || ''} ${test.shortName || ''}"
                    style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow:
                            0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- ========================================= -->
                        <!-- اسم التحليل والاختصار -->
                        <!-- ========================================= -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom:
                                1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">

                            <span style="
                                background: #0284c7;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>

                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- ========================================= -->
                        <!-- وظيفة التحليل -->
                        <!-- ========================================= -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- ========================================= -->
                        <!-- نوع العينة والتيوب -->
                        <!-- ========================================= -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>

                            <div>
                                🧪
                                <strong>نوع التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- ========================================= -->
                        <!-- القيم الطبيعية -->
                        <!-- ========================================= -->

                        <details style="
                            background:
                                rgba(2, 132, 199, 0.04);
                            padding: 6px 8px;
                            border-radius: 6px;
                            border:
                                1px solid
                                rgba(2, 132, 199, 0.1);
                            font-size: 0.8rem;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #0284c7;
                                cursor: pointer;
                            ">
                                📊 القيم الطبيعية
                                (Normal Ranges)
                            </summary>

                            <ul style="
                                list-style: none;
                                padding-right: 0;
                                margin: 6px 0 0 0;
                                display: grid;
                                gap: 4px;
                                color: #475569;
                            ">

                                <li>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </li>

                                <li>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </li>

                                <li>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </li>

                            </ul>

                        </details>


                        <!-- ========================================= -->
                        <!-- 🔴 الارتفاع + 🔵 الانخفاض -->
                        <!-- ========================================= -->

                        ${significanceHTML}

                    </div>

                </div>
            `;
        }


        /* ========================================================= */
        /* إغلاق شبكة التحاليل */
        /* ========================================================= */

        html += `
                </div>
            </div>
        `;
    }


    /* ========================================================= */
    /* عرض المحتوى */
    /* ========================================================= */

    container.innerHTML = html;


    // المجموعة أصبحت مفتوحة
    isChemistryOpen = true;


    /* ========================================================= */
    /* تغيير شكل الزر */
    /* ========================================================= */

    if (chemBtn) {

        chemBtn.style.background = '#475569';

        chemBtn.innerHTML =
            '✖ إغلاق تحاليل الكيمياء السريرية';
    }

}
/* ========================================================= */
/* دالة عرض كروت التجلط وتخثر الدم */
/* ========================================================= */

// false = مغلقة
// true = مفتوحة
let isCoagulationOpen = false;


function renderCoagulationGroup() {

    // العنصر الذي سوف نعرض داخله التحاليل
    const container = document.getElementById('tests-container');

    // زر مجموعة التجلط
    const coagBtn = document.getElementById('coag-btn');


    // التأكد من وجود العنصر والبيانات
    if (!container || typeof coagulationGroupData === 'undefined') {
        return;
    }


    /* ========================================================= */
    /* إغلاق المجموعة إذا كانت مفتوحة */
    /* ========================================================= */

    if (isCoagulationOpen === true) {

        // مسح التحاليل من الصفحة
        container.innerHTML = '';

        // تغيير الحالة إلى مغلقة
        isCoagulationOpen = false;


        // التأكد من وجود الزر
        if (coagBtn) {

            // إعادة اللون الأصلي
            coagBtn.style.background = '#2563eb';

            // إعادة النص الأصلي
            coagBtn.innerHTML = '🩸 التجلط وتخثر الدم (Coagulation)';
        }

        return;
    }


    /* ========================================================= */
    /* فتح مجموعة التجلط */
    /* ========================================================= */

    let html = '';


    /* ========================================================= */
    /* عنوان مجموعة التجلط */
    /* ========================================================= */

    html += `
        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #2563eb;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #1d4ed8;
            ">
                ${coagulationGroupData.icon}
                ${coagulationGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${coagulationGroupData.description}
            </p>

        </div>
    `;


    /* ========================================================= */
    /* المرور على المجموعات الفرعية */
    /* ========================================================= */

    for (
        let i = 0;
        i < coagulationGroupData.subGroups.length;
        i++
    ) {

        // نأخذ المجموعة الفرعية الحالية
        const subGroup = coagulationGroupData.subGroups[i];


        /* ========================================================= */
        /* إنشاء عنوان المجموعة الفرعية */
        /* ========================================================= */

        html += `
            <div style="margin-bottom: 25px;">

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        /* ========================================================= */
        /* المرور على تحاليل المجموعة الفرعية */
        /* ========================================================= */

        for (let j = 0; j < subGroup.tests.length; j++) {

            // نأخذ التحليل الحالي
            const test = subGroup.tests[j];


            /* ========================================================= */
            /* إنشاء قسم الارتفاع والانخفاض بشكل شرطي */
            /* ========================================================= */

            let significanceHTML = '';


            // ---------------------------------------------------------
            // 🔴 إذا كان هناك معلومات عن الارتفاع
            // ---------------------------------------------------------

            if (
                Array.isArray(test.highsignificance) &&
                test.highsignificance.length > 0
            ) {

                significanceHTML += `
                    <details style="
                        background: rgba(225, 29, 72, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(225, 29, 72, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #e11d48;
                            cursor: pointer;
                        ">
                            🔴 أسباب ودلالات الارتفاع
                        </summary>

                        <ul style="
                            margin: 8px 0 0 0;
                            padding-right: 20px;
                            color: #475569;
                            line-height: 1.6;
                        ">
                `;


                // عرض جميع أسباب الارتفاع
                for (
                    let h = 0;
                    h < test.highsignificance.length;
                    h++
                ) {

                    significanceHTML += `
                        <li style="margin-bottom: 5px;">
                            ${test.highsignificance[h]}
                        </li>
                    `;
                }


                significanceHTML += `
                        </ul>

                    </details>
                `;
            }


            // ---------------------------------------------------------
            // 🔵 إذا كان هناك معلومات عن الانخفاض
            // ---------------------------------------------------------

            if (
                Array.isArray(test.lowsignificance) &&
                test.lowsignificance.length > 0
            ) {

                significanceHTML += `
                    <details style="
                        background: rgba(2, 132, 199, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(2, 132, 199, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #0284c7;
                            cursor: pointer;
                        ">
                            🔵 أسباب ودلالات الانخفاض
                        </summary>

                        <ul style="
                            margin: 8px 0 0 0;
                            padding-right: 20px;
                            color: #475569;
                            line-height: 1.6;
                        ">
                `;


                // عرض جميع أسباب الانخفاض
                for (
                    let l = 0;
                    l < test.lowsignificance.length;
                    l++
                ) {

                    significanceHTML += `
                        <li style="margin-bottom: 5px;">
                            ${test.lowsignificance[l]}
                        </li>
                    `;
                }


                significanceHTML += `
                        </ul>

                    </details>
                `;
            }


            /* ========================================================= */
            /* إنشاء كرت التحليل */
            /* ========================================================= */

            html += `
                <div class="test-card"
                    data-search-name="${test.fullName || ''} ${test.shortName || ''}" style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>

                        <!-- ========================================= -->
                        <!-- اسم التحليل والاختصار -->
                        <!-- ========================================= -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">

                            <!-- اختصار التحليل -->
                            <span style="
                                background: #2563eb;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>

                            <!-- الاسم الكامل للتحليل -->
                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- ========================================= -->
                        <!-- وظيفة التحليل -->
                        <!-- ========================================= -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- ========================================= -->
                        <!-- نوع العينة والتيوب -->
                        <!-- ========================================= -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>

                            <div>
                                🧪
                                <strong>نوع التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- ========================================= -->
                        <!-- القيم الطبيعية -->
                        <!-- ========================================= -->

                        <details style="
                            background: rgba(37, 99, 235, 0.04);
                            padding: 6px 8px;
                            border-radius: 6px;
                            border: 1px solid rgba(37, 99, 235, 0.1);
                            font-size: 0.8rem;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #2563eb;
                                cursor: pointer;
                            ">
                                📊 القيم الطبيعية (Normal Ranges)
                            </summary>

                            <ul style="
                                list-style: none;
                                padding-right: 0;
                                margin: 6px 0 0 0;
                                display: grid;
                                gap: 4px;
                                color: #475569;
                            ">

                                <li>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </li>

                                <li>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </li>

                                <li>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </li>

                            </ul>

                        </details>


                        <!-- ========================================= -->
                        <!-- أسباب ودلالات الارتفاع والانخفاض -->
                        <!-- تظهر فقط عند وجود البيانات -->
                        <!-- ========================================= -->

                        ${significanceHTML}

                    </div>

                </div>
            `;
        }


        /* ========================================================= */
        /* إغلاق شبكة الكروت والمجموعة الفرعية */
        /* ========================================================= */

        html += `
                </div>
            </div>
        `;
    }


    /* ========================================================= */
    /* عرض المحتوى */
    /* ========================================================= */

    container.innerHTML = html;


    // تغيير حالة المجموعة إلى مفتوحة
    isCoagulationOpen = true;


    /* ========================================================= */
    /* تغيير شكل الزر */
    /* ========================================================= */

    if (coagBtn) {

        // تغيير لون الزر
        coagBtn.style.background = '#475569';

        // تغيير النص
        coagBtn.innerHTML = '✖ إغلاق تحاليل التجلط وتخثر الدم';
    }

}

// =========================================================
// مجموعة المناعة والأمصال
// =========================================================

// هذا المتغير يخزن حالة المجموعة:
// false = المجموعة مغلقة
// true = المجموعة مفتوحة
let isImmunologyOpen = false;


// =========================================================
// دالة عرض تحاليل المناعة والأمصال
// =========================================================

function renderImmunologyGroup() {

    // العنصر الذي ستظهر داخله التحاليل
    const container = document.getElementById('tests-container');

    // زر المناعة والأمصال
    const immunoBtn = document.getElementById('immuno-btn');


    // =========================================================
    // التأكد من وجود العناصر والبيانات
    // =========================================================

    if (!container || typeof immunologyGroupData === 'undefined') {
        return;
    }


    // =========================================================
    // إغلاق المجموعة إذا كانت مفتوحة
    // =========================================================

    if (isImmunologyOpen === true) {

        // مسح التحاليل من الشاشة
        container.innerHTML = '';

        // تغيير الحالة إلى مغلقة
        isImmunologyOpen = false;


        // إعادة الزر إلى حالته الأصلية
        if (immunoBtn) {

            immunoBtn.style.background = '#7c3aed';

            immunoBtn.innerHTML =
                '🛡️ المناعة والأمصال (Immunology & Serology)';
        }

        return;
    }


    // =========================================================
    // فتح المجموعة
    // =========================================================

    let html = `

        <!-- =====================================================
             رأس مجموعة المناعة والأمصال
             ===================================================== -->

        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #7c3aed;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #6d28d9;
            ">
                ${immunologyGroupData.icon}
                ${immunologyGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${immunologyGroupData.description}
            </p>

        </div>
    `;


    // =========================================================
    // المرور على المجموعات الفرعية
    // =========================================================

    immunologyGroupData.subGroups.forEach(function(subGroup) {

        html += `

            <div style="margin-bottom: 25px;">

                <!-- عنوان المجموعة الفرعية -->

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>


                <!-- شبكة التحاليل -->

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        // =========================================================
        // المرور على تحاليل المجموعة الفرعية
        // =========================================================

        subGroup.tests.forEach(function(test) {


            // =====================================================
            // دلالات الزيادة
            //
            // تعتمد على:
            // test.highSignificance
            //
            // إذا الحقل غير موجود أو فارغ:
            // لا يظهر صندوق دلالات الزيادة
            // =====================================================

            let increasedHTML = '';

            if (
                test.highSignificance &&
                test.highSignificance.trim() !== ''
            ) {

                increasedHTML = `

                    <details style="
                        background: rgba(220, 38, 38, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(220, 38, 38, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #dc2626;
                            cursor: pointer;
                        ">
                            📈 دلالات الزيادة
                        </summary>


                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                        ">
                            ${test.highSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // دلالات النقصان
            //
            // تعتمد على:
            // test.lowSignificance
            //
            // إذا الحقل غير موجود أو فارغ:
            // لا يظهر صندوق دلالات النقصان
            // =====================================================

            let decreasedHTML = '';

            if (
                test.lowSignificance &&
                test.lowSignificance.trim() !== ''
            ) {

                decreasedHTML = `

                    <details style="
                        background: rgba(37, 99, 235, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(37, 99, 235, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #2563eb;
                            cursor: pointer;
                        ">
                            📉 دلالات النقصان
                        </summary>


                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                        ">
                            ${test.lowSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // إنشاء كرت التحليل
            // =====================================================

            html += `

                <div class="test-card"
                   data-search-name="${test.fullName || ''} ${test.shortName || ''}"
                    style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- =====================================
                             اسم التحليل والاختصار
                             ===================================== -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">


                            <!-- اختصار التحليل -->

                            <span style="
                                background: #7c3aed;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>


                            <!-- الاسم الكامل -->

                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- =====================================
                             وظيفة التحليل
                             ===================================== -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- =====================================
                             نوع العينة والتيوب
                             ===================================== -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>


                            <div>
                                🧪
                                <strong>نوع التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- =====================================
                             القيم الطبيعية
                             ===================================== -->

                        <details style="
                            background: rgba(124, 58, 237, 0.04);
                            padding: 6px 8px;
                            border-radius: 6px;
                            border: 1px solid rgba(124, 58, 237, 0.1);
                            font-size: 0.8rem;
                        ">


                            <summary style="
                                font-weight: bold;
                                color: #7c3aed;
                                cursor: pointer;
                            ">
                                📊 القيم الطبيعية (Normal Ranges)
                            </summary>


                            <ul style="
                                list-style: none;
                                padding-right: 0;
                                margin: 6px 0 0 0;
                                display: grid;
                                gap: 4px;
                                color: #475569;
                            ">


                                <!-- الرجال -->

                                <li>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </li>


                                <!-- النساء -->

                                <li>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </li>


                                <!-- الأطفال -->

                                <li>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </li>

                            </ul>

                        </details>


                        <!-- =====================================
                             دلالات الزيادة
                             تظهر فقط إذا كان
                             highSignificance موجود
                             ===================================== -->

                        ${increasedHTML}


                        <!-- =====================================
                             دلالات النقصان
                             تظهر فقط إذا كان
                             lowSignificance موجود
                             ===================================== -->

                        ${decreasedHTML}


                    </div>

                </div>
            `;
        });


        // =========================================================
        // إغلاق شبكة التحاليل والمجموعة الفرعية
        // =========================================================

        html += `

                </div>

            </div>
        `;
    });


    // =========================================================
    // عرض المحتوى على الصفحة
    // =========================================================

    container.innerHTML = html;


    // تغيير حالة المجموعة إلى مفتوحة
    isImmunologyOpen = true;


    // =========================================================
    // تغيير شكل الزر
    // =========================================================

    if (immunoBtn) {

        // تغيير اللون
        immunoBtn.style.background = '#475569';

        // تغيير النص
        immunoBtn.innerHTML =
            '✖ إغلاق تحاليل المناعة والأمصال';
    }

}
// =========================================================
// مجموعة الهرمونات والغدد الصماء
// =========================================================

// false = مغلقة
// true = مفتوحة
let isHormonesOpen = false;


// =========================================================
// دالة عرض تحاليل الهرمونات
// =========================================================

function renderHormonesGroup() {

    // الحصول على مكان عرض التحاليل
    const container = document.getElementById('tests-container');

    // الحصول على زر الهرمونات
    const hormoneBtn = document.getElementById('hormone-btn');


    // =========================================================
    // التأكد من وجود العناصر والبيانات
    // =========================================================

    if (!container || typeof hormonesGroupData === 'undefined') {
        return;
    }


    // =========================================================
    // إذا كانت المجموعة مفتوحة نغلقها
    // =========================================================

    if (isHormonesOpen === true) {

        // مسح التحاليل
        container.innerHTML = '';

        // تغيير الحالة إلى مغلقة
        isHormonesOpen = false;


        // إعادة الزر إلى وضعه الطبيعي
        if (hormoneBtn) {

            hormoneBtn.style.background = '#059669';

            hormoneBtn.innerHTML =
                '🧬 الهرمونات والغدد الصماء (Hormones)';
        }


        return;
    }


    // =========================================================
    // بناء واجهة مجموعة الهرمونات
    // =========================================================

    let html = `

        <!-- =====================================================
             رأس مجموعة الهرمونات
             ===================================================== -->

        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #059669;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #047857;
            ">
                ${hormonesGroupData.icon}
                ${hormonesGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${hormonesGroupData.description}
            </p>

        </div>
    `;


    // =========================================================
    // المرور على المجموعات الفرعية
    // =========================================================

    hormonesGroupData.subGroups.forEach(function(subGroup) {

        html += `

            <div style="margin-bottom: 25px;">

                <!-- عنوان المجموعة الفرعية -->

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>


                <!-- شبكة التحاليل -->

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        // =========================================================
        // المرور على كل تحليل
        // =========================================================

        subGroup.tests.forEach(function(test) {


            // =====================================================
            // دلالات الارتفاع
            // تستخدم highSignificance من JSON
            // تظهر فقط إذا كانت موجودة
            // =====================================================

            let highSignificanceHTML = '';

            if (
                test.highSignificance &&
                typeof test.highSignificance === 'string' &&
                test.highSignificance.trim() !== ''
            ) {

                highSignificanceHTML = `

                    <details style="
                        background: rgba(220, 38, 38, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(220, 38, 38, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #dc2626;
                            cursor: pointer;
                        ">
                            📈 دلالات الارتفاع
                        </summary>

                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.highSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // دلالات الانخفاض
            // تستخدم lowSignificance من JSON
            // تظهر فقط إذا كانت موجودة
            // =====================================================

            let lowSignificanceHTML = '';

            if (
                test.lowSignificance &&
                typeof test.lowSignificance === 'string' &&
                test.lowSignificance.trim() !== ''
            ) {

                lowSignificanceHTML = `

                    <details style="
                        background: rgba(37, 99, 235, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(37, 99, 235, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #2563eb;
                            cursor: pointer;
                        ">
                            📉 دلالات الانخفاض
                        </summary>

                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.lowSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // إنشاء كرت التحليل
            // =====================================================

            html += `

                <div class="test-card"
                    data-search-name="${test.fullName || ''} ${test.shortName || ''}" style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- =====================================
                             اسم التحليل والاختصار
                             ===================================== -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">

                            <!-- الاختصار -->

                            <span style="
                                background: #059669;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>


                            <!-- الاسم الكامل -->

                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- =====================================
                             وظيفة التحليل
                             ===================================== -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- =====================================
                             نوع العينة والتيوب
                             ===================================== -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <!-- نوع العينة -->

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>


                            <!-- نوع التيوب -->

                            <div>
                                🧪
                                <strong>نوع التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- =====================================
                             القيم الطبيعية
                             ===================================== -->

                        <details style="
                            background: rgba(5, 150, 105, 0.04);
                            padding: 6px 8px;
                            border-radius: 6px;
                            border: 1px solid rgba(5, 150, 105, 0.1);
                            font-size: 0.8rem;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #059669;
                                cursor: pointer;
                            ">
                                📊 القيم الطبيعية (Normal Ranges)
                            </summary>


                            <ul style="
                                list-style: none;
                                padding-right: 0;
                                margin: 6px 0 0 0;
                                display: grid;
                                gap: 4px;
                                color: #475569;
                            ">


                                <!-- الرجال -->

                                <li>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </li>


                                <!-- النساء -->

                                <li>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </li>


                                <!-- الأطفال -->

                                <li>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </li>

                            </ul>

                        </details>


                        <!-- =====================================
                             دلالات الارتفاع
                             ===================================== -->

                        ${highSignificanceHTML}


                        <!-- =====================================
                             دلالات الانخفاض
                             ===================================== -->

                        ${lowSignificanceHTML}

                    </div>

                </div>
            `;
        });


        // =========================================================
        // إغلاق شبكة التحاليل
        // =========================================================

        html += `

                </div>

            </div>
        `;
    });


    // =========================================================
    // عرض المحتوى على الصفحة
    // =========================================================

    container.innerHTML = html;


    // تغيير الحالة إلى مفتوحة
    isHormonesOpen = true;


    // =========================================================
    // تغيير شكل الزر بعد الفتح
    // =========================================================

    if (hormoneBtn) {

        hormoneBtn.style.background = '#475569';

        hormoneBtn.innerHTML =
            '✖ إغلاق تحاليل الهرمونات والغدد';
    }

}

// =========================================================
// مجموعة بنك الدم وتوافق الفصائل
// =========================================================
let isBloodBankOpen = false;


// =========================================================
// 🩸 دالة عرض تحاليل بنك الدم
// =========================================================

function renderBloodBankGroup() {

    // الحصول على مكان عرض التحاليل
    const container = document.getElementById('tests-container');

    // الحصول على زر بنك الدم
    const bloodBankBtn = document.getElementById('bloodbank-btn');


    // =========================================================
    // التأكد من وجود العناصر والبيانات
    // =========================================================

    if (!container || typeof bloodBankGroupData === 'undefined') {
        return;
    }


    // =========================================================
    // إذا كانت المجموعة مفتوحة نغلقها
    // =========================================================

    if (isBloodBankOpen === true) {

        // مسح التحاليل
        container.innerHTML = '';

        // تغيير الحالة إلى مغلقة
        isBloodBankOpen = false;


        // إعادة الزر إلى وضعه الطبيعي
        if (bloodBankBtn) {

            bloodBankBtn.style.background = '#991b1b';

            bloodBankBtn.innerHTML =
                '🩸 بنك الدم وتوافق الفصائل (Blood Bank)';
        }


        return;
    }


    // =========================================================
    // بناء واجهة مجموعة بنك الدم
    // =========================================================

    let html = `

        <!-- =====================================================
             رأس مجموعة بنك الدم
             ===================================================== -->

        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #991b1b;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #991b1b;
            ">
                ${bloodBankGroupData.icon}
                ${bloodBankGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${bloodBankGroupData.description}
            </p>

        </div>
    `;


    // =========================================================
    // المرور على المجموعات الفرعية
    // =========================================================

    bloodBankGroupData.subGroups.forEach(function(subGroup) {

        html += `

            <div style="
                margin-bottom: 25px;
            ">

                <!-- =================================================
                     عنوان المجموعة الفرعية
                     ================================================= -->

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>


                <!-- =================================================
                     شبكة التحاليل
                     ================================================= -->

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        // =========================================================
        // المرور على كل تحليل
        // =========================================================

        subGroup.tests.forEach(function(test) {


            // =====================================================
            // 🟢 القيم الطبيعية
            // تظهر كزر Details
            // =====================================================

            let normalRangesHTML = '';

            if (
                test.referenceRanges &&
                (
                    test.referenceRanges.male ||
                    test.referenceRanges.female ||
                    test.referenceRanges.children
                )
            ) {

                normalRangesHTML = `

                    <details style="
                        background: rgba(5, 150, 105, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(5, 150, 105, 0.1);
                        font-size: 0.8rem;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #059669;
                            cursor: pointer;
                        ">
                            📊 القيم الطبيعية
                            (Normal Ranges)
                        </summary>


                        <ul style="
                            list-style: none;
                            padding-right: 0;
                            margin: 6px 0 0 0;
                            display: grid;
                            gap: 4px;
                            color: #475569;
                        ">


                            <!-- الرجال -->

                            <li>
                                👨
                                <strong>الرجال:</strong>
                                ${test.referenceRanges.male || "لا توجد بيانات"}
                            </li>


                            <!-- النساء -->

                            <li>
                                👩
                                <strong>النساء:</strong>
                                ${test.referenceRanges.female || "لا توجد بيانات"}
                            </li>


                            <!-- الأطفال -->

                            <li>
                                👶
                                <strong>الأطفال:</strong>
                                ${test.referenceRanges.children || "لا توجد بيانات"}
                            </li>


                        </ul>

                    </details>
                `;
            }


            // =====================================================
            // 🔺 دلالات الارتفاع
            // =====================================================

            let highSignificanceHTML = '';

            if (
                test.highSignificance &&
                typeof test.highSignificance === 'string' &&
                test.highSignificance.trim() !== ''
            ) {

                highSignificanceHTML = `

                    <details style="
                        background: rgba(220, 38, 38, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(220, 38, 38, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #dc2626;
                            cursor: pointer;
                        ">
                            📈 دلالات الارتفاع
                        </summary>


                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.highSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // 🔻 دلالات الانخفاض
            // =====================================================

            let lowSignificanceHTML = '';

            if (
                test.lowSignificance &&
                typeof test.lowSignificance === 'string' &&
                test.lowSignificance.trim() !== ''
            ) {

                lowSignificanceHTML = `

                    <details style="
                        background: rgba(37, 99, 235, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(37, 99, 235, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #2563eb;
                            cursor: pointer;
                        ">
                            📉 دلالات الانخفاض
                        </summary>


                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.lowSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // 🧪 إنشاء كرت التحليل
            // =====================================================

            html += `

                <div class="test-card"
                    data-search-name="${test.fullName || ''} ${test.shortName || ''}" style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- =====================================
                             اسم التحليل والاختصار
                             ===================================== -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">


                            <!-- الاختصار -->

                            <span style="
                                background: #991b1b;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>


                            <!-- الاسم الكامل -->

                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- =====================================
                             وظيفة التحليل
                             ===================================== -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">

                            <strong>الوظيفة:</strong>

                            ${test.functionality}

                        </p>


                        <!-- =====================================
                             نوع العينة والتيوب / الكيس
                             ===================================== -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">


                            <!-- نوع العينة -->

                            <div style="
                                margin-bottom: 4px;
                            ">

                                💉

                                <strong>
                                    نوع العينة:
                                </strong>

                                ${test.sampleType}

                            </div>


                            <!-- نوع التيوب -->

                            <div>

                                🧪

                                <strong>
                                    نوع التيوب / الكيس:
                                </strong>

                                ${test.tubeType}

                            </div>

                        </div>


                        <!-- =====================================
                             🟢 القيم الطبيعية
                             ===================================== -->

                        ${normalRangesHTML}


                        <!-- =====================================
                             🔺 دلالات الارتفاع
                             ===================================== -->

                        ${highSignificanceHTML}


                        <!-- =====================================
                             🔻 دلالات الانخفاض
                             ===================================== -->

                        ${lowSignificanceHTML}


                    </div>

                </div>

            `;
        });


        // =========================================================
        // إغلاق شبكة التحاليل
        // =========================================================

        html += `

                </div>

            </div>

        `;
    });


    // =========================================================
    // عرض المحتوى على الصفحة
    // =========================================================

    container.innerHTML = html;


    // =========================================================
    // تغيير الحالة إلى مفتوحة
    // =========================================================

    isBloodBankOpen = true;


    // =========================================================
    // تغيير شكل الزر بعد الفتح
    // =========================================================

    if (bloodBankBtn) {

        bloodBankBtn.style.background = '#475569';

        bloodBankBtn.innerHTML =
            '✖ إغلاق فحوصات بنك الدم';

    }

}
// =========================================================
// مجموعة علم الفيروسات
// =========================================================
let isVirologyOpen = false;


// =========================================================
// دالة عرض تحاليل الفيروسات
// =========================================================

function renderVirologyGroup() {

    // الحصول على مكان عرض التحاليل
    const container = document.getElementById('tests-container');

    // الحصول على زر الفيروسات
    const virologyBtn = document.getElementById('virology-btn');


    // =========================================================
    // التأكد من وجود العناصر والبيانات
    // =========================================================

    if (!container || typeof virologyGroupData === 'undefined') {
        return;
    }


    // =========================================================
    // إذا كانت المجموعة مفتوحة نغلقها
    // =========================================================

    if (isVirologyOpen === true) {

        // مسح المحتوى
        container.innerHTML = '';

        // تغيير الحالة إلى مغلقة
        isVirologyOpen = false;


        // إعادة الزر إلى وضعه الطبيعي
        if (virologyBtn) {

            virologyBtn.style.background = '#0d9488';

            virologyBtn.innerHTML =
                '🦠 علم الفيروسات (Virology)';
        }


        return;
    }


    // =========================================================
    // بناء واجهة مجموعة الفيروسات
    // =========================================================

    let html = `

        <!-- =====================================================
             رأس مجموعة الفيروسات
             ===================================================== -->

        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #0d9488;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #0d9488;
            ">
                ${virologyGroupData.icon}
                ${virologyGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${virologyGroupData.description}
            </p>

        </div>
    `;


    // =========================================================
    // المرور على المجموعات الفرعية
    // =========================================================

    virologyGroupData.subGroups.forEach(function(subGroup) {

        html += `

            <div style="margin-bottom: 25px;">

                <!-- عنوان المجموعة الفرعية -->

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>


                <!-- شبكة التحاليل -->

                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        // =========================================================
        // المرور على كل تحليل
        // =========================================================

        subGroup.tests.forEach(function(test) {


            // =====================================================
            // دلالات الارتفاع
            // تستخدم highSignificance من JSON
            // تظهر فقط إذا كانت موجودة
            // =====================================================

            let highSignificanceHTML = '';

            if (
                test.highSignificance &&
                typeof test.highSignificance === 'string' &&
                test.highSignificance.trim() !== ''
            ) {

                highSignificanceHTML = `

                    <details style="
                        background: rgba(220, 38, 38, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(220, 38, 38, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #dc2626;
                            cursor: pointer;
                        ">
                            📈 دلالات الارتفاع
                        </summary>

                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.highSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // دلالات الانخفاض
            // تستخدم lowSignificance من JSON
            // تظهر فقط إذا كانت موجودة
            // =====================================================

            let lowSignificanceHTML = '';

            if (
                test.lowSignificance &&
                typeof test.lowSignificance === 'string' &&
                test.lowSignificance.trim() !== ''
            ) {

                lowSignificanceHTML = `

                    <details style="
                        background: rgba(37, 99, 235, 0.04);
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid rgba(37, 99, 235, 0.12);
                        font-size: 0.8rem;
                        margin-top: 8px;
                    ">

                        <summary style="
                            font-weight: bold;
                            color: #2563eb;
                            cursor: pointer;
                        ">
                            📉 دلالات الانخفاض
                        </summary>

                        <div style="
                            margin-top: 6px;
                            color: #475569;
                            line-height: 1.5;
                            white-space: pre-line;
                        ">
                            ${test.lowSignificance}
                        </div>

                    </details>
                `;
            }


            // =====================================================
            // إنشاء كرت التحليل
            // =====================================================

            html += `

                <div class="test-card"
                   data-search-name="${test.fullName || ''} ${test.shortName || ''}"
                    style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- =====================================
                             اسم التحليل والاختصار
                             ===================================== -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">

                            <!-- الاختصار -->

                            <span style="
                                background: #0d9488;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>


                            <!-- الاسم الكامل -->

                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- =====================================
                             وظيفة التحليل
                             ===================================== -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- =====================================
                             نوع العينة والتيوب
                             ===================================== -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <!-- نوع العينة -->

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>


                            <!-- نوع التيوب -->

                            <div>
                                🧪
                                <strong>نوع الناقل/التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- =====================================
                             القيم الطبيعية
                             ===================================== -->

                        <details style="
                            background: rgba(13, 148, 136, 0.04);
                            padding: 6px 8px;
                            border-radius: 6px;
                            border: 1px solid rgba(13, 148, 136, 0.1);
                            font-size: 0.8rem;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #0d9488;
                                cursor: pointer;
                            ">
                                📊 القيم الطبيعية (Reference Values)
                            </summary>


                            <ul style="
                                list-style: none;
                                padding-right: 0;
                                margin: 6px 0 0 0;
                                display: grid;
                                gap: 4px;
                                color: #475569;
                            ">


                                <!-- الرجال -->

                                <li>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </li>


                                <!-- النساء -->

                                <li>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </li>


                                <!-- الأطفال -->

                                <li>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </li>

                            </ul>

                        </details>


                        <!-- =====================================
                             دلالات الارتفاع
                             ===================================== -->

                        ${highSignificanceHTML}


                        <!-- =====================================
                             دلالات الانخفاض
                             ===================================== -->

                        ${lowSignificanceHTML}

                    </div>

                </div>
            `;
        });


        // =========================================================
        // إغلاق شبكة التحاليل
        // =========================================================

        html += `

                </div>

            </div>
        `;
    });


    // =========================================================
    // عرض المحتوى على الصفحة
    // =========================================================

    container.innerHTML = html;


    // تغيير الحالة إلى مفتوحة
    isVirologyOpen = true;


    // =========================================================
    // تغيير شكل الزر بعد الفتح
    // =========================================================

    if (virologyBtn) {

        virologyBtn.style.background = '#475569';

        virologyBtn.innerHTML =
            '✖ إغلاق فحوصات علم الفيروسات';
    }

}

// ============================================================
// مجموعة الأحياء الجزيئية Molecular Biology
// ============================================================

// هذا المتغير يستخدم لمعرفة هل مجموعة الأحياء الجزيئية مفتوحة أم مغلقة.

// false = المجموعة مغلقة
// true  = المجموعة مفتوحة
let isMolecularOpen = false;


// =========================================================
// دالة عرض تحاليل الأحياء الجزيئية
// =========================================================

function renderMolecularGroup() {

    const container = document.getElementById('tests-container');

    const molecularBtn = document.getElementById('molecular-btn');


    // =========================================================
    // التأكد من وجود العناصر والبيانات
    // =========================================================

    if (!container || typeof molecularGroupData === 'undefined') {
        return;
    }


    // =========================================================
    // إذا كانت المجموعة مفتوحة → إغلاق
    // =========================================================

    if (isMolecularOpen === true) {

        container.innerHTML = '';

        isMolecularOpen = false;


        if (molecularBtn) {

            molecularBtn.style.background = '#047857';

            molecularBtn.innerHTML =
                '🧬 الأحياء الجزيئية (Molecular / PCR)';
        }


        return;
    }


    // =========================================================
    // بناء رأس المجموعة
    // =========================================================

    let html = `

        <div class="group-header"
            style="
                margin-bottom: 20px;
                text-align: right;
                background: #fff;
                padding: 15px;
                border-radius: 10px;
                border-right: 5px solid #047857;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            ">

            <h2 style="
                margin: 0;
                color: #047857;
            ">
                ${molecularGroupData.icon}
                ${molecularGroupData.groupName}
            </h2>

            <p style="
                color: #64748b;
                margin: 5px 0 0 0;
                font-size: 0.95rem;
            ">
                ${molecularGroupData.description}
            </p>

        </div>
    `;


    // =========================================================
    // المرور على المجموعات الفرعية
    // =========================================================

    molecularGroupData.subGroups.forEach(function(subGroup) {

        html += `

            <div style="margin-bottom: 25px;">

                <h3 style="
                    color: #0f172a;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 6px;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    text-align: right;
                ">
                    ${subGroup.subCategory}
                </h3>


                <div class="tests-grid"
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(auto-fill, minmax(320px, 1fr));
                        gap: 15px;
                    ">
        `;


        // =========================================================
        // المرور على التحاليل
        // =========================================================

        subGroup.tests.forEach(function(test) {

            html += `

                <div class="test-card"
                   data-search-name="${test.fullName || ''} ${test.shortName || ''}"
                    style="
                        background: #ffffff;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        padding: 15px;
                        box-shadow:
                            0 2px 4px rgba(0,0,0,0.03);
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    ">

                    <div>


                        <!-- =====================================
                             اسم التحليل والاختصار
                             ===================================== -->

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 1px solid #f1f5f9;
                            padding-bottom: 8px;
                            margin-bottom: 10px;
                        ">

                            <span style="
                                background: #047857;
                                color: white;
                                padding: 3px 8px;
                                border-radius: 6px;
                                font-weight: bold;
                                font-size: 0.85rem;
                            ">
                                ${test.shortName}
                            </span>


                            <h3 style="
                                margin: 0;
                                font-size: 1.02rem;
                                color: #1e293b;
                                text-align: right;
                            ">
                                ${test.fullName}
                            </h3>

                        </div>


                        <!-- =====================================
                             وظيفة التحليل
                             ===================================== -->

                        <p style="
                            font-size: 0.85rem;
                            color: #334155;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            <strong>الوظيفة:</strong>
                            ${test.functionality}
                        </p>


                        <!-- =====================================
                             نوع العينة والتيوب
                             ===================================== -->

                        <div style="
                            background: #f8fafc;
                            padding: 8px;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            margin-bottom: 10px;
                        ">

                            <div style="margin-bottom: 4px;">
                                💉
                                <strong>نوع العينة:</strong>
                                ${test.sampleType}
                            </div>

                            <div>
                                🧪
                                <strong>نوع الناقل/التيوب:</strong>
                                ${test.tubeType}
                            </div>

                        </div>


                        <!-- =====================================
                             القيمة الطبيعية
                             ===================================== -->

                        <details style="
                            background: rgba(4, 120, 87, 0.04);
                            padding: 7px 9px;
                            border-radius: 6px;
                            border: 1px solid rgba(4, 120, 87, 0.12);
                            font-size: 0.8rem;
                            margin-bottom: 6px;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #047857;
                                cursor: pointer;
                            ">
                                📊 القيمة الطبيعية
                            </summary>


                            <div style="
                                margin-top: 7px;
                                color: #475569;
                                line-height: 1.5;
                            ">

                                <div>
                                    👨
                                    <strong>الرجال:</strong>
                                    ${test.referenceRanges.male}
                                </div>

                                <div>
                                    👩
                                    <strong>النساء:</strong>
                                    ${test.referenceRanges.female}
                                </div>

                                <div>
                                    👶
                                    <strong>الأطفال:</strong>
                                    ${test.referenceRanges.children}
                                </div>

                            </div>

                        </details>


                        <!-- =====================================
                             High Significance
                             ===================================== -->

                        <details style="
                            background: rgba(220, 38, 38, 0.04);
                            padding: 7px 9px;
                            border-radius: 6px;
                            border: 1px solid rgba(220, 38, 38, 0.12);
                            font-size: 0.8rem;
                            margin-bottom: 6px;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #dc2626;
                                cursor: pointer;
                            ">
                                🔴 High Significance
                            </summary>


                            <div style="
                                margin-top: 7px;
                                color: #475569;
                                line-height: 1.5;
                            ">
                                ${test.highSignificance}
                            </div>

                        </details>


                        <!-- =====================================
                             Low Significance
                             ===================================== -->

                        <details style="
                            background: rgba(37, 99, 235, 0.04);
                            padding: 7px 9px;
                            border-radius: 6px;
                            border: 1px solid rgba(37, 99, 235, 0.12);
                            font-size: 0.8rem;
                        ">

                            <summary style="
                                font-weight: bold;
                                color: #2563eb;
                                cursor: pointer;
                            ">
                                🔵 Low Significance
                            </summary>


                            <div style="
                                margin-top: 7px;
                                color: #475569;
                                line-height: 1.5;
                            ">
                                ${test.lowSignificance}
                            </div>

                        </details>

                    </div>

                </div>
            `;
        });


        // =========================================================
        // إغلاق شبكة التحاليل
        // =========================================================

        html += `

                </div>

            </div>
        `;
    });


    // =========================================================
    // عرض المحتوى
    // =========================================================

    container.innerHTML = html;


    // =========================================================
    // تغيير الحالة
    // =========================================================

    isMolecularOpen = true;


    // =========================================================
    // تغيير شكل الزر
    // =========================================================

    if (molecularBtn) {

        molecularBtn.style.background = '#475569';

        molecularBtn.innerHTML =
            '✖ إغلاق فحوصات الأحياء الجزيئية';
    }

}

// ============================================================
// 📋 صفحة تفسير التحاليل
// ============================================================

// أسلوب القسم: تعليم عملي تدريجي يحافظ على هوية Zak Lab، ويعرض التفسير كقرائن
// مخبرية مترابطة لا كأداة تشخيص أو قرار علاجي. جميع بياناته موجودة في data.js.
const interpretationEngineGroups = typeof interpretationEngineData !== 'undefined'
    ? (interpretationEngineData.groups || [])
    : [];

const interpretationEngineTests = interpretationEngineGroups.flatMap(function (group) {
    return (group.tests || []).map(function (test) {
        return Object.assign({ group_id: group.category_id, group_name_ar: group.category_ar }, test);
    });
});

}

// توافق V10: التعريف السابق بقي داخل كتلة مغلقة، لذلك تعاد قراءة نفس البيانات
// على نطاق الصفحة كي تتمكن دوال العرض والبحث من الوصول إليها بلا تغيير في data.js.
var interpretationEngineGroups = typeof interpretationEngineData !== 'undefined'
    ? (interpretationEngineData.groups || [])
    : [];
var interpretationEngineTests = interpretationEngineGroups.flatMap(function (group) {
    return (group.tests || []).map(function (test) {
        return Object.assign({ group_id: group.category_id, group_name_ar: group.category_ar }, test);
    });
});

// V12: تعيد بطاقات التفسير استخدام دليل الطالب الموجود سابقاً في خريطة V6.
// يضاف الدليل فقط للفحص المطابق بالاسم الإنجليزي ومن دون استبدال أي دليل موجود.
(function enrichInterpretationTestsWithStudentGuide() {
    if (typeof v6TestEducationData === 'undefined') { return; }

    interpretationEngineTests.forEach(function (test) {
        if (!test || test.learningDetails || !test.test_name_en) { return; }

        const guide = v6TestEducationData[test.test_name_en];
        if (!guide) { return; }

        test.learningDetails = {
            purpose: guide.whyTest,
            method: guide.principle,
            interpretation: guide.clinicalSignificance,
            pitfall: guide.preAnalyticalNotes,
            studentFriendly: guide.simpleExplanation,
            confirmationNote: guide.rangeCaveat
        };
    });
})();

function escapeInterpretationHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderInterpretationTestCard(test) {
    const highInterpretation = Array.isArray(test.high_interpretation) ? test.high_interpretation : [];
    const lowInterpretation = Array.isArray(test.low_interpretation) ? test.low_interpretation : [];
    const highItems = highInterpretation.map(function (item) {
        return '<li>' + escapeInterpretationHTML(item) + '</li>';
    }).join('');
    const lowItems = lowInterpretation.map(function (item) {
        return '<li>' + escapeInterpretationHTML(item) + '</li>';
    }).join('');
    const name = escapeInterpretationHTML(test.test_name_ar || test.test_name_en || test.id);
    const english = escapeInterpretationHTML(test.test_name_en || '');
    const abbreviation = escapeInterpretationHTML(test.abbreviation || '');
    const range = escapeInterpretationHTML(test.normal_range || 'راجع تقرير المختبر');
    const unit = escapeInterpretationHTML(test.unit || '');
    const significance = escapeInterpretationHTML(test.clinical_significance || '');
    const note = escapeInterpretationHTML(test.clinical_notes || '');
    const learningDetails = renderV7LearningDetails(test.learningDetails, '🎓 دليل الطالب: طريقة القراءة المنظمة');

    return `
        <article class="interpretation-test-card" data-search-name="${name} ${english} ${abbreviation}">
            <div class="interpretation-test-head">
                <div>
                    <p class="interpretation-test-category">${escapeInterpretationHTML(test.category || '')}</p>
                    <h3>${name}</h3>
                    <p class="interpretation-test-en">${english}${abbreviation ? ' · ' + abbreviation : ''}</p>
                </div>
                <span class="interpretation-unit">${unit || 'حسب التقرير'}</span>
            </div>
            <div class="interpretation-range"><strong>المدى التعليمي:</strong> ${range}</div>
            <p class="interpretation-significance">${significance}</p>
            <div class="interpretation-direction-grid">
                <section class="interpretation-direction interpretation-high">
                    <h4>عند الارتفاع / الإيجابية</h4>
                    <ul>${highItems || '<li>يعتمد على نوع الاختبار والسياق.</li>'}</ul>
                </section>
                <section class="interpretation-direction interpretation-low">
                    <h4>عند الانخفاض / السلبية</h4>
                    <ul>${lowItems || '<li>يعتمد على نوع الاختبار والسياق.</li>'}</ul>
                </section>
            </div>
            <p class="interpretation-golden-note"><strong>ملاحظة تعليمية:</strong> ${note}</p>
            ${learningDetails}
        </article>
    `;
}

// توسعة V7: عارض موحّد وآمن لحقول التعلم الإضافية. لا يبدّل الحقول القائمة.
function renderV7LearningDetails(details, title) {
    if (!details || typeof details !== 'object') { return ''; }
    const labels = {
        purpose: 'الهدف من هذه الخطوة',
        method: 'كيف تُفحص؟',
        interpretation: 'كيف تُقرأ؟',
        pitfall: 'تنبيه جودة/تداخل',
        studentFriendly: '🧠 ببساطة',
        infectiveStage: 'المرحلة المعدية',
        specimen: 'العينة والطريقة',
        distinction: 'كيف تفرّقه؟',
        whyReadTogether: 'لماذا يُقرأ مع غيره؟',
        methodAndSpecimen: 'الطريقة والعينة',
        interpretationSequence: 'ترتيب التفسير',
        confirmationNote: 'التأكيد والحدود'
    };
    const rows = Object.keys(labels).map(function (key) {
        const value = details[key];
        return value ? '<section class="v7-learning-item"><h4>' + labels[key] + '</h4><p>' + escapeInterpretationHTML(value) + '</p></section>' : '';
    }).join('');
    return rows ? '<details class="v7-learning-details"><summary>' + escapeInterpretationHTML(title || '🎓 دليل الطالب') + '</summary><div class="v7-learning-grid">' + rows + '</div></details>' : '';
}

function renderV7LearningList(items, title) {
    if (!Array.isArray(items) || !items.length) { return ''; }
    return '<details class="v7-learning-details v7-learning-list"><summary>' + escapeInterpretationHTML(title || '🎓 دليل الطالب') + '</summary><ol>' + items.map(function (item) { return '<li>' + escapeInterpretationHTML(item) + '</li>'; }).join('') + '</ol></details>';
}

// التفاعل هنا تدريبي فقط: يعلّم الطالب تنظيم القراءة وربط الفحوص، ولا يستنتج
// تشخيصاً أو علاجاً لمريض ولا يطلب إدخال أي بيانات صحية شخصية.
const interpretationLearningTools = typeof interpretationLearningToolsData !== 'undefined'
    ? interpretationLearningToolsData
    : { learningPath: [], categories: [], reportChecklist: [], practiceCases: [] };
let interpretationActiveCategory = 'blood';
let interpretationActivePractice = '';

function getInterpretationTestsByCategory() {
    const category = (interpretationLearningTools.categories || []).find(function (item) {
        return item.id === interpretationActiveCategory;
    });
    if (!category || !category.match || !category.match.length) {
        return interpretationEngineTests;
    }
    return interpretationEngineTests.filter(function (test) {
        return category.match.includes(test.category);
    });
}

function getInterpretationCategoryIdForTest(test) {
    const category = (interpretationLearningTools.categories || []).find(function (item) {
        return item.id !== 'all' && (item.match || []).includes(test.category);
    });
    return category ? category.id : 'all';
}

function renderLearningPathMarkup() {
    return (interpretationLearningTools.learningPath || []).map(function (step) {
        return `
            <button type="button" class="interpretation-path-step" data-learning-step="${escapeInterpretationHTML(step.id)}" data-search-name="${escapeInterpretationHTML(step.title)} ${escapeInterpretationHTML(step.short)}" aria-expanded="false">
                <span class="interpretation-path-number">${escapeInterpretationHTML(step.number)}</span>
                <span class="interpretation-path-copy"><strong>${escapeInterpretationHTML(step.title)}</strong><small>${escapeInterpretationHTML(step.short)}</small></span>
                <span class="interpretation-path-chevron" aria-hidden="true">⌄</span>
                <span class="interpretation-path-detail"><b>كيف تطبقها؟</b>${escapeInterpretationHTML(step.detail)}<em>${escapeInterpretationHTML(step.prompt)}</em></span>
            </button>
        `;
    }).join('');
}

function renderPracticeStage(caseData) {
    if (!caseData) {
        return '<div class="interpretation-practice-empty">اختر حالة تدريبية. المطلوب هو تحديد **خطوة القراءة المنهجية التالية**، وليس تشخيص الحالة.</div>';
    }
    const values = (caseData.values || []).map(function (item) {
        return `<div class="practice-value"><span>${escapeInterpretationHTML(item.label)}</span><strong>${escapeInterpretationHTML(item.value)}</strong><small>${escapeInterpretationHTML(item.state)}</small></div>`;
    }).join('');
    const options = (caseData.options || []).map(function (option, index) {
        return `<button type="button" class="practice-option" data-practice-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeInterpretationHTML(option)}</button>`;
    }).join('');
    return `
            <article class="interpretation-practice-stage" data-practice-id="${escapeInterpretationHTML(caseData.id)}" data-search-name="${escapeInterpretationHTML(caseData.title)} ${escapeInterpretationHTML(caseData.pattern)}">
            <div class="practice-stage-title"><span aria-hidden="true">${escapeInterpretationHTML(caseData.icon)}</span><div><p>حالة تدريبية غير تشخيصية</p><h4>${escapeInterpretationHTML(caseData.title)}</h4></div></div>
            <p class="practice-stage-intro">${escapeInterpretationHTML(caseData.intro)}</p>
            <div class="practice-values">${values}</div>
            <div class="practice-pattern"><strong>اقرأ النمط أولاً:</strong>${escapeInterpretationHTML(caseData.pattern)}</div>
            <div class="practice-question"><p>${escapeInterpretationHTML(caseData.question)}</p><div class="practice-options">${options}</div><div class="practice-feedback" aria-live="polite"></div></div>
        </article>
    `;
}

function bindInterpretationInteractions(container) {
    container.querySelectorAll('[data-learning-step]').forEach(function (button) {
        button.addEventListener('click', function () {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
            button.classList.toggle('is-open', !expanded);
        });
    });

    container.querySelectorAll('[data-interpretation-category]').forEach(function (button) {
        button.addEventListener('click', function () {
            interpretationActiveCategory = button.dataset.interpretationCategory || 'all';
            renderInterpretationPage();
        });
    });

    container.querySelectorAll('[data-practice-case]').forEach(function (button) {
        button.addEventListener('click', function () {
            interpretationActivePractice = button.dataset.practiceCase || '';
            renderInterpretationPage();
            document.getElementById('interpretation-practice-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    const activeCase = (interpretationLearningTools.practiceCases || []).find(function (item) {
        return item.id === interpretationActivePractice;
    });
    container.querySelectorAll('[data-practice-answer]').forEach(function (button) {
        button.addEventListener('click', function () {
            if (!activeCase) { return; }
            const selected = Number(button.dataset.practiceAnswer);
            const correct = selected === activeCase.correctIndex;
            const feedback = container.querySelector('.practice-feedback');
            container.querySelectorAll('[data-practice-answer]').forEach(function (item) {
                const isCorrect = Number(item.dataset.practiceAnswer) === activeCase.correctIndex;
                item.disabled = true;
                item.classList.toggle('is-correct', isCorrect);
                item.classList.toggle('is-incorrect', !isCorrect && item === button);
            });
            if (feedback) {
                feedback.className = 'practice-feedback ' + (correct ? 'is-correct' : 'is-incorrect');
                feedback.innerHTML = '<strong>' + (correct ? 'إجابة منظمة.' : 'راجع النمط مرة أخرى.') + '</strong><span>' + escapeInterpretationHTML(activeCase.explanation) + '</span>';
            }
        });
    });
}

function renderInterpretationPage() {
    const container = document.getElementById('interpretation-container');
    if (!container || typeof interpretationGuidesData === 'undefined') {
        return;
    }

    const guideMarkup = interpretationGuidesData.cards.map(function (card) {
        const points = (card.points || []).map(function (point) {
            return `<li>${point}</li>`;
        }).join('');

        return `
            <article class="interpretation-card" data-search-name="${card.name}">
                <h3><span aria-hidden="true">${card.icon}</span>${card.name}</h3>
                <p>${card.summary}</p>
                <ul>${points}</ul>
            </article>
        `;
    }).join('');

    const filteredTests = getInterpretationTestsByCategory();
    const categoriesMarkup = (interpretationLearningTools.categories || []).map(function (category) {
        const active = category.id === interpretationActiveCategory;
        return `<button type="button" class="interpretation-filter-btn ${active ? 'is-active' : ''}" data-interpretation-category="${escapeInterpretationHTML(category.id)}" data-search-name="${escapeInterpretationHTML(category.label)}" aria-pressed="${active}"><span>${escapeInterpretationHTML(category.icon)}</span>${escapeInterpretationHTML(category.label)}</button>`;
    }).join('');
    const checklistMarkup = (interpretationLearningTools.reportChecklist || []).map(function (item, index) {
        return `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeInterpretationHTML(item)}</li>`;
    }).join('');
    const practiceLaunchers = (interpretationLearningTools.practiceCases || []).map(function (caseData) {
        return `<button type="button" class="interpretation-practice-launch ${caseData.id === interpretationActivePractice ? 'is-active' : ''}" data-practice-case="${escapeInterpretationHTML(caseData.id)}" data-search-name="${escapeInterpretationHTML(caseData.title)} ${escapeInterpretationHTML(caseData.intro)}"><span>${escapeInterpretationHTML(caseData.icon)}</span><span><strong>${escapeInterpretationHTML(caseData.title)}</strong><small>${escapeInterpretationHTML(caseData.intro)}</small></span><b>ابدأ التدريب</b></button>`;
    }).join('');
    const activeCase = (interpretationLearningTools.practiceCases || []).find(function (item) {
        return item.id === interpretationActivePractice;
    });

    const engineMarkup = interpretationEngineTests.length
        ? `
            <section class="interpretation-engine" aria-label="محرك تفسير نتائج التحاليل">
                <div class="interpretation-engine-intro">
                    <p class="interpretation-eyebrow">قاعدة تعليمية منظمة</p>
                    <h3>اقرأ الورقة بطريقة مختبرية منظمة</h3>
                    <p>اختر الفحص من بطاقاته أو ابحث بالاسم العربي أو الإنجليزي أو الاختصار. يعرض القسم دلالة الفحص، المدى التعليمي، وأنماط الارتفاع والانخفاض الشائعة؛ ولا يصدر تشخيصاً أو توصية علاجية.</p>
                    <p><strong>قاعدة الطالب:</strong> طابق اسم الفحص ووحدته ومداه المرجعي المكتوب في تقرير المختبر أولاً، ثم اقرأ النمط مع بقية الفحوص والحالة السريرية؛ فالرقم وحده لا يثبت تشخيصاً.</p>
                </div>
                <section class="interpretation-learning-path" aria-label="مسار تعلم قراءة ورقة التحليل"><div class="interpretation-section-heading"><p>المسار العملي</p><h3>اقرأ أي تقرير بأربع خطوات</h3></div><div class="interpretation-path-grid">${renderLearningPathMarkup()}</div></section>
                <section class="interpretation-checklist"><div><p>قبل ما تفسر</p><h3>قائمة تحقق ورقة التحليل</h3></div><ol>${checklistMarkup}</ol></section>
                <section class="interpretation-practice" aria-label="مختبر التدريب"><div class="interpretation-section-heading"><p>مختبر التدريب</p><h3>تدرّب على قراءة النمط، لا على حفظ جواب</h3></div><div class="interpretation-practice-launchers">${practiceLaunchers}</div><div id="interpretation-practice-stage">${renderPracticeStage(activeCase)}</div></section>
                <section class="interpretation-library"><div class="interpretation-library-head"><div><p>مكتبة الفحوص</p><h3>اختر القسم ثم افتح الفحص</h3></div><div class="interpretation-engine-count">${filteredTests.length} من ${interpretationEngineTests.length} فحصاً</div></div><div class="interpretation-filters" role="toolbar" aria-label="تصفية فحوص التفسير">${categoriesMarkup}</div><div class="interpretation-test-grid">${filteredTests.map(renderInterpretationTestCard).join('')}</div></section>
            </section>
        `
        : `
            <section class="interpretation-engine interpretation-engine-loading">
                <p>يجري تحميل قاعدة التفسير التعليمية…</p>
            </section>
        `;

    container.classList.remove('guide-grid');
    container.innerHTML = `<div class="interpretation-guides-grid">${guideMarkup}</div>${engineMarkup}`;
    bindInterpretationInteractions(container);
}

// ============================================================
// 🧬 صفحة الأحياء الجزيئية والوراثة
// ============================================================

// يبقى المسار مغلقاً افتراضياً؛ يفتح الطالب أحد التبويبين ثم يغلقه بالضغط نفسه.
let currentMolecularGeneticsTab = '';

function renderMolecularGeneticsPage() {
    if (currentMolecularGeneticsTab === 'genetics') {
        renderMolecularGeneticsContent(geneticsGroupData, 'genetics');
        return;
    }
    if (currentMolecularGeneticsTab === 'molecular') {
        renderMolecularGeneticsContent(molecularBiologyGroupData, 'molecular');
        return;
    }

    const container = document.getElementById('molecular-genetics-container');
    const molecularButton = document.getElementById('molecular-biology-tab');
    const geneticsButton = document.getElementById('genetics-tab');
    [molecularButton, geneticsButton].forEach(function (button) {
        if (button) {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('aria-expanded', 'false');
        }
    });
    if (container) {
        container.innerHTML = '<div class="molecular-genetics-closed-state" role="status">اختر الأحياء الجزيئية أو الوراثة لفتح المسار التعليمي. اضغط التبويب نفسه مرة أخرى لإغلاقه.</div>';
    }
}

function renderMolecularBiologySection() {
    if (currentMolecularGeneticsTab === 'molecular') {
        currentMolecularGeneticsTab = '';
        renderMolecularGeneticsPage();
        return;
    }
    currentMolecularGeneticsTab = 'molecular';
    renderMolecularGeneticsContent(molecularBiologyGroupData, 'molecular');
}

function renderGeneticsSection() {
    if (currentMolecularGeneticsTab === 'genetics') {
        currentMolecularGeneticsTab = '';
        renderMolecularGeneticsPage();
        return;
    }
    currentMolecularGeneticsTab = 'genetics';
    renderMolecularGeneticsContent(geneticsGroupData, 'genetics');
}

// أسلوب هذا القسم: شرح عربي تدريجي وواضح، مستند إلى مصادر المستخدم،
// مع الحفاظ على ألوان Zak Lab وأسلوب البطاقات القائم بدلاً من واجهة منفصلة.
function renderMolecularGeneticsContent(groupData, activeTab) {
    const container = document.getElementById('molecular-genetics-container');
    const molecularButton = document.getElementById('molecular-biology-tab');
    const geneticsButton = document.getElementById('genetics-tab');

    if (!container || !groupData) {
        return;
    }

    [molecularButton, geneticsButton].forEach(function (button) {
        if (button) {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
            button.setAttribute('aria-expanded', 'false');
        }
    });

    const activeButton = activeTab === 'genetics' ? geneticsButton : molecularButton;
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        activeButton.setAttribute('aria-expanded', 'true');
    }

    const modules = Array.isArray(groupData.modules) ? groupData.modules : [];
    const moduleCards = modules.map(function (module) {
        const keyPoints = (module.keyPoints || []).map(function (point) {
            return `<li>${point}</li>`;
        }).join('');
        const rules = (module.rules || []).map(function (rule) {
            return `<li>${rule}</li>`;
        }).join('');
        const studyPath = (module.studyPath || []).map(function (step, index) {
            return `<li><span>${index + 1}</span>${step}</li>`;
        }).join('');
        const keywords = (module.keywords || []).join(' ');
        const diagram = module.diagram && module.diagram.src ? `
            <figure class="learning-diagram">
                <img src="${module.diagram.src}" alt="${module.diagram.alt || 'مخطط تعليمي'}" loading="lazy">
                <figcaption>${module.diagram.caption || ''}</figcaption>
            </figure>
        ` : '';
        const moduleImage = module.moduleImage ? `
            <figure class="learning-module-visual">
                <img src="${module.moduleImage}" alt="نموذج ثلاثي الأبعاد تعليمي مرتبط بوحدة ${module.title || ''}" loading="lazy">
            </figure>
        ` : '';
        const deviceConnection = module.deviceConnection ? `<p class="learning-device-link"><strong>🔗 صلة بالجهاز:</strong> ${module.deviceConnection}</p>` : '';
        const selfCheck = module.selfCheck && module.selfCheck.question ? `
            <details class="learning-self-check">
                <summary>✅ راجع فهمك</summary>
                <p><strong>سؤال:</strong> ${module.selfCheck.question}</p>
                <p class="learning-answer"><strong>الإجابة:</strong> ${module.selfCheck.answer || ''}</p>
            </details>
        ` : '';

        return `
            <article class="learning-module" id="${module.id || ''}" data-search-name="${module.title || ''} ${module.studyGoal || ''} ${keywords}">
                <div class="learning-module-topline">
                    <span class="learning-icon" aria-hidden="true">${module.icon || '🧬'}</span>
                    <span class="learning-level">${module.level || 'تعليمي'}</span>
                </div>
                <h4>${module.title || ''}</h4>
                <p class="learning-simple"><strong>ببساطة:</strong> ${module.simpleExplanation || ''}</p>
                ${module.studyGoal ? `<p class="learning-goal"><strong>🎯 هدفك من الوحدة:</strong> ${module.studyGoal}</p>` : ''}
                <details open>
                    <summary>📌 الملخص العلمي</summary>
                    <p>${module.summary || ''}</p>
                </details>
                ${studyPath ? `<details><summary>🪜 ادرسها بهذه الخطوات</summary><ol class="learning-study-path">${studyPath}</ol></details>` : ''}
                <details>
                    <summary>🧠 نقاط تحتاج تثبيتها</summary>
                    <ul>${keyPoints}</ul>
                </details>
                <details>
                    <summary>🛡️ قواعد وملاحظات مهمة</summary>
                    <ul>${rules}</ul>
                </details>
                ${diagram}
                ${moduleImage}
                ${deviceConnection}
                ${selfCheck}
                <p class="learning-source"><strong>المصدر التعليمي:</strong> ${module.source || groupData.primarySource || 'المادة الدراسية المعتمدة'}</p>
            </article>
        `;
    }).join('');

    const visual = groupData.heroImage ? `
            <aside class="molecular-visual-card" aria-label="نموذج بصري ثلاثي الأبعاد تعليمي">
                <div class="dna-3d-stage ${groupData.interactiveModel === 'chromosome' ? 'chromosome-3d-stage' : ''}" id="dna-3d-stage">
                    <div class="dna-3d-orbit">
                        <img src="${groupData.heroImage}" alt="نموذج ثلاثي الأبعاد تعليمي لقسم ${groupData.groupName || ''}" loading="lazy">
                    </div>
                </div>
            <button type="button" class="dna-motion-toggle" id="dna-motion-toggle">إيقاف الحركة</button>
            <p>${groupData.heroCaption || ''}</p>
        </aside>
    ` : '';

    container.innerHTML = `
        <section class="molecular-learning-shell ${activeTab === 'genetics' ? 'genetics' : ''}">
            <header class="molecular-genetics-header ${activeTab === 'genetics' ? 'genetics' : ''}">
                <span class="learning-eyebrow">مسار تعليمي عربي • من الأساس إلى التطبيق</span>
                <h3>${groupData.icon || '🧬'} ${groupData.groupName || ''}</h3>
                <p>${groupData.description || ''}</p>
            </header>
            <div class="molecular-hero-grid">
                <div class="learning-roadmap">
                    <h4>كيف تستخدم هذا القسم؟</h4>
                    <ol>
                        <li>اتبع الوحدات بالترتيب؛ كل وحدة تبني فكرة تحتاجها التي بعدها.</li>
                        <li>افتح خطة الدراسة والمخططات وأسئلة المراجعة، ولا تكتفِ بقراءة العنوان.</li>
                        <li>اربط المفهوم بالتقنية أو الجهاز، ثم راجع المصدر عند التحضير للدراسة أو البحث.</li>
                    </ol>
                    <p class="learning-disclaimer">هذا المحتوى للتعليم والمراجعة. لا يُستخدم منفرداً للتشخيص أو لاتخاذ قرار علاجي.</p>
                </div>
                ${visual}
            </div>
            <div class="learning-module-grid">${moduleCards || '<p class="zak-search-empty">لا توجد وحدات تعليمية ضمن هذا القسم حالياً.</p>'}</div>
        </section>
    `;

    const motionToggle = document.getElementById('dna-motion-toggle');
    const stage = document.getElementById('dna-3d-stage');
    if (motionToggle && stage) {
        motionToggle.addEventListener('click', function () {
            const paused = stage.classList.toggle('is-paused');
            motionToggle.textContent = paused ? 'تشغيل الحركة' : 'إيقاف الحركة';
        });
    }
}

// ==========================================
// 🧫 التحكم بصفحة فحص البول والبراز (Urine & Stool)
// ==========================================


// --------------------------------------------------
// هذا المتغير يخزن التبويب المفتوح حالياً.
// القيمة الافتراضية هي overview.
// --------------------------------------------------

// overview = الشرح العام
// urine_micro = مجهر البول
// stool_micro = الطفيليات والديدان

let currentStoolTab = 'overview';


// ==================================================
// دالة تغيير التبويب
// ==================================================

function switchStoolTab(tab) {

    // نضع التبويب الجديد داخل المتغير
    // حتى نعرف أي قسم يجب أن يظهر للمستخدم
    currentStoolTab = (tab === 'urine_strips' && currentStoolTab === 'urine_strips') ? 'overview' : tab;

    // بعد تغيير التبويب نعيد بناء المحتوى
    renderUrineStoolContent();
}


// ==================================================
// دالة عرض مجموعة البول والبراز
// ==================================================

function renderUrineStoolGroup() {

    // نحصل على العنصر الذي سوف نضع بداخله المحتوى
    const container = document.getElementById('urine-stool-container');

    // إذا لم نجد العنصر نتوقف عن تنفيذ الدالة
    if (!container) {
        return;
    }

    // إذا كان العنصر موجوداً نعرض المحتوى
    renderUrineStoolContent();
}


// ==================================================
// دالة بناء محتوى البول والبراز
// ==================================================

function renderUrineStoolContent() {

    // نحصل على الحاوية التي سوف نعرض داخلها المحتوى
    const container = document.getElementById('urine-stool-container');

    // إذا لم نجد الحاوية لا نستطيع عرض شيء
    if (!container) {
        return;
    }


    // ==================================================
    // جلب بيانات فحص البول
    // ==================================================

    // نبدأ بإنشاء متغير uInfo
    // ونضع بداخله بيانات البول العامة
    let uInfo = {};

    // نتأكد أولاً أن urineOverviewData موجود
    if (typeof urineOverviewData !== 'undefined') {

        // إذا كان موجوداً نضع بياناته داخل uInfo
        uInfo = urineOverviewData;
    }


    // ==================================================
    // جلب بيانات مجهر البول
    // ==================================================

    // في البداية نجعل uMicro مصفوفة فارغة
    let uMicro = [];

    // إذا كانت بيانات مجهر البول موجودة
    if (typeof urineMicroscopicData !== 'undefined') {

        // نضع البيانات داخل uMicro
        uMicro = urineMicroscopicData;
    }


    // ==================================================
    // جلب بيانات شرائط كواشف البول
    // ==================================================

    let uStrips = {};

    if (typeof urineReagentStripData !== 'undefined') {
        uStrips = urineReagentStripData;
    }


    // ==================================================
    // جلب بيانات البراز العامة
    // ==================================================

    // نبدأ ببيانات فارغة
    let sInfo = {};

    // نتأكد أن stoolOverviewData موجود
    if (typeof stoolOverviewData !== 'undefined') {

        // إذا كان موجوداً نضعه داخل sInfo
        sInfo = stoolOverviewData;
    }


    // ==================================================
    // جلب بيانات طفيليات البراز
    // ==================================================

    // نبدأ بمصفوفة فارغة
    let sParasites = [];

    // إذا كانت بيانات الطفيليات موجودة
    if (typeof stoolParasitesData !== 'undefined') {

        // نضع البيانات داخل sParasites
        sParasites = stoolParasitesData;
    }


    // ==================================================
    // إنشاء المتغير الذي سوف يحتوي HTML
    // ==================================================

    let html = `

        <div style="grid-column: 1 / -1; width: 100%;">

            <!--
                هذا القسم يحتوي على أزرار التبديل
                بين أقسام فحص البول والبراز
            -->

            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; direction: rtl; flex-wrap: wrap;">


                <!-- =====================================
                     زر الشرح العام
                     ===================================== -->

                <button onclick="switchStoolTab('overview')" 
                    style="padding: 10px 18px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; transition: 0.3s;
                    background: ${currentStoolTab === 'overview' ? '#d97706' : '#fef3c7'}; 
                    color: ${currentStoolTab === 'overview' ? '#fff' : '#b45309'};">

                    📋 الشرح العام (البول والبراز)

                </button>


                <!-- =====================================
                     زر مجهر البول
                     ===================================== -->

                <button onclick="switchStoolTab('urine_micro')" 
                    style="padding: 10px 18px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; transition: 0.3s;
                    background: ${currentStoolTab === 'urine_micro' ? '#d97706' : '#fef3c7'}; 
                    color: ${currentStoolTab === 'urine_micro' ? '#fff' : '#b45309'};">

                    🔬 مجهر البول (Urine Sediment)

                </button>


                <!-- =====================================
                     زر شرائط كواشف البول
                     ===================================== -->

                <button onclick="switchStoolTab('urine_strips')" 
                    style="padding: 10px 18px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; transition: 0.3s;
                    background: ${currentStoolTab === 'urine_strips' ? '#0369a1' : '#e0f2fe'}; 
                    color: ${currentStoolTab === 'urine_strips' ? '#fff' : '#075985'};">

                    🧪 شرائط كواشف البول

                </button>


                <!-- =====================================
                     زر الطفيليات والديدان
                     ===================================== -->

                <button onclick="switchStoolTab('stool_micro')" 
                    style="padding: 10px 18px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; transition: 0.3s;
                    background: ${currentStoolTab === 'stool_micro' ? '#78350f' : '#fde68a'}; 
                    color: ${currentStoolTab === 'stool_micro' ? '#fff' : '#78350f'};">

                    🪱 الطفيليات والديدان (Stool Parasites)

                </button>

            </div>

        </div>
    `;


    // ==================================================
    // 1️⃣ عرض الشرح العام
    // ==================================================

    // نتحقق هل المستخدم اختار overview
    if (currentStoolTab === 'overview') {

        // ==================================================
        // عرض فحص البول الشامل قبل فحص البراز، لأن بياناته
        // كانت مفهرسة لكنها غير معروضة في التبويب السابق.
        // ==================================================
        let urineTypes = Array.isArray(uInfo.typesOfSpecimens) ? uInfo.typesOfSpecimens : [];
        let urinePhysicalExams = Array.isArray(uInfo.physicalExams) ? uInfo.physicalExams : [];
        let urineChemicalExams = Array.isArray(uInfo.chemicalExams) ? uInfo.chemicalExams : [];

        html += `
        <div style="grid-column: 1 / -1; direction: rtl; text-align: right; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #dbeafe; margin-bottom: 20px;">
            <h2 style="color: #0369a1; margin-bottom: 5px;">💧 تحليل البول الشامل (GUE)</h2>
            <p style="line-height: 1.7; color: #4b5563;">${uInfo.definition || ''}</p>
            <div class="v7-learning-stack">
                ${renderV7LearningList(uInfo.studentWorkflow, '🧭 مسار الطالب في قراءة GUE')}
                ${renderV7LearningList(uInfo.collectionGuide, '🧴 جمع عينة البول ومناولتها')}
                ${renderV7LearningList(uInfo.rejectionCriteria, '⚠️ متى تراجع جودة العينة؟')}
            </div>
            <h4 style="color: #075985; margin-top: 20px; border-bottom: 2px solid #bae6fd; padding-bottom: 5px;">أنواع العينات</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px;">
        `;

        for (let i = 0; i < urineTypes.length; i++) {
            let sample = urineTypes[i];
            html += `
                <div class="urine-card" data-search-name="${sample.type || ''}" style="background: #f0f9ff; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd;">
                    <b style="color: #075985;">🔹 ${sample.type || ''}</b>
                    <p style="margin: 5px 0 0; font-size: 0.88rem; color: #4b5563;">${sample.use || ''}</p>
                </div>
            `;
        }

        html += `
            </div>
            <h4 style="color: #075985; margin-top: 25px; border-bottom: 2px solid #bae6fd; padding-bottom: 5px;">الفحص الفيزيائي</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px;">
        `;

        for (let i = 0; i < urinePhysicalExams.length; i++) {
            let exam = urinePhysicalExams[i];
            html += `
                <div class="urine-card" data-search-name="${exam.param || ''}" style="background: #f0f9ff; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd;">
                    <b style="color: #075985;">🔹 ${exam.param || ''}</b>
                    <p style="margin: 5px 0; font-size: 0.88rem;"><b>الطبيعي:</b> ${exam.normal || ''}</p>
                    <p style="margin: 0; font-size: 0.88rem; color: #9f1239;"><b>ملاحظات:</b> ${exam.abnormal || ''}</p>
                    ${renderV7LearningDetails(exam.learningDetails, '🎓 دليل الطالب: الفحص الفيزيائي')}
                </div>
            `;
        }

        html += `
            </div>
            <h4 style="color: #075985; margin-top: 25px; border-bottom: 2px solid #bae6fd; padding-bottom: 5px;">الفحص الكيميائي</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px;">
        `;

        for (let i = 0; i < urineChemicalExams.length; i++) {
            let exam = urineChemicalExams[i];
            html += `
                <div class="urine-card" data-search-name="${exam.test || ''}" style="background: #f0f9ff; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd;">
                    <b style="color: #075985;">🔹 ${exam.test || ''}</b>
                    <p style="margin: 5px 0 0; font-size: 0.88rem; color: #4b5563;">${exam.clinicalSig || ''}</p>
                    ${renderV7LearningDetails(exam.learningDetails, '🎓 دليل الطالب: الفحص الكيميائي')}
                </div>
            `;
        }

        html += `</div></div>`;

        // نضيف واجهة الشرح العام إلى html
        html += `

        <div style="grid-column: 1 / -1; direction: rtl; text-align: right; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #fef3c7; margin-bottom: 20px;">

            <!-- عنوان فحص البراز -->
            <h2 style="color: #b45309; margin-bottom: 5px;">
                🟤 1. فحص البراز الشامل (GSE)
            </h2>


            <!-- تعريف فحص البراز -->

            <p style="line-height: 1.7; color: #4b5563;">
                ${sInfo.definition || ''}
            </p>

            <div class="v7-learning-stack">
                ${renderV7LearningList(sInfo.collectionGuide, '🧴 جمع عينة البراز ونقلها')}
                ${renderV7LearningList(sInfo.microscopyGuide, '🔬 مسار الفحص المجهري والطفيليات')}
            </div>


            <!-- عنوان الفحص الفيزيائي -->

            <h4 style="color: #78350f; margin-top: 20px; border-bottom: 2px solid #fde68a; padding-bottom: 5px;">
                🎨 الخواص الفيزيائية للبراز (Physical Exam)
            </h4>


            <div style="overflow-x: auto; margin-top: 10px;">

                <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 0.95rem;">

                    <thead>

                        <tr style="background: #fde68a; color: #78350f;">

                            <th style="padding: 10px; border: 1px solid #fef3c7;">
                                خاصية الفحص
                            </th>

                            <th style="padding: 10px; border: 1px solid #fef3c7;">
                                الحالة الطبيعية
                            </th>

                            <th style="padding: 10px; border: 1px solid #fef3c7;">
                                الدلالة المرضية والتشخيص
                            </th>

                        </tr>

                    </thead>


                    <tbody>
        `;


        // ==================================================
        // إنشاء صفوف الفحص الفيزيائي
        // بدلاً من استخدام map()
        // نستخدم for loop لأنها أسهل للمبتدئ
        // ==================================================

        let physicalExams = [];

        // إذا كانت physicalExams موجودة داخل sInfo
        if (sInfo.physicalExams) {

            // نضعها داخل المتغير
            physicalExams = sInfo.physicalExams;
        }


        // نمر على جميع عناصر physicalExams
        for (let i = 0; i < physicalExams.length; i++) {

            // نخزن العنصر الحالي
            let p = physicalExams[i];


            // نضيف صف جديد إلى الجدول
            html += `

                <tr class="stool-card" data-search-name="${p.param || ''}">

                    <td style="padding: 8px; border: 1px solid #fde68a;">
                        <b>${p.param}</b>
                    </td>

                    <td style="padding: 8px; border: 1px solid #fde68a; color: #16a34a;">
                        ${p.normal}
                    </td>

                    <td style="padding: 8px; border: 1px solid #fde68a; color: #dc2626;">
                        ${p.abnormal}
                        ${renderV7LearningDetails(p.learningDetails, '🎓 دليل الطالب')}
                    </td>

                </tr>

            `;
        }


        // إغلاق tbody والجدول
        html += `

                    </tbody>

                </table>

            </div>


            <!-- =====================================
                 الفحوصات الكيميائية للبراز
                 ===================================== -->

            <h4 style="color: #78350f; margin-top: 25px; border-bottom: 2px solid #fde68a; padding-bottom: 5px;">

                🧪 الفحوصات الكيميائية للبراز (Chemical Exam)

            </h4>


            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-top: 10px;">
        `;


        // ==================================================
        // جلب chemicalExams
        // ==================================================

        let chemicalExams = [];

        // إذا كانت chemicalExams موجودة
        if (sInfo.chemicalExams) {

            // نخزنها داخل المتغير
            chemicalExams = sInfo.chemicalExams;
        }


        // ==================================================
        // إنشاء كروت الفحوصات الكيميائية
        // ==================================================

        for (let i = 0; i < chemicalExams.length; i++) {

            // نحصل على الفحص الحالي
            let c = chemicalExams[i];


            // نضيف كارت الفحص
            html += `

                <div class="stool-card" data-search-name="${c.test || ''}" style="background: #fffbeb; padding: 12px; border-radius: 8px; border: 1px solid #fde68a;">

                    <b style="color: #78350f;">
                        🔹 ${c.test}
                    </b>

                    <p style="margin: 5px 0 0 0; font-size: 0.88rem; color: #4b5563;">

                        <b>الأهمية الطبية:</b>

                        ${c.clinicalSig}

                    </p>

                    ${renderV7LearningDetails(c.learningDetails, '🎓 دليل الطالب: الفحص الكيميائي')}

                </div>

            `;
        }


        // إغلاق بقية عناصر قسم overview
        html += `

            </div>

        </div>

        `;
    }


    // ==================================================
    // 2️⃣ عرض مجهر البول
    // ==================================================

    // نتحقق هل التبويب الحالي هو urine_micro
    if (currentStoolTab === 'urine_micro') {


        // نمر على جميع عناصر uMicro
        for (let i = 0; i < uMicro.length; i++) {

            // نخزن العنصر الحالي
            let item = uMicro[i];


            // نضيف كارت العنصر
            html += `

            <div class="urine-card" data-search-name="${item.name || ''}" style="background: #fff; border-radius: 12px; padding: 18px; border: 1px solid rgba(217, 119, 6, 0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: right; direction: rtl;">

                <!-- اسم العنصر -->

                <h3 style="color: #b45309; margin-bottom: 10px; border-bottom: 2px solid #fef3c7; padding-bottom: 5px;">

                    🔬 ${item.name}

                </h3>


                <!-- المعدل الطبيعي -->

                <p style="margin: 5px 0;">

                    <b>📊 المعدل الطبيعي:</b>

                    <span style="color: #16a34a; font-weight: bold;">

                        ${item.normalRange}

                    </span>

                </p>


                <!-- الشكل تحت المجهر -->

                <p style="margin: 5px 0;">

                    <b>🔍 الشكل تحت المجهر:</b>

                    ${item.appearance}

                </p>


                <!-- الدلالة المرضية -->

                <p class="urine-microscope-clinical-sig" style="margin: 5px 0;">

                    <b>⚠️ الدلالة المرضية:</b>

                    ${item.clinicalSig}

                </p>

                ${renderV7LearningDetails(item.learningDetails, '🎓 دليل الطالب: المجهر والجودة')}


                <!-- صورة العنصر -->

                <div style="margin-top: 12px; text-align: center;">

                    <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                        style="width:100%; height:180px; object-fit:cover; border-radius:8px; border:1px solid #fde68a;" 
                        onerror="this.onerror=null; this.parentElement.hidden=true; this.remove();"
                    >

                </div>

            </div>

            `;
        }
    }


    // ==================================================
    // 3️⃣ عرض شرائط كواشف البول
    // ==================================================

    if (currentStoolTab === 'urine_strips') {

        const stripParameters = Array.isArray(uStrips.parameters) ? uStrips.parameters : [];
        const stripSteps = Array.isArray(uStrips.practicalSteps) ? uStrips.practicalSteps : [];
        const stripQualityChecks = Array.isArray(uStrips.qualityChecks) ? uStrips.qualityChecks : [];
        const colorComparisonFlow = Array.isArray(uStrips.colorComparisonFlow) ? uStrips.colorComparisonFlow : [];
        const resultReadingGuide = Array.isArray(uStrips.resultReadingGuide) ? uStrips.resultReadingGuide : [];
        const importantNotes = Array.isArray(uStrips.importantNotes) ? uStrips.importantNotes : [];

        html += `
            <section class="urine-strips-shell" data-search-name="${uStrips.name || ''} ${uStrips.arabicName || ''}">
                <header class="urine-strips-header">
                    <div>
                        <span class="urine-strips-eyebrow">فحص كيميائي مسحي • يقرأ حسب توقيت الشركة</span>
                        <h2>🧪 ${uStrips.arabicName || 'شرائط كواشف البول'}</h2>
                        <p>${uStrips.definition || ''}</p>
                    </div>
                    <figure class="urine-strips-image-wrap">
                        <img src="${uStrips.image || ''}" alt="${uStrips.arabicName || 'شرائط كواشف البول'}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/460x250?text=Urine+Reagent+Strips';">
                    </figure>
                </header>

                <div class="urine-strips-explainer">
                    <h3>الوظيفة ومبدأ العمل</h3>
                    <p><strong>الوظيفة:</strong> ${uStrips.functionality || ''}</p>
                    <p><strong>المبدأ:</strong> ${uStrips.theoreticalBasis || ''}</p>
                </div>

                <div class="urine-strips-learning-grid">
                    <article class="urine-strips-learning-card">
                        <h3>🧴 كيف تستخدم الشريط؟</h3>
                        <ol>${stripSteps.map(function (step) { return `<li>${step}</li>`; }).join('')}</ol>
                    </article>
                    <article class="urine-strips-learning-card">
                        <h3>🎨 Pad → Chart → Value</h3>
                        <ol>${colorComparisonFlow.map(function (step) { return `<li>${step}</li>`; }).join('')}</ol>
                    </article>
                    <article class="urine-strips-learning-card">
                        <h3>🔢 قراءة اللون والدرجة</h3>
                        <ul>${resultReadingGuide.map(function (item) { return `<li>${item}</li>`; }).join('')}</ul>
                    </article>
                </div>

                ${uStrips.educationalImage ? `
                    <figure class="urine-strips-educational-visual">
                        <button type="button" class="urine-strips-zoom-trigger" data-urine-strip-education-image aria-label="تكبير لوحة شرائط البول التعليمية">
                            <img src="${uStrips.educationalImage}" alt="لوحة تعليمية لشرائط البول وجدول ألوانها" loading="lazy">
                            <span>اضغط لتكبير لوحة الشرائط وجدول الألوان</span>
                        </button>
                        <figcaption>${uStrips.educationalImageCaption || ''}</figcaption>
                    </figure>
                ` : ''}

                <div class="urine-strips-grid">
                    ${stripParameters.map(function (item) {
                        const interpretationDetails = [
                            item.falsePositive ? '<p><strong>إيجابية كاذبة محتملة:</strong> ' + escapeInterpretationHTML(item.falsePositive) + '</p>' : '',
                            item.falseNegative ? '<p><strong>سلبية كاذبة محتملة:</strong> ' + escapeInterpretationHTML(item.falseNegative) + '</p>' : '',
                            item.interference ? '<p><strong>عوامل مؤثرة:</strong> ' + escapeInterpretationHTML(item.interference) + '</p>' : '',
                            item.confirmation ? '<p><strong>التأكيد أو الربط:</strong> ' + escapeInterpretationHTML(item.confirmation) + '</p>' : ''
                        ].join('');
                        const learningDetails = item.learningDetails && typeof item.learningDetails === 'object' ? item.learningDetails : {};
                        const learningFields = [
                            ['whatItDetects', 'ما الذي تكشفه الوسادة؟'],
                            ['purpose', 'الهدف من الفحص'],
                            ['biologicalMeaning', 'المعنى البيولوجي/الطبي'],
                            ['colorReaction', 'تفاعل اللون'],
                            ['colorChartInterpretation', 'Pad → Chart → Result'],
                            ['resultScaleMeaning', 'معنى المقياس'],
                            ['readingTime', 'زمن القراءة'],
                            ['specimenNote', 'العينة والمناولة'],
                            ['studentFriendly', '🧠 ببساطة']
                        ];
                        const learningDetailsHTML = learningFields.map(function (field) {
                            const value = learningDetails[field[0]];
                            return value ? '<section class="urine-strip-learning-item"><h4>' + field[1] + '</h4><p>' + escapeInterpretationHTML(value) + '</p></section>' : '';
                        }).join('');
                        return `
                            <article class="urine-strip-card" data-search-name="${item.name || ''} ${item.arabicName || ''}">
                                <h3>${item.arabicName || item.name || ''}</h3>
                                <p class="urine-strip-name">${item.name || ''}</p>
                                <p><strong>النتيجة المتوقعة:</strong> ${item.expectedResult || ''}</p>
                                <p><strong>مبدأ الوسادة:</strong> ${item.principle || ''}</p>
                                <p><strong>ملاحظة تعليمية:</strong> ${item.educationalNote || ''}</p>
                                ${interpretationDetails}
                                ${learningDetailsHTML ? `<details class="urine-strip-learning-details"><summary>🎓 دليل الطالب: اللون والقراءة والدلالة</summary><div class="urine-strip-learning-content">${learningDetailsHTML}</div></details>` : ''}
                            </article>
                        `;
                    }).join('')}
                </div>

                <div class="urine-strips-details-grid">
                    <details>
                        <summary>⚙️ طريقة العمل العملية</summary>
                        <ol>${stripSteps.map(function (step) { return `<li>${step}</li>`; }).join('')}</ol>
                    </details>
                    <details>
                        <summary>✅ نقاط جودة مهمة</summary>
                        <ul>${stripQualityChecks.map(function (item) { return `<li>${item}</li>`; }).join('')}</ul>
                    </details>
                </div>

                <aside class="urine-strips-important-notes"><h3>⚠️ Important — ملاحظات الطالب</h3><ul>${importantNotes.map(function (item) { return `<li>${item}</li>`; }).join('')}</ul></aside>
                <aside class="urine-strips-warning">${uStrips.warningNote || ''}</aside>
            </section>
        `;
    }


    // ==================================================
    // 4️⃣ عرض الطفيليات والديدان
    // ==================================================

    // نتحقق هل التبويب الحالي هو stool_micro
    if (currentStoolTab === 'stool_micro') {


        // نمر على جميع الطفيليات
        for (let i = 0; i < sParasites.length; i++) {

            // نحصل على العنصر الحالي
            let item = sParasites[i];


            // نضيف كارت الطفيلي
            html += `

            <div class="stool-card" data-search-name="${item.name || ''}" style="background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #fde68a; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: right; direction: rtl;">

                <!-- اسم الطفيلي -->

                <h3 style="color: #78350f; margin-bottom: 5px; border-bottom: 2px solid #fde68a; padding-bottom: 5px;">

                    🪱 ${item.name}

                </h3>


                <!-- التصنيف الطبي -->

                <p style="margin: 4px 0; color: #d97706; font-size: 0.9rem;">

                    <b>التصنيف الطبي:</b>

                    ${item.type}

                </p>


                <!-- الطور التشخيصي -->

                <p style="margin: 4px 0;">

                    <b>📌 الطور التشخيصي:</b>

                    <span style="color: #b45309; font-weight: bold;">

                        ${item.stage}

                    </span>

                </p>


                <!-- الوصف المجهري -->

                <p style="margin: 4px 0;">

                    <b>🔍 الوصف المجهري:</b>

                    ${item.appearance}

                </p>


                <!-- الأعراض والتأثير الصحي -->

                <p style="margin: 4px 0;">

                    <b>⚠️ الأعراض والتأثير الصحي:</b>

                    ${item.clinicalSig}

                </p>

                ${renderV7LearningDetails(item.learningDetails, '🎓 دليل الطالب: الطور والعينة والتمييز')}


                <!-- الصورة -->

                <div style="margin-top: 12px; text-align: center;">

                    <small style="color:#666; display:block; margin-bottom: 4px;">

                        الشكل المجهري التشخيصي

                    </small>

                    <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                        style="width:100%; height:180px; object-fit:cover; border-radius:8px; border:1px solid #fde68a;" 
                        onerror="this.onerror=null; this.parentElement.hidden=true; this.remove();"
                    >

                </div>

            </div>

            `;
        }
    }


    // ==================================================
    // في النهاية نضع HTML داخل الصفحة
    // ==================================================

    container.innerHTML = html;

    const educationalStripImage = container.querySelector('[data-urine-strip-education-image]');
    if (educationalStripImage) {
        educationalStripImage.addEventListener('click', function () {
            const image = educationalStripImage.querySelector('img');
            if (!image) { return; }
            const lightbox = document.createElement('dialog');
            lightbox.className = 'urine-strip-lightbox';
            lightbox.innerHTML = '<button type="button" class="urine-strip-lightbox-close" aria-label="إغلاق الصورة">×</button><img src="' + image.src + '" alt="' + image.alt + '">';
            document.body.appendChild(lightbox);
            const closeLightbox = function () { lightbox.close(); lightbox.remove(); };
            lightbox.querySelector('.urine-strip-lightbox-close').addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function (event) { if (event.target === lightbox) { closeLightbox(); } });
            if (typeof lightbox.showModal === 'function') { lightbox.showModal(); } else { lightbox.setAttribute('open', ''); }
        });
    }
}


// ==========================================================
// 🧫 دالة بناء الكروت لجميع الأقسام
// ==========================================================
//
// هذه الدالة تستقبل subGroups
// ثم تقوم ببناء HTML لكل مجموعة فرعية
// ولكل تحليل موجود داخل المجموعة.
//
// تم الإبقاء على اسم الدالة كما هو:
// buildCardsHTML
//
// ==========================================================

function renderMicrobiology() {
    // نبحث عن العنصر الذي سيظهر بداخله قسم الأحياء الدقيقة
    const container = document.getElementById('microbiology-container');

    // إذا لم نجد العنصر، نوقف الدالة
    if (!container) {
        return;
    }

    // ==========================================
    // 🛡️ حماية من ظهور البيانات داخل صفحة التيوبات
    // ==========================================

    const isInsideTubesPage = container.closest('#tubes-page');
    let isInsideTubesSection = false;

    if (!isInsideTubesPage) {
        const tubesSection = container.closest('.tubes-section');
        if (tubesSection) {    
            isInsideTubesSection = true;    
        }
    }

    // إذا كانت الحاوية داخل صفحة التيوبات نمسح محتواها ونوقف الدالة
    if (isInsideTubesPage || isInsideTubesSection) {
        container.innerHTML = '';
        return;
    }

    // ==========================================
    // 🔍 التأكد من وجود بيانات الأحياء الدقيقة
    // ==========================================

    if (typeof microbiologyGroupData === 'undefined' || !microbiologyGroupData) {
        container.innerHTML = `
            <div style="text-align:center; padding:20px; color:#dc2626; font-weight:bold;">    
                ⚠️ لم يتم العثور على microbiologyGroupData    
            </div>
        `;    
        return;
    }

    // ==========================================
    // 🧱 بناء الكروت وعرضها
    // ==========================================

    const data = microbiologyGroupData;
    let subGroups = data.subGroups ? data.subGroups : [];

    // نرسل الأقسام إلى دالة بناء الكروت ونضعها داخل الحاوية
    const cardsHTML = buildCardsHTML(subGroups);
    container.innerHTML = `
        <section class="bacteria-foundations" aria-label="أساسيات البكتريا">
            <header class="bacteria-foundations-header">
                <p>أولاً: الأساسيات التعليمية</p>
                <h3>افهم العينة وGram stain والوسط قبل الانتقال إلى تعريف النوع</h3>
                <span>هذا الجزء يجمع المعلومات العامة فقط: المورفولوجيا، التصنيف الأولي، الأوساط، جمع العينات، والسلامة.</span>
            </header>
            ${cardsHTML}
        </section>
    `;
}

// ==========================================
// 🧱 دالة بناء الكروت لجميع الأقسام
// ==========================================

function buildCardsHTML(subGroups) {

    // هذا المتغير سيجمع كل HTML الذي سنبنيه
    let html = '';

    // ==========================================
    // بداية الحاوية الرئيسية
    // ==========================================
    html += `
        <div style="direction: rtl; text-align: right; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; flex-direction: column; gap: 32px;">
    `;

    // ==========================================
    // المرور على جميع الأقسام
    // ==========================================
    for (let i = 0; i < subGroups.length; i++) {
        const sub = subGroups[i];

        // ==========================================
        // تحديد هل هذا القسم هو الأوساط الزرعية
        // ==========================================
        let showBottomInfo = false;
        if (sub.subCategory && sub.subCategory.includes("الأوساط الزرعية")) {
            showBottomInfo = true;
        }

        // ==========================================
        // عنوان القسم + بداية شبكة الكروت
        // ==========================================
        html += `
            <div>
                <!-- عنوان القسم -->
                <h3 style="color: #6b21a8; font-size: 1.35rem; margin-top: 0; margin-bottom: 20px; font-weight: bold; text-align: right;">
                    ${sub.subCategory || ''}
                </h3>

                <!-- شبكة الكروت -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 20px; direction: rtl;">
        `;

        // ==========================================
        // التأكد من وجود الاختبارات داخل القسم
        // ==========================================
        let tests = sub.tests ? sub.tests : [];

        // ==========================================
        // بناء كروت الاختبارات
        // ==========================================
        for (let j = 0; j < tests.length; j++) {
            const test = tests[j];

            // معرفة هل tubeType يحتوي على رابط صورة
            let isImage = false;
            if (typeof test.tubeType === 'string') {
                const lowerTube = test.tubeType.toLowerCase();
                if (lowerTube.endsWith('.jpeg') || lowerTube.endsWith('.jpg') || lowerTube.endsWith('.png')) {
                    isImage = true;
                }
            }

            // بداية الكارت
            html += `
    <div
        class="test-card"
       data-search-name="${test.fullName || ''} ${test.shortName || ''}"
        style="background: #ffffff; border-radius: 18px; border: 2px solid #0284c7; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div>
                        <!-- عنوان التحليل -->
                        <div style="text-align: center; margin-bottom: 12px;">
                            <h4 style="margin: 0; color: #0f172a; font-size: 1.15rem; font-weight: bold;">
                                ${test.fullName || ''}
                            </h4>
                            <span style="color: #64748b; font-size: 0.85rem; display: block; margin-top: 4px;">
                                (${test.shortName || ''})
                            </span>
                        </div>
            `;

            // عرض الصورة إذا كانت موجودة
            if (isImage) {
                html += `
                    <div style="margin: 12px 0 16px 0; text-align: center;">
                        <img
                            src="${test.tubeType}"
                            alt="${test.fullName || ''}"
                            style="width: 100%; height: 165px; object-fit: cover; border-radius: 10px; border: 1px solid #e2e8f0; display: block;"
                            onerror="this.style.display='none'"
                        >
                    </div>
                `;
            }

            // النص والشرح
            html += `
                        <div style="color: #475569; font-size: 0.9rem; line-height: 1.6; text-align: center; margin-bottom: 20px;">
                            ${test.functionality || ''}
                        </div>
                    </div>
            `;

            // ==========================================
            // المربع السفلي (يظهر فقط في الأوساط الزرعية)
            // ==========================================
            if (showBottomInfo) {
                const noteText = (test.referenceRanges && test.referenceRanges.male) ? test.referenceRanges.male : 'لا يوجد';

                html += `
                    <div style="background: #f8fafc; border-radius: 12px; padding: 12px; font-size: 0.85rem; color: #334155; line-height: 1.8; border: 1px solid #f1f5f9;">
                        <!-- نوع العينة -->
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span>📌</span>
                            </b>
                            <span style="color: #64748b; margin-right: 4px;">
                                ${test.sampleType || 'غير محدد'}
                            </span>
                        </div>

                        <!-- الملاحظات -->
                        <div style="display: flex; align-items: flex-start; gap: 6px; margin-top: 4px;">
                            <span>💡</span>
                            <b></b>
                            <span style="color: #64748b; margin-right: 4px;">
                                ${noteText}
                            </span>
                        </div>
                    </div>
                `;
            }

            // إغلاق الكارت
            html += `
                </div>
            `;
        }

        // إغلاق شبكة الكروت والقسم
        html += `
                </div>
            </div>
        `;
    }

    // إغلاق الحاويات الرئيسية
    html += `
            </div>
        </div>
    `;

    return html;
}





// ==========================================
// 🧫 مكتبة البكتيريا الطبية
// ==========================================

// هذا المتغير يخزن النوع الحالي
// positive = موجب غرام
// negative = سالب غرام
let currentGramType = 'positive';


// ==========================================
// 🔘 فتح وإغلاق مكتبة البكتيريا
// ==========================================

function toggleBacteriaLibrary() {

    // الحصول على حاوية مكتبة البكتيريا
    const container = document.getElementById('bacteria-library-container');

    // الحصول على الزر
    const btn = document.getElementById('btn-show-bacteria');


    // إذا لم نجد الحاوية
    // نوقف الدالة
    if (!container) {
        return;
    }


    // ==========================================
    // إذا كانت المكتبة مفتوحة
    // ==========================================

    if (container.style.display === 'block') {

        // نخفي المكتبة
        container.style.display = 'none';


        // إذا كان الزر موجوداً
        if (btn) {

            // نعيد نص الزر الأصلي
            btn.innerHTML = '🔬 تصفح مكتبة البكتيريا الطبية (Bacteria Library)';

            // نعيد لون الزر
            btn.style.background = 'linear-gradient(135deg, #6b21a8, #9333ea)';
        }

    } else {

        // ==========================================
        // إذا كانت المكتبة مغلقة
        // ==========================================

        // نبني كروت البكتيريا
        renderBacteriaCards();

        // نظهر المكتبة
        container.style.display = 'block';


        // إذا كان الزر موجوداً
        if (btn) {

            // نغير نص الزر
            btn.innerHTML = '✖ إخفاء مكتبة البكتيريا';

            // نغير لون الزر إلى الأحمر
            btn.style.background = '#dc2626';
        }
    }
}


// ==========================================
// 🧫 التبديل بين موجب وسالب غرام
// ==========================================

function switchGramType(type) {

    // نخزن النوع الذي اختاره المستخدم
    currentGramType = type;

    // نعيد بناء الكروت حسب النوع الجديد
    renderBacteriaCards();
}


// ==========================================
// 🧱 بناء كروت البكتيريا — العارض السابق محفوظ للتوافق المرجعي
// ==========================================

function renderBacteriaCardsLegacy() {

    // الحصول على حاوية مكتبة البكتيريا
    const container = document.getElementById('bacteria-library-container');


    // إذا لم توجد الحاوية
    // نوقف الدالة
    if (!container) {
        return;
    }


    // ==========================================
    // تجهيز قائمة البيانات
    // ==========================================

    // في البداية نضع Array فارغة
    let dataList = [];


    // ==========================================
    // إذا كان النوع موجب غرام
    // ==========================================

    if (currentGramType === 'positive') {

        // نتأكد أن بيانات موجب غرام موجودة
        if (typeof gramPositiveBacteriaData !== 'undefined') {

            // نضع البيانات في dataList
            dataList = gramPositiveBacteriaData;
        }

    } else {

        // ==========================================
        // إذا كان النوع سالب غرام
        // ==========================================

        // نتأكد أن بيانات سالب غرام موجودة
        if (typeof gramNegativeBacteriaData !== 'undefined') {

            // نضع البيانات في dataList
            dataList = gramNegativeBacteriaData;
        }
    }


    // ==========================================
    // بناء أزرار موجب وسالب غرام
    // ==========================================

    let html = `
        <section class="bacteria-library-shell">
            <header class="bacteria-library-intro">
                <p class="bacteria-library-eyebrow">مسار مراجعة مخبري منظّم</p>
                <h3>ابدأ بالصبغة والشكل، ثم انتقل للمزرعة والاختبارات التفريقية</h3>
                <p>بطاقة النوع تساعدك في المقارنة التعليمية، لكنها لا تعوّض جودة العينة أو تعريف العزلة المؤكّد أو اختبار الحساسية وفق سياسة المختبر.</p>
                <ol><li>صبغة غرام والمورفولوجيا</li><li>المستعمرة والوسط</li><li>الاختبارات التفريقية أو وسائل التعريف المعتمدة</li><li>التحقق والجودة والحساسية عند الطلب</li></ol>
                <p class="bacteria-library-reference">مرجع المراجعة: <a href="https://www.ncbi.nlm.nih.gov/books/NBK562156/" target="_blank" rel="noopener noreferrer">NCBI</a>، <a href="https://www.cdc.gov/microbenet/php/about/index.html" target="_blank" rel="noopener noreferrer">CDC</a>، <a href="https://www.who.int/publications/i/item/WHO-CDS-CSR-RMD-2003.6" target="_blank" rel="noopener noreferrer">WHO</a>.</p>
            </header>

        <div style="
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 25px;
            direction: rtl;
        ">

            <!-- زر موجب غرام -->
            <button
                id="btn-gram-pos"
                onclick="switchGramType('positive')"
                style="
                    padding: 10px 22px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            `;


    // ==========================================
    // لون زر موجب غرام
    // ==========================================

    if (currentGramType === 'positive') {

        html += `
                    background: #6b21a8;
                    color: #fff;
        `;

    } else {

        html += `
                    background: #f3e8ff;
                    color: #6b21a8;
        `;
    }


    html += `
                "
            >
                🧫 موجب غرام (+ Gram)
            </button>


            <!-- زر سالب غرام -->
            <button
                id="btn-gram-neg"
                onclick="switchGramType('negative')"
                style="
                    padding: 10px 22px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    `;


    // ==========================================
    // لون زر سالب غرام
    // ==========================================

    if (currentGramType === 'negative') {

        html += `
                    background: #be123c;
                    color: #fff;
        `;

    } else {

        html += `
                    background: #ffe4e6;
                    color: #be123c;
        `;
    }


    html += `
                "
            >
                🧫 سالب غرام (- Gram)
            </button>

        </div>
    `;


    // ==========================================
    // التحقق من وجود بيانات
    // ==========================================

    if (dataList.length === 0) {

        html += `
            <div style="
                text-align: center;
                padding: 40px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 12px;
                border: 1px dashed #ccc;
                direction: rtl;
            ">

                <p style="
                    color: #6b7280;
                    font-size: 1.1rem;
                    margin: 0;
                ">
                    ⚠️ لا توجد بيانات مسجلة حالياً لهذه الفئة.
                </p>

            </div>
        `;

        // عرض الرسالة
        container.innerHTML = html;

        // إيقاف الدالة
        return;
    }


    // ==========================================
    // بداية شبكة الكروت
    // ==========================================

    html += `
        <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            direction: rtl;
        ">
    `;


    // ==========================================
    // بناء كروت البكتيريا
    // ==========================================

    for (let i = 0; i < dataList.length; i++) {

        // أخذ البكتيريا الحالية
        const bac = dataList[i];


        // ==========================================
        // تحديد ألوان الكارت حسب نوع غرام
        // ==========================================

        let cardBorderColor = '';
        let titleColor = '';
        let titleBorderColor = '';
        let boxBackground = '';

        if (currentGramType === 'positive') {

            cardBorderColor = 'rgba(107, 33, 168, 0.2)';
            titleColor = '#6b21a8';
            titleBorderColor = '#f3e8ff';
            boxBackground = 'rgba(107, 33, 168, 0.05)';

        } else {

            cardBorderColor = 'rgba(190, 18, 60, 0.2)';
            titleColor = '#be123c';
            titleBorderColor = '#ffe4e6';
            boxBackground = 'rgba(190, 18, 60, 0.05)';
        }


        // ==========================================
        // بداية كارت البكتيريا
        // ==========================================

        html += `

    <div
        class="bacteria-card"
        data-search-name="${bac.scientificName}"
        style="
            background: var(--bg-card, #fff);
            border-radius: 12px;
                padding: 18px;
                border: 1px solid ${cardBorderColor};
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                text-align: right;
            ">

                <!-- الاسم العلمي -->
                <h3 style="
                    color: ${titleColor};
                    font-style: italic;
                    margin-bottom: 10px;
                    border-bottom: 2px solid ${titleBorderColor};
                    padding-bottom: 5px;
                ">
                    🔬 ${bac.scientificName}
                </h3>


                <!-- شكل البكتيريا -->
                <p style="margin: 5px 0;">
                    <b>🧫 الشكل:</b> ${bac.shape}
                </p>


                <!-- صبغة غرام -->
                <p style="margin: 5px 0;">
                    <b>🧪 صبغة غرام:</b>
                    <span style="
                        color: ${bac.gramStain.includes('موجبة') ? '#7c3aed' : '#e11d48'};
                        font-weight: bold;
                    ">
                        ${bac.gramStain}
                    </span>
                </p>


                <!-- الحركة -->
                <p style="margin: 5px 0;">
                    <b>🏃 الحركة:</b> ${bac.motility}
                </p>


                <!-- الأبواغ -->
                <p style="margin: 5px 0;">
                    <b>🛡️ الأبواغ:</b> ${bac.spores}
                </p>


                <!-- الكبسولة -->
                <p style="margin: 5px 0;">
                    <b>💊 الكبسولة:</b> ${bac.capsule}
                </p>


                <!-- المصدر -->
                <p style="margin: 5px 0;">
                    <b>🌍 المصدر:</b> ${bac.source}
                </p>


                <!-- الأمراض -->
                <p style="margin: 5px 0;">
                    <b>⚠️ الأمراض:</b> ${bac.diseases}
                </p>


                <!-- العينات -->
                <p style="margin: 5px 0;">
                    <b>🧪 العينات:</b> ${bac.specimens}
                </p>


                <!-- الأوساط -->
                <p style="margin: 5px 0;">
                    <b>🧫 الأوساط:</b> ${bac.media}
                </p>


                <!-- وصف المستعمرات -->
                <p style="
                    margin: 5px 0;
                    white-space: pre-line;
                ">
                    <b>🔍 المستعمرات:</b>
                    ${bac.colonyDescription}
                </p>


                <!-- الفحوصات الكيميائية الحيوية -->
                <div style="
                    margin: 10px 0;
                    background: ${boxBackground};
                    padding: 8px;
                    border-radius: 8px;
                ">

                    <b style="color: ${titleColor};">
                        📊 الفحوصات:
                    </b>

                    <br>


                    <!-- الفحوصات الموجبة -->
                    <small style="
                        color: #16a34a;
                        display: block;
                    ">
                        <b>موجبة (+):</b>
                        ${bac.biochemicalTests.positive.join(', ')}
                    </small>


                    <!-- الفحوصات السالبة -->
                    <small style="
                        color: #dc2626;
                        display: block;
                    ">
                        <b>سالبة (-):</b>
                        ${bac.biochemicalTests.negative.join(', ')}
                    </small>

                </div>


                <!-- العلاج -->
                <p style="margin: 5px 0;">
                    <b>💊 العلاج الشائع:</b>
                    ${bac.treatment}
                </p>


                <!-- الصور -->
                <div style="
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                ">

                    <!-- الصورة المجهرية -->
                    <div style="
                        flex: 1;
                        text-align: center;
                    ">

                        <small style="color:#666;">
                            شكل مجهري
                        </small>

                        <img
                            src="${bac.microImage}"
                            style="
                                width:100%;
                                height:100px;
                                object-fit:cover;
                                border-radius:6px;
                                border:1px solid #ddd;
                            "
                            onerror="this.onerror=null; this.parentElement.hidden=true; this.remove();"
                        >

                    </div>


                    <!-- صورة المستعمرة -->
                    <div style="
                        flex: 1;
                        text-align: center;
                    ">

                        <small style="color:#666;">
                            المستعمرة
                        </small>

                        <img
                            src="${bac.colonyImage}"
                            style="
                                width:100%;
                                height:100px;
                                object-fit:cover;
                                border-radius:6px;
                                border:1px solid #ddd;
                            "
                            onerror="this.onerror=null; this.parentElement.hidden=true; this.remove();"
                        >

                    </div>

                </div>

            </div>
        `;
    }


    // ==========================================
    // إغلاق شبكة الكروت
    // ==========================================

    html += `
        </div>
        </section>
    `;


    // ==========================================
    // عرض النتيجة داخل الصفحة
    // ==========================================

    container.innerHTML = html;
}

// V10: عارض بديل منظم؛ لا يغير مصفوفات البكتريا أو مفاتيحها أو مسارات صورها.
function bacteriaSafeText(value) {
    if (value === undefined || value === null || String(value).trim() === '') { return ''; }
    return escapeInterpretationHTML(String(value)).replace(/\n/g, '<br>');
}

function bacteriaFieldMarkup(label, value, icon) {
    const text = bacteriaSafeText(value);
    return text ? `<p class="bacteria-profile-field"><b>${icon} ${escapeInterpretationHTML(label)}:</b><span>${text}</span></p>` : '';
}

function bacteriaListMarkup(items) {
    return Array.isArray(items) && items.length
        ? items.map(function (item) { return `<li>${bacteriaSafeText(item)}</li>`; }).join('')
        : '';
}

function bacteriaImageMarkup(path, label, alt) {
    const source = bacteriaSafeText(path);
    if (!source) { return ''; }
    return `<figure class="bacteria-profile-image"><figcaption>${escapeInterpretationHTML(label)}</figcaption><img src="${source}" alt="${bacteriaSafeText(alt)}" loading="lazy" decoding="async" onerror="this.parentElement.hidden=true;"></figure>`;
}

function renderBacteriaProfileCard(bac, gramType) {
    const scientificName = bacteriaSafeText(bac.scientificName || 'بكتريا غير مسمّاة');
    const gram = bacteriaSafeText(bac.gramStain || (gramType === 'positive' ? 'موجبة غرام' : 'سالبة غرام'));
    const identity = [
        bacteriaFieldMarkup('الاسم العلمي', bac.scientificName, '🔬'),
        bacteriaFieldMarkup('صبغة غرام', bac.gramStain, '🧪'),
        bacteriaFieldMarkup('الشكل والمورفولوجيا', bac.shape, '🧫'),
        bacteriaFieldMarkup('الحركة', bac.motility, '🏃'),
        bacteriaFieldMarkup('الأبواغ', bac.spores, '🛡️'),
        bacteriaFieldMarkup('الكبسولة أو البنية السطحية', bac.capsule, '🧬')
    ].join('');
    const clinical = [
        bacteriaFieldMarkup('المصدر أو الموضع الشائع', bac.source, '🌍'),
        bacteriaFieldMarkup('الأمراض أو الأهمية السريرية', bac.diseases, '⚠️')
    ].join('');
    const specimen = bacteriaFieldMarkup('العينات المناسبة المتاحة في البيانات', bac.specimens, '🧪');
    const culture = [
        bacteriaFieldMarkup('الأوساط الزرعية المناسبة', bac.media, '🧫'),
        bacteriaFieldMarkup('شكل النمو أو المستعمرات', bac.colonyDescription, '🔍')
    ].join('');
    const positiveTests = bacteriaListMarkup(bac.biochemicalTests && bac.biochemicalTests.positive);
    const negativeTests = bacteriaListMarkup(bac.biochemicalTests && bac.biochemicalTests.negative);
    const images = [
        bacteriaImageMarkup(bac.microImage, 'الشكل المجهري', scientificName),
        bacteriaImageMarkup(bac.colonyImage, 'شكل المستعمرة', scientificName)
    ].join('');
    const gramClass = gramType === 'positive' ? 'is-gram-positive' : 'is-gram-negative';

    return `
        <article class="bacteria-card bacteria-profile-card ${gramClass}" data-search-name="${scientificName} ${gram}">
            <header class="bacteria-profile-head"><div><p>وحدة بكتريا مستقلة</p><h3>${scientificName}</h3></div><span>${gram}</span></header>
            ${identity ? `<details class="bacteria-profile-section" open><summary>الهوية والخصائص الأساسية</summary><div class="bacteria-profile-body">${identity}</div></details>` : ''}
            ${clinical ? `<details class="bacteria-profile-section"><summary>المصدر والأهمية السريرية</summary><div class="bacteria-profile-body">${clinical}</div></details>` : ''}
            ${specimen ? `<details class="bacteria-profile-section"><summary>العينات والفحص المخبري</summary><div class="bacteria-profile-body">${specimen}<p class="bacteria-profile-missing">تُتبع تعليمات الجمع والنقل والحفظ المعتمدة في بروتوكول المختبر؛ لا تُعرض هنا تفاصيل غير موجودة في بيانات هذا النوع.</p></div></details>` : ''}
            ${culture ? `<details class="bacteria-profile-section"><summary>الزرع والمستعمرات</summary><div class="bacteria-profile-body">${culture}</div></details>` : ''}
            ${(positiveTests || negativeTests) ? `<details class="bacteria-profile-section"><summary>الاختبارات الكيميائية الحيوية والنتائج المتاحة</summary><div class="bacteria-profile-body bacteria-biochemical-grid">${positiveTests ? `<section class="bacteria-test-result bacteria-test-positive"><h5>موجب (+)</h5><ul>${positiveTests}</ul></section>` : ''}${negativeTests ? `<section class="bacteria-test-result bacteria-test-negative"><h5>سالب (-)</h5><ul>${negativeTests}</ul></section>` : ''}</div></details>` : ''}
            ${bac.treatment ? `<details class="bacteria-profile-section"><summary>معلومة حساسية أو معالجة مسجلة</summary><div class="bacteria-profile-body">${bacteriaFieldMarkup('المعلومة المسجلة في البيانات', bac.treatment, '📌')}<p class="bacteria-profile-missing">هذه معلومة تعليمية مسجلة وليست توصية علاجية؛ تُقرأ الحساسية حسب العزلة والـbreakpoints وسياسة المختبر.</p></div></details>` : ''}
            ${images ? `<div class="bacteria-profile-images">${images}</div>` : ''}
        </article>
    `;
}

function renderBacteriaCards() {
    const container = document.getElementById('bacteria-library-container');
    if (!container) { return; }
    const isPositive = currentGramType === 'positive';
    const dataList = isPositive
        ? (typeof gramPositiveBacteriaData !== 'undefined' ? gramPositiveBacteriaData : [])
        : (typeof gramNegativeBacteriaData !== 'undefined' ? gramNegativeBacteriaData : []);
    const cards = dataList.map(function (bac) { return renderBacteriaProfileCard(bac, currentGramType); }).join('');

    container.innerHTML = `
        <section class="bacteria-library-shell" aria-label="مكتبة البكتريا">
            <header class="bacteria-library-intro">
                <p class="bacteria-library-eyebrow">ثانياً: مكتبة البكتريا</p>
                <h3>كل بطاقة تخص نوعاً واحداً ولا تخلط معلوماته مع الأساسيات العامة</h3>
                <p>اختر مجموعة Gram ثم افتح وحدات البطاقة بالترتيب: الهوية، الأهمية السريرية، العينة، الزرع، الاختبارات، ثم المعلومات المسجلة عن الحساسية أو المعالجة.</p>
                <p class="bacteria-library-reference">البيانات المعروضة من مكتبة الموقع الحالية؛ بطاقة النوع لا تعوّض تعريف العزلة المؤكّد أو سياسة الجودة في المختبر.</p>
            </header>
            <div class="bacteria-library-tabs" role="tablist" aria-label="مجموعة صبغة غرام">
                <button id="btn-gram-pos" type="button" class="bacteria-gram-tab ${isPositive ? 'is-active is-positive' : ''}" onclick="switchGramType('positive')" aria-pressed="${isPositive}">🧫 موجب غرام (+ Gram)</button>
                <button id="btn-gram-neg" type="button" class="bacteria-gram-tab ${!isPositive ? 'is-active is-negative' : ''}" onclick="switchGramType('negative')" aria-pressed="${!isPositive}">🧫 سالب غرام (- Gram)</button>
            </div>
            <div class="bacteria-library-count">${dataList.length} بطاقة بكتريا ضمن المجموعة المختارة</div>
            ${cards ? `<div class="bacteria-profile-grid">${cards}</div>` : '<p class="bacteria-library-empty">لا توجد بيانات مسجلة حالياً لهذه المجموعة.</p>'}
        </section>
    `;
}


// ==========================================
// ▶️ تشغيل الأحياء الدقيقة عند تحميل الصفحة
// ==========================================

// ننتظر حتى يتم تحميل HTML بالكامل
document.addEventListener('DOMContentLoaded', function () {

    // بعد تحميل الصفحة نستدعي دالة الأحياء الدقيقة
    renderMicrobiology();

});



// ============================================================
// 🔎 محرك البحث العميق والشامل في Zak Lab
// ============================================================
// هذا المحرك يبني سجلاً لكل عنصر مُسمّى ولكل عقدة معلومات داخل data.js.
// القيمة المراد البحث عنها تُربط دائماً بأقرب بطاقة أصل يمكن عرضها، لذلك لا تضيع
// النتائج عندما تكون البيانات متداخلة مثل referenceRanges أو physicalExams.

(function () {
    'use strict';

    const searchInput = document.getElementById('main-search-input');
    const resultsContainer = document.getElementById('global-search-results');
    const MAX_RESULTS = 60;
    let searchIndex = [];

    if (!searchInput || !resultsContainer) {
        console.warn('Zak Lab Search: عناصر البحث غير موجودة في HTML.');
        return;
    }

    function normalizeText(value) {
        return String(value ?? '')
            .toLowerCase()
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/[._\-/\\()[\]{}:,;!?"']/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function stripMarkup(value) {
        return String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function labelFromPath(path) {
        const labels = {
            typesOfSpecimens: 'أنواع العينات', physicalExams: 'الفحص الفيزيائي',
            chemicalExams: 'الفحص الكيميائي', subGroups: 'المجموعة الفرعية',
            tests: 'التحليل', referenceRanges: 'القيم المرجعية', male: 'الرجال',
            female: 'النساء', children: 'الأطفال', parts: 'أجزاء الجهاز',
            practicalSteps: 'خطوات التشغيل', biochemicalTests: 'الفحوصات الكيميائية',
            learningPath: 'مسار التعلم', reportChecklist: 'قائمة التحقق',
            practiceCases: 'حالات التدريب', categories: 'فلاتر الأقسام',
            values: 'قيم الحالة التدريبية', options: 'خيارات التدريب'
        };
        const last = path[path.length - 1];
        return labels[last] || String(last || 'تفاصيل العنصر').replace(/([A-Z])/g, ' $1').trim();
    }

    // بعض الحقول تحمل تفاصيل الفحص وليست اسماً مستقلاً للبطاقة.
    // يبقى نصها قابلاً للبحث من خلال الفحص الأب، لكن لا تظهر كأنها نتيجة مستقلة.
    function isTechnicalDetailPath(path) {
        const technicalKeys = [
            'high_interpretation', 'low_interpretation', 'clinical_notes',
            'clinical_significance', 'normal_range', 'usedTests',
            'high_significance', 'low_significance', 'referenceRanges',
            'practicalSteps', 'theoreticalBasis', 'mechanism', 'notes',
            'specs', 'parts', 'sourceReference', 'source_ids', 'aliases',
            // تفاصيل واجهة شرائط البول: تُفهرس ضمن الشريط الأم ولا تعرض بعناوين مفاتيح إنجليزية.
            'qualityChecks', 'colorComparisonFlow', 'resultReadingGuide', 'importantNotes',
            'educationalImage', 'educationalImageCaption',
            // الدليل التفصيلي للوسادة يبقى ضمن بطاقة الفحص ولا يظهر بمفاتيح تقنية مستقلة.
            'learningDetails', 'whatItDetects', 'purpose', 'biologicalMeaning', 'colorReaction',
            'colorChartInterpretation', 'resultScaleMeaning', 'readingTime', 'specimenNote', 'studentFriendly',
            // حقول الدليل التعليمي للتحاليل في V6: يظهر النص ضمن بطاقة التحليل الأم فقط.
            'whyTest', 'principle', 'clinicalSignificance', 'preAnalyticalNotes', 'simpleExplanation', 'rangeCaveat',
            // حقول V7 للبول والبراز والطفيليات: تفهرس ضمن العنصر الأم لا كعناوين تقنية مستقلة.
            'studentWorkflow', 'collectionGuide', 'rejectionCriteria', 'microscopyGuide',
            'infectiveStage', 'specimen', 'distinction', 'whyReadTogether', 'methodAndSpecimen',
            'interpretationSequence', 'confirmationNote', 'method', 'interpretation', 'pitfall',
            // حقول داخل الوحدة التعليمية: يبقى محتواها قابلاً للبحث ضمن الدرس الأم،
            // لكنها لا تظهر للمستخدم كأنها بطاقات مستقلة باسم تقني مثل diagram أو keywords.
            'diagram', 'keywords', 'selfCheck', 'keyPoints', 'rules',
            'studyPath', 'moduleImage', 'heroImage',
            // حقول الحالة التدريبية تبقى ضمن نص الحالة الأم ولا تعرض كخيارات أو قيم منفصلة.
            'values', 'options', 'correctIndex', 'explanation', 'question', 'pattern', 'intro', 'detail', 'prompt',
            // نتائج فرعية لفحوص كيميائية؛ تعرض ضمن الكائن البكتيري أو الفحص الأم.
            'positive', 'negative'
        ];
        return technicalKeys.includes(path[path.length - 1]);
    }

    function getItemName(item) {
        if (!item || typeof item !== 'object') {
            return '';
        }

        const keys = [
            'test_name_ar', 'test_name_en', 'abbreviation', 'fullName', 'name', 'title',
            'testName', 'scientificName', 'bacteriaName', 'arabicName', 'englishName',
            'shortName', 'groupName', 'label', 'param', 'test', 'type', 'subCategory',
            'category', 'organism', 'finding', 'id'
        ];

        for (const key of keys) {
            if (typeof item[key] === 'string' && stripMarkup(item[key])) {
                return stripMarkup(item[key]);
            }
        }
        return '';
    }

    function getSummary(item) {
        if (!item || typeof item !== 'object') {
            return '';
        }
        const keys = [
            'shortName', 'arabicName', 'description', 'definition', 'functionality',
            'clinicalSig', 'use', 'appearance', 'normalRange', 'normal', 'abnormal',
            'sampleType', 'tubeType', 'gramStain', 'mechanism', 'notes'
        ];
        for (const key of keys) {
            if (typeof item[key] === 'string' && stripMarkup(item[key])) {
                return stripMarkup(item[key]).slice(0, 170);
            }
        }
        return '';
    }

    function collectText(value, seen) {
        const visited = seen || new WeakSet();
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return stripMarkup(value);
        }
        if (typeof value !== 'object' || visited.has(value)) {
            return '';
        }
        visited.add(value);
        return Object.keys(value).map(function (key) {
            return key + ' ' + collectText(value[key], visited);
        }).join(' ');
    }

    // هذه القائمة تمثل جميع مجموعات البيانات المعلنة في data.js الحالي.
    // يمر محرك الفهرسة داخل كل مجموعة بشكل عميق، ولا يقتصر على أول مستوى منها.
    function getSearchSources() {
        const builtInSources = [
            { key: 'tubes', label: '🧪 التيوبات', pageId: 'tubes-page', containerId: 'tubes-container', getData: function () { return typeof tubesData !== 'undefined' ? tubesData : []; } },
            { key: 'equipment', label: '🔬 الأجهزة', pageId: 'equipment-page', containerId: 'equipment-container', equipment: true, equipmentTab: 'devices', getData: function () { return getEquipmentEntries().map(function (entry) { return entry.data; }); } },
            { key: 'lab-tools', label: '🧰 الأدوات المختبرية', pageId: 'equipment-page', containerId: 'lab-tools-container', equipmentTab: 'tools', getData: function () { return getDataCollection(['labToolsData', 'labTools', 'tools', 'laboratoryTools'], []); } },
            { key: 'hematology', label: '🩸 أمراض الدم', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof hematologyGroupData !== 'undefined' ? hematologyGroupData : {}; } },
            { key: 'chemistry', label: '🧪 الكيمياء السريرية', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof clinicalChemistryGroupData !== 'undefined' ? clinicalChemistryGroupData : {}; } },
            { key: 'coagulation', label: '🩸 التجلط', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof coagulationGroupData !== 'undefined' ? coagulationGroupData : {}; } },
            { key: 'immunology', label: '🛡️ المناعة والأمصال', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof immunologyGroupData !== 'undefined' ? immunologyGroupData : {}; } },
            { key: 'hormones', label: '🧬 الهرمونات', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof hormonesGroupData !== 'undefined' ? hormonesGroupData : {}; } },
            { key: 'blood-bank', label: '🩸 بنك الدم', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof bloodBankGroupData !== 'undefined' ? bloodBankGroupData : {}; } },
            { key: 'virology', label: '🦠 علم الفيروسات', pageId: 'tests-page', containerId: 'tests-container', testGroup: true, getData: function () { return typeof virologyGroupData !== 'undefined' ? virologyGroupData : {}; } },
            { key: 'molecular-biology', label: '🧬 الأحياء الجزيئية', pageId: 'molecular-genetics-page', containerId: 'molecular-genetics-container', molecularGeneticsTab: 'molecular', getData: function () { return typeof molecularBiologyGroupData !== 'undefined' ? molecularBiologyGroupData : {}; } },
            { key: 'genetics', label: '🧬 الوراثة والجينات', pageId: 'molecular-genetics-page', containerId: 'molecular-genetics-container', molecularGeneticsTab: 'genetics', getData: function () { return typeof geneticsGroupData !== 'undefined' ? geneticsGroupData : {}; } },
            { key: 'interpretation', label: '📋 تفسير التحاليل', pageId: 'interpretation-page', containerId: 'interpretation-container', interpretation: true, getData: function () { return Object.assign({}, typeof interpretationGuidesData !== 'undefined' ? interpretationGuidesData : {}, { tests: typeof interpretationEngineTests !== 'undefined' ? interpretationEngineTests : [] }); } },
            { key: 'practical-lab', label: '🧪 المختبر العملي', pageId: 'practical-lab-page', containerId: 'practical-lab-container', practicalLab: true, getData: function () { return typeof practicalLabData !== 'undefined' ? practicalLabData : {}; } },
            { key: 'microbiology', label: '🦠 الأحياء الدقيقة', pageId: 'microbiology-page', containerId: 'microbiology-container', microbiology: true, getData: function () { return typeof microbiologyGroupData !== 'undefined' ? microbiologyGroupData : {}; } },
            { key: 'gram-positive', label: '🦠 بكتيريا موجبة الغرام', pageId: 'microbiology-page', containerId: 'bacteria-library-container', bacteriaLibrary: true, gramType: 'positive', getData: function () { return typeof gramPositiveBacteriaData !== 'undefined' ? gramPositiveBacteriaData : []; } },
            { key: 'gram-negative', label: '🦠 بكتيريا سالبة الغرام', pageId: 'microbiology-page', containerId: 'bacteria-library-container', bacteriaLibrary: true, gramType: 'negative', getData: function () { return typeof gramNegativeBacteriaData !== 'undefined' ? gramNegativeBacteriaData : []; } },
            { key: 'urine-overview', label: '💧 فحص البول', pageId: 'urine-stool-page', containerId: 'urine-stool-container', stoolTab: 'overview', getData: function () { return typeof urineOverviewData !== 'undefined' ? urineOverviewData : {}; } },
            { key: 'urine-microscopy', label: '🔬 الفحص المجهري للبول', pageId: 'urine-stool-page', containerId: 'urine-stool-container', stoolTab: 'urine_micro', getData: function () { return typeof urineMicroscopicData !== 'undefined' ? urineMicroscopicData : []; } },
            { key: 'urine-reagent-strips', label: '🧪 شرائط كواشف البول', pageId: 'urine-stool-page', containerId: 'urine-stool-container', stoolTab: 'urine_strips', getData: function () { return typeof urineReagentStripData !== 'undefined' ? urineReagentStripData : {}; } },
            { key: 'stool-overview', label: '💩 فحص البراز', pageId: 'urine-stool-page', containerId: 'urine-stool-container', stoolTab: 'overview', getData: function () { return typeof stoolOverviewData !== 'undefined' ? stoolOverviewData : {}; } },
            { key: 'stool-parasites', label: '🪱 طفيليات البراز', pageId: 'urine-stool-page', containerId: 'urine-stool-container', stoolTab: 'stool_micro', getData: function () { return typeof stoolParasitesData !== 'undefined' ? stoolParasitesData : []; } }
        ];
        const extensionSources = typeof zakLabSearchExtensions !== 'undefined' && Array.isArray(zakLabSearchExtensions)
            ? zakLabSearchExtensions.filter(function (source) {
                return source && source.key && source.pageId && source.containerId;
            }).map(function (source) {
                return Object.assign({}, source, {
                    getData: function () { return source.data || {}; }
                });
            })
            : [];
        return builtInSources.concat(extensionSources);
    }

    function addDeepEntries(value, source, entries, path, anchor, seen) {
        const visited = seen || new WeakSet();
        const currentPath = path || [];
        const nearestAnchor = anchor || '';

        if (value === null || value === undefined || typeof value !== 'object' || visited.has(value)) {
            return;
        }
        visited.add(value);

        const ownName = getItemName(value);
        const targetName = ownName || nearestAnchor;
        const values = Object.values(value);
        const hasDirectValue = values.some(function (item) {
            return typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean';
        });

        // نستخدم اسم العنصر أولاً. المسارات التقنية لا تحتاج بطاقة مستقلة،
        // لأن محتواها موجود ضمن نص العنصر الأب ويمكن الوصول إليه بالبحث.
        const displayName = ownName || (
            hasDirectValue && !isTechnicalDetailPath(currentPath)
                ? labelFromPath(currentPath)
                : ''
        );
        if (displayName) {
            entries.push({
                id: '',
                name: displayName,
                targetName: targetName || displayName,
                summary: getSummary(value),
                breadcrumb: currentPath
                    .filter(function (segment) {
                        return !/^\d+$/.test(String(segment)) && segment !== 'parameters' && segment !== 'learningDetails';
                    })
                    .map(function (segment) { return labelFromPath([segment]); })
                    .join(' ← '),
                searchText: normalizeText(collectText(value)),
                source: source
            });
        }

        Object.keys(value).forEach(function (key) {
            addDeepEntries(value[key], source, entries, currentPath.concat(key), targetName, visited);
        });
    }

    // المختبر العملي يملك بيانات ذات جداول وأسئلة متداخلة؛ نُفهرس نقاط التعلم
    // باسم واضح بدلاً من عرض مفاتيح البنية التقنية مثل columns أو rows أو 0.
    function addPracticalLabEntries(data, source, entries) {
        const experiments = data && Array.isArray(data.experiments) ? data.experiments : [];
        function pushEntry(name, targetName, summary, breadcrumb, searchParts) {
            if (!name) { return; }
            entries.push({
                id: '',
                name: name,
                targetName: targetName || name,
                summary: summary || '',
                breadcrumb: breadcrumb || 'المختبر العملي',
                searchText: normalizeText([name, targetName, summary].concat(searchParts || []).filter(Boolean).join(' ')),
                source: source
            });
        }
        experiments.forEach(function (experiment) {
            if (!experiment) { return; }
            const target = experiment.title || experiment.englishTitle || 'المختبر العملي';
            const context = [experiment.title, experiment.englishTitle, experiment.category, experiment.description, experiment.principle];
            pushEntry(target, target, experiment.description, 'المختبر العملي', context);
            (experiment.sampleMethods || []).forEach(function (item) {
                pushEntry(item.label || item.name, target, item.description || item.notes, 'المختبر العملي ← طرق جمع العينة', context.concat([item.name, item.label, item.notes]));
            });
            (experiment.materials || []).forEach(function (item) {
                pushEntry(item.arabicName || item.name, target, item.function || item.description, 'المختبر العملي ← المواد والأدوات', context.concat([item.name, item.arabicName, item.use, item.safety]));
            });
            (experiment.reagents || []).forEach(function (item) {
                pushEntry(item.name, target, item.description, 'المختبر العملي ← الكواشف', context.concat([item.name, item.description]));
            });
            (experiment.anatomyGuide || []).forEach(function (item) {
                pushEntry(item.label || item.name, target, item.description, 'المختبر العملي ← دليل المواضع', context.concat([item.name, item.label, item.description]));
            });
            (experiment.steps || []).forEach(function (item) {
                pushEntry(item.title, target, item.description, 'المختبر العملي ← الخطوات', context.concat([item.title, item.description]));
            });
            (experiment.visualGuide || []).forEach(function (item) {
                pushEntry(item.title, target, item.description, 'المختبر العملي ← دليل مفاهيمي', context.concat([item.title, item.description]));
            });
            (experiment.tables || []).forEach(function (item) {
                pushEntry(item.title, target, item.caption, 'المختبر العملي ← جداول التدريب', context.concat([item.title, item.caption, (item.rows || []).flat().join(' ')]));
            });
            (experiment.commonErrors || []).forEach(function (item) {
                pushEntry(item.error, target, item.correct, 'المختبر العملي ← أخطاء شائعة', context.concat([item.error, item.why, item.correct]));
            });
            (experiment.quiz || []).forEach(function (item) {
                pushEntry(item.question, target, item.explanation, 'المختبر العملي ← اختبر نفسك', context.concat([item.question, (item.options || []).join(' '), item.explanation]));
            });
        });
    }

    // ملف المطور كيان واحد في الواجهة، لذلك لا نعرض مفاتيحه الداخلية مثل
    // quranQuote أو skills كنتائج مستقلة. يبقى كل النص قابلاً للبحث من البطاقة نفسها.
    function addDeveloperProfileEntry(profile, source, entries) {
        if (!profile || typeof profile !== 'object') { return; }
        const name = profile.name || profile.latinName || 'معلومات المطور';
        const summary = profile.aboutDeveloper || profile.projectIntroduction || profile.title || '';
        entries.push({
            id: '',
            name: name,
            targetName: name,
            summary: summary,
            breadcrumb: 'قسم المطور',
            searchText: normalizeText(collectText(profile)),
            source: source
        });
    }

    function buildSearchIndex() {
        const rawEntries = [];
        getSearchSources().forEach(function (source) {
            const sourceData = source.getData();
            if (source.practicalLab) {
                addPracticalLabEntries(sourceData, source, rawEntries);
                return;
            }
            if (source.developerProfile) {
                addDeveloperProfileEntry(sourceData, source, rawEntries);
                return;
            }
            addDeepEntries(sourceData, source, rawEntries, [], '', new WeakSet());
        });

        const seen = new Set();
        searchIndex = rawEntries.filter(function (entry) {
            const unique = entry.source.key + '|' + normalizeText(entry.name) + '|' + normalizeText(entry.targetName) + '|' + entry.breadcrumb;
            if (seen.has(unique)) {
                return false;
            }
            seen.add(unique);
            entry.id = 'zak-result-' + seen.size;
            return true;
        });
        console.info('Zak Lab Search: تم فهرسة ' + searchIndex.length + ' سجل عميق من كل البيانات.');
    }

    function scoreEntry(entry, query, words) {
        const name = normalizeText(entry.name);
        const target = normalizeText(entry.targetName);
        if (!words.every(function (word) { return entry.searchText.includes(word) || name.includes(word) || target.includes(word); })) {
            return 0;
        }
        let score = entry.searchText.includes(query) ? 150 : 0;
        if (name === query || target === query) { score += 1000; }
        else if (name.startsWith(query) || target.startsWith(query)) { score += 720; }
        else if (name.includes(query) || target.includes(query)) { score += 480; }
        words.forEach(function (word) { score += name.includes(word) || target.includes(word) ? 120 : 18; });
        return score;
    }

    function closeResults() {
        resultsContainer.hidden = true;
        resultsContainer.innerHTML = '';
    }

    if (!resultsContainer.dataset.delegated) {
        resultsContainer.addEventListener('click', function (event) {
            const button = event.target.closest('[data-result-id]');
            if (!button || !resultsContainer.contains(button)) { return; }
            const entry = searchIndex.find(function (item) { return item.id === button.dataset.resultId; });
            if (entry) { openEntry(entry); }
        });
        resultsContainer.dataset.delegated = 'true';
    }

    function resultMarkup(entry) {
        const summary = entry.summary ? '<p class="zak-search-result-summary">' + escapeHTML(entry.summary) + '</p>' : '';
        const breadcrumb = entry.breadcrumb && normalizeText(entry.breadcrumb) !== normalizeText(entry.name)
            ? '<span class="zak-search-category">' + escapeHTML(entry.source.label + ' — ' + entry.breadcrumb) + '</span>'
            : '<span class="zak-search-category">' + escapeHTML(entry.source.label) + '</span>';
        return '<button type="button" class="zak-search-result" data-result-id="' + escapeHTML(entry.id) + '"><span class="zak-search-icon" aria-hidden="true">' + escapeHTML(entry.source.label.split(' ')[0]) + '</span><span class="zak-search-info"><strong class="zak-search-title">' + escapeHTML(entry.name) + '</strong>' + breadcrumb + summary + '</span></button>';
    }

    function renderResults(results, query) {
        if (!query) {
            closeResults();
            return;
        }
        if (!results.length) {
            resultsContainer.innerHTML = '<div class="zak-search-results-box"><p class="zak-search-empty">لا توجد نتائج مطابقة. جرّب اسماً أو اختصاراً أو كلمة من التفاصيل.</p></div>';
            resultsContainer.hidden = false;
            return;
        }
        const visible = results.slice(0, MAX_RESULTS);
        resultsContainer.innerHTML = '<div class="zak-search-results-box"><p class="zak-search-count">تم العثور على ' + results.length + ' نتيجة. تظهر أول ' + visible.length + ' نتيجة.</p>' + visible.map(resultMarkup).join('') + '</div>';
        resultsContainer.hidden = false;
        // Click handling is delegated once on the stable results container.
    }

    function resetTestGroupState() {
        if (typeof isHematologyOpen !== 'undefined') { isHematologyOpen = false; }
        if (typeof isChemistryOpen !== 'undefined') { isChemistryOpen = false; }
        if (typeof isCoagulationOpen !== 'undefined') { isCoagulationOpen = false; }
        if (typeof isImmunologyOpen !== 'undefined') { isImmunologyOpen = false; }
        if (typeof isHormonesOpen !== 'undefined') { isHormonesOpen = false; }
        if (typeof isBloodBankOpen !== 'undefined') { isBloodBankOpen = false; }
        if (typeof isVirologyOpen !== 'undefined') { isVirologyOpen = false; }
        if (typeof isMolecularOpen !== 'undefined') { isMolecularOpen = false; }
    }

    function showTestGroup(key) {
        const renderers = {
            hematology: typeof renderHematologyGroup === 'function' ? renderHematologyGroup : null,
            chemistry: typeof renderClinicalChemistryGroup === 'function' ? renderClinicalChemistryGroup : null,
            coagulation: typeof renderCoagulationGroup === 'function' ? renderCoagulationGroup : null,
            immunology: typeof renderImmunologyGroup === 'function' ? renderImmunologyGroup : null,
            hormones: typeof renderHormonesGroup === 'function' ? renderHormonesGroup : null,
            'blood-bank': typeof renderBloodBankGroup === 'function' ? renderBloodBankGroup : null,
            virology: typeof renderVirologyGroup === 'function' ? renderVirologyGroup : null,
            molecular: typeof renderMolecularGroup === 'function' ? renderMolecularGroup : null
        };
        if (renderers[key]) {
            resetTestGroupState();
            renderers[key]();
        }
    }

    function prepareSource(entry) {
        const source = entry.source;
        if (source.equipment && typeof renderAllEquipment === 'function') { renderAllEquipment(); }
        if (source.equipmentTab && typeof switchEquipmentToolsTab === 'function') { switchEquipmentToolsTab(source.equipmentTab); }
        if (source.testGroup) { showTestGroup(source.key); }
        if (source.interpretation && typeof renderInterpretationPage === 'function') {
            const targetText = normalizeText(entry.targetName || entry.name);
            const matchedTest = typeof interpretationEngineTests !== 'undefined'
                ? interpretationEngineTests.find(function (test) {
                    return [test.test_name_ar, test.test_name_en, test.abbreviation, test.id].some(function (value) {
                        const candidate = normalizeText(value || '');
                        return candidate && (candidate === targetText || candidate.includes(targetText) || targetText.includes(candidate));
                    });
                })
                : null;
            if (matchedTest && typeof getInterpretationCategoryIdForTest === 'function') {
                interpretationActiveCategory = getInterpretationCategoryIdForTest(matchedTest);
            }
            const matchedPractice = typeof interpretationLearningTools !== 'undefined'
                ? (interpretationLearningTools.practiceCases || []).find(function (caseData) {
                    return [caseData.id, caseData.title, caseData.intro, caseData.pattern].some(function (value) {
                        const candidate = normalizeText(value || '');
                        return candidate && (candidate === targetText || candidate.includes(targetText) || targetText.includes(candidate));
                    });
                })
                : null;
            if (matchedPractice) {
                interpretationActivePractice = matchedPractice.id;
                if (matchedPractice.category) { interpretationActiveCategory = matchedPractice.category; }
            }
            renderInterpretationPage();
        }
        if (source.practicalLab && typeof openPracticalExperimentFromSearch === 'function') {
            openPracticalExperimentFromSearch(entry.targetName || entry.name);
        }
        if (source.molecularGeneticsTab === 'molecular' && typeof renderMolecularBiologySection === 'function') { renderMolecularBiologySection(); }
        if (source.molecularGeneticsTab === 'genetics' && typeof renderGeneticsSection === 'function') { renderGeneticsSection(); }
        if (source.microbiology && typeof renderMicrobiology === 'function') { renderMicrobiology(); }
        if (source.stoolTab && typeof switchStoolTab === 'function') { switchStoolTab(source.stoolTab); }
        if (source.bacteriaLibrary) {
            if (typeof currentGramType !== 'undefined') { currentGramType = source.gramType; }
            const library = document.getElementById('bacteria-library-container');
            if (library && library.style.display !== 'block' && typeof toggleBacteriaLibrary === 'function') {
                toggleBacteriaLibrary();
            } else if (typeof renderBacteriaCards === 'function') {
                renderBacteriaCards();
                if (library) { library.style.display = 'block'; }
            }
        }
    }

    function findTarget(entry) {
        const target = normalizeText(entry.targetName);
        const candidates = document.querySelectorAll('[data-search-name]');

        // لا تطابق مع data-search-name فارغ إطلاقاً؛ هذا كان سبب نقل المستخدم إلى أول بطاقة.
        for (const candidate of candidates) {
            const saved = normalizeText(candidate.getAttribute('data-search-name'));
            if (saved && (saved === target || saved.includes(target) || target.includes(saved))) {
                return candidate;
            }
        }

        // إن لم تحمل البطاقة سمة، ابحث بعناوينها ونصها فقط بعد استبعاد النص الفارغ.
        for (const candidate of document.querySelectorAll('h1, h2, h3, h4, h5, h6, tr, article, .card-equipment, .card-tube, .test-card, .learning-module, .interpretation-card, .urine-card, .stool-card, .bacteria-card, .practical-card, .practical-experiment, .practical-section')) {
            if (candidate.offsetParent === null) { continue; }
            const text = normalizeText(candidate.textContent);
            if (target && text && text.includes(target)) { return candidate.closest('[data-search-name], .card-equipment, .card-tube, .test-card, .learning-module, .interpretation-card, .urine-card, .stool-card, .bacteria-card, .practical-card, .practical-experiment, .practical-section') || candidate; }
        }

        return document.getElementById(entry.source.containerId);
    }

    function revealEntry(entry) {
        const target = findTarget(entry);
        if (!target) { return; }
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('zak-search-highlight');
        window.setTimeout(function () { target.classList.remove('zak-search-highlight'); }, 2600);
    }

    function openEntry(entry) {
        if (!entry) { return; }
        closeResults();
        const navItem = document.querySelector('.nav-item[data-target="' + entry.source.pageId + '"]');
        if (navItem) { navItem.click(); }
        window.requestAnimationFrame(function () {
            prepareSource(entry);
            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () { revealEntry(entry); });
            });
        });
    }

    function performSearch() {
        const query = normalizeText(searchInput.value);
        if (query.length < 1) { closeResults(); return; }
        const words = query.split(' ').filter(Boolean);
        const results = searchIndex
            .map(function (entry) { return { entry: entry, score: scoreEntry(entry, query, words) }; })
            .filter(function (item) { return item.score > 0; })
            .sort(function (a, b) { return b.score - a.score || a.entry.name.localeCompare(b.entry.name, 'ar'); })
            .map(function (item) { return item.entry; });
        renderResults(results, query);
    }

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const first = resultsContainer.querySelector('[data-result-id]');
            if (first) { first.click(); }
        }
        if (event.key === 'Escape') { closeResults(); searchInput.blur(); }
    });
    document.addEventListener('click', function (event) {
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) { closeResults(); }
    });
    document.querySelectorAll('.nav-item').forEach(function (item) { item.addEventListener('click', closeResults); });

    buildSearchIndex();
})();

const zakLabTestGroupConfig = {
    hematology: { data: function () { return typeof hematologyGroupData !== 'undefined' ? hematologyGroupData : null; }, renderer: 'renderHematologyGroup', label: '🩸 أمراض الدم (Hematology)', color: '#e11d48', softColor: '#ffe4e6' },
    chemistry: { data: function () { return typeof clinicalChemistryGroupData !== 'undefined' ? clinicalChemistryGroupData : null; }, renderer: 'renderClinicalChemistryGroup', label: '🧪 الكيمياء السريرية (Clinical Chemistry)', color: '#0284c7', softColor: '#e0f2fe' },
    coagulation: { data: function () { return typeof coagulationGroupData !== 'undefined' ? coagulationGroupData : null; }, renderer: 'renderCoagulationGroup', label: '🩸 التجلط وتخثر الدم (Coagulation)', color: '#2563eb', softColor: '#dbeafe' },
    immunology: { data: function () { return typeof immunologyGroupData !== 'undefined' ? immunologyGroupData : null; }, renderer: 'renderImmunologyGroup', label: '🛡️ المناعة والأمصال (Immunology & Serology)', color: '#7c3aed', softColor: '#ede9fe' },
    hormones: { data: function () { return typeof hormonesGroupData !== 'undefined' ? hormonesGroupData : null; }, renderer: 'renderHormonesGroup', label: '🧬 الهرمونات والغدد (Hormones)', color: '#059669', softColor: '#d1fae5' },
    bloodBank: { data: function () { return typeof bloodBankGroupData !== 'undefined' ? bloodBankGroupData : null; }, renderer: 'renderBloodBankGroup', label: '🩸 بنك الدم (Blood Bank)', color: '#991b1b', softColor: '#fee2e2' },
    virology: { data: function () { return typeof virologyGroupData !== 'undefined' ? virologyGroupData : null; }, renderer: 'renderVirologyGroup', label: '🦠 علم الفيروسات (Virology)', color: '#0d9488', softColor: '#ccfbf1' },
    molecular: { data: function () { return typeof molecularGroupData !== 'undefined' ? molecularGroupData : null; }, renderer: 'renderMolecularGroup', label: '🧬 الأحياء الجزيئية (Molecular / PCR)', color: '#047857', softColor: '#d1fae5' }
};

let zakLabActiveTestGroup = '';

function escapeZakLabTestText(value) {
    return escapeV6TestLearningText(value === undefined || value === null ? '' : value);
}

function normalizeZakLabList(value) {
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }
    return String(value || '').trim() ? [value] : [];
}

function renderZakLabSignificance(title, values, variant) {
    const items = normalizeZakLabList(values);
    if (!items.length) {
        return '';
    }
    return '<details class="zak-test-significance zak-test-significance--' + variant + '"><summary>' + escapeZakLabTestText(title) + '</summary><ul>' + items.map(function (item) { return '<li>' + escapeZakLabTestText(item) + '</li>'; }).join('') + '</ul></details>';
}

function renderZakLabReferenceRanges(ranges) {
    const values = ranges && typeof ranges === 'object' ? Object.entries(ranges).filter(function (entry) { return entry[1] !== undefined && entry[1] !== null && entry[1] !== ''; }) : [];
    if (!values.length) {
        return '';
    }
    const labels = { male: 'الرجال', female: 'النساء', children: 'الأطفال', adult: 'البالغون', general: 'المدى العام' };
    return '<details class="zak-test-ranges"><summary>📊 القيم الطبيعية (Normal Ranges)</summary><ul>' + values.map(function (entry) { return '<li><strong>' + escapeZakLabTestText(labels[entry[0]] || entry[0]) + ':</strong> ' + escapeZakLabTestText(entry[1]) + '</li>'; }).join('') + '</ul></details>';
}

function renderZakLabTestCard(test) {
    const name = test.fullName || test.test_name_ar || test.name || '';
    const abbreviation = test.shortName || test.abbreviation || test.test_name_en || '';
    const high = test.high_significance || test.highSignificance || test.high_interpretation;
    const low = test.low_significance || test.lowSignificance || test.low_interpretation;
    const specimen = test.sampleType || test.specimen || '';
    const tube = test.tubeType || test.tube || '';
    const purpose = test.functionality || test.clinical_significance || test.description || '';
    const specimenMarkup = specimen || tube ? '<div class="zak-test-specimen">' + (specimen ? '<p>💉 <strong>نوع العينة:</strong> ' + escapeZakLabTestText(specimen) + '</p>' : '') + (tube ? '<p>🧪 <strong>نوع التيوب:</strong> ' + escapeZakLabTestText(tube) + '</p>' : '') + '</div>' : '';
    return '<article class="test-card zak-test-card" data-search-name="' + escapeZakLabTestText(name + ' ' + abbreviation) + '"><header class="zak-test-card__head"><h3>' + escapeZakLabTestText(name) + '</h3>' + (abbreviation ? '<span>' + escapeZakLabTestText(abbreviation) + '</span>' : '') + '</header>' + (purpose ? '<p class="zak-test-card__purpose"><strong>الوظيفة:</strong> ' + escapeZakLabTestText(purpose) + '</p>' : '') + specimenMarkup + renderZakLabReferenceRanges(test.referenceRanges || test.normalRange || test.normal_range) + renderZakLabSignificance('🔴 أسباب ودلالات الارتفاع', high, 'high') + renderZakLabSignificance('🔵 أسباب ودلالات الانخفاض', low, 'low') + '</article>';
}

function getZakLabTestButton(renderer) {
    return Array.from(document.querySelectorAll('.group-btn')).find(function (button) {
        return String(button.getAttribute('onclick') || '').indexOf(renderer) !== -1;
    }) || null;
}

function resetZakLabTestButtons() {
    Object.keys(zakLabTestGroupConfig).forEach(function (key) {
        const config = zakLabTestGroupConfig[key];
        const button = getZakLabTestButton(config.renderer);
        if (button) {
            button.style.background = config.color;
            button.textContent = config.label;
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

function renderZakLabTestGroup(key) {
    const config = zakLabTestGroupConfig[key];
    const container = document.getElementById('tests-container');
    const group = config && config.data();
    if (!config || !container || !group) {
        return;
    }

    const button = getZakLabTestButton(config.renderer);
    if (zakLabActiveTestGroup === key) {
        container.innerHTML = '';
        zakLabActiveTestGroup = '';
        resetZakLabTestButtons();
        return;
    }

    resetZakLabTestButtons();
    zakLabActiveTestGroup = key;
    const groups = Array.isArray(group.subGroups) && group.subGroups.length ? group.subGroups : [{ subCategory: '', tests: Array.isArray(group.tests) ? group.tests : [] }];
    const testCount = groups.reduce(function (count, item) { return count + ((item.tests || []).length); }, 0);
    container.innerHTML = '<section class="zak-test-group" style="--zak-group-color:' + config.color + ';--zak-group-soft:' + config.softColor + '"><header class="zak-test-group__head"><h2>' + escapeZakLabTestText((group.icon || '') + ' ' + (group.groupName || config.label)) + '</h2><p>' + escapeZakLabTestText(group.description || '') + '</p><span>عدد التحاليل: ' + testCount + '</span></header>' + groups.map(function (subGroup) { return '<section class="zak-test-subgroup">' + (subGroup.subCategory ? '<h3>' + escapeZakLabTestText(subGroup.subCategory) + '</h3>' : '') + '<div class="tests-grid zak-tests-grid">' + (subGroup.tests || []).map(renderZakLabTestCard).join('') + '</div></section>'; }).join('') + '</section>';
    if (button) {
        button.style.background = '#475569';
        button.textContent = '✖ إغلاق ' + config.label.replace(/^[^\s]+\s/, '');
        button.setAttribute('aria-expanded', 'true');
    }
    hydrateV6TestLearningDetails(container);
}

function renderHematologyGroup() { renderZakLabTestGroup('hematology'); }
function renderClinicalChemistryGroup() { renderZakLabTestGroup('chemistry'); }
function renderCoagulationGroup() { renderZakLabTestGroup('coagulation'); }
function renderImmunologyGroup() { renderZakLabTestGroup('immunology'); }
function renderHormonesGroup() { renderZakLabTestGroup('hormones'); }
function renderBloodBankGroup() { renderZakLabTestGroup('bloodBank'); }
function renderVirologyGroup() { renderZakLabTestGroup('virology'); }
function renderMolecularGroup() { renderZakLabTestGroup('molecular'); }

function getGitHubPagesAssetPath(path) {
    const value = String(path || '').trim();
    return value.startsWith('/') ? '.' + value : value;
}

function normalizeGitHubPagesImages(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('img[src]').forEach(function (image) {
        const currentPath = image.getAttribute('src');
        const displayPath = getGitHubPagesAssetPath(currentPath);
        if (displayPath && displayPath !== currentPath) {
            image.setAttribute('src', displayPath);
        }
        image.decoding = 'async';
        if (!image.loading) {
            image.loading = 'lazy';
        }
    });
}

function addV7LearningDetails(target, details) {
    if (target && details && !target.learningDetails) {
        target.learningDetails = details;
    }
}

function findDataItemById(items, id) {
    return (items || []).find(function (item) { return item && item.id === id; });
}

function findDataItemContaining(items, key, fragment) {
    return (items || []).find(function (item) { return item && String(item[key] || '').indexOf(fragment) !== -1; });
}

function applyV7UrineStoolEducation() {
    if (typeof v7UrineStoolEducation === 'undefined') {
        return;
    }

    if (typeof urineOverviewData !== 'undefined') {
        urineOverviewData.studentWorkflow = v7UrineStoolEducation.urineOverview.studentWorkflow;
        urineOverviewData.collectionGuide = v7UrineStoolEducation.urineOverview.collectionGuide;
        urineOverviewData.rejectionCriteria = v7UrineStoolEducation.urineOverview.rejectionCriteria;

        [
            ["اللون", { purpose: "فحص بصري أولي لوصف العينة لا لتشخيص سبب اللون.", method: "قارن اللون والصفاء بعينة طازجة وسجّل الأدوية أو الغذاء أو التلوث المحتمل عند توفرها.", interpretation: "اللون يتأثر بالتركيز والأصباغ والأدوية والدم/الصبغات؛ يفسر مع الكيمياء والراسب.", pitfall: "الضوء ووقت الوقوف يغيران المظهر، ولا يثبت اللون وحده وجود bilirubin أو blood.", studentFriendly: "لون البول يعطي قرينة، وليس جواباً نهائياً؛ اسأل دائماً ما الذي يقوله الشريط والمجهر." }],
            ["المظهر", { purpose: "تسجيل الصفاء أو العكورة ووضعها في سياق الرواسب.", method: "افحص العينة المخلوطة بلطف قبل الطرد المركزي ثم اربط العكورة بالراسب عند الحاجة.", interpretation: "العكورة قد تنشأ من خلايا أو بلورات أو مخاط أو بكتيريا أو تلوث، لذلك لا تساوي عدوى تلقائياً.", pitfall: "عينة باردة أو متأخرة قد تترسب فيها أملاح وتبدو عكرة من دون معنى سريري مباشر.", studentFriendly: "العكر سؤال يبدأ الفحص، لا تشخيصاً ينهيه." }],
            ["الكثافة", { purpose: "تقدير تركيز البول كفحص مسحي لحالة التخفيف/التركيز.", method: "سجّل الطريقة المستخدمة لأن dipstick وrefractometer وغيرهما قد لا تعطي القيمة نفسها تماماً.", interpretation: "القراءة تتأثر بالماء والمواد الذائبة مثل glucose أو protein أو مواد ظليلة، وتقرأ مع السياق.", pitfall: "لا تعامل specific gravity كبديل عن osmolality أو كقياس منفرد لوظيفة الكلى.", studentFriendly: "SG تقول كم البول مركز تقريباً، لا كم الكلية سليمة أو مريضة وحدها." }],
            ["الهيدروجيني", { purpose: "وصف حموضة البول وربطها بحالة العينة والبلورات والاختبارات الكيميائية.", method: "اقرأ pH في الوقت المحدد للطريقة مع معرفة زمن وصول العينة.", interpretation: "pH يتأثر بالغذاء والأدوية والبكتيريا والعينة القديمة؛ لا يثبت عدوى أو حصى وحده.", pitfall: "بول قديم قد يصبح قلوياً، لذا لا تتجاهل تاريخ ووقت الجمع.", studentFriendly: "pH يشرح بيئة العينة، وليس اسم المرض." }]
        ].forEach(function (entry) { addV7LearningDetails(findDataItemContaining(urineOverviewData.physicalExams, 'param', entry[0]), entry[1]); });

        [
            ["البروتين", "الشريط يلتقط albumin أكثر من بعض البروتينات الأخرى؛ الإيجابية تحتاج ربطاً بالتركيز والتأكيد الكمي عند الطلب."],
            ["الجلوكوز", "وجوده يدعم تجاوز عتبة إعادة الامتصاص أو سبباً أنبوبياً محتملاً؛ لا يحدد وحده سكر الدم أو تشخيص السكري."],
            ["الكيتونات", "يعكس استعمال الدهون والطاقة وقد يظهر في الصيام أو القيء أو اضطرابات استقلابية؛ يقرأ مع glucose والحالة السريرية."],
            ["البيليروبين", "وسادة حساسة للضوء والتخزين؛ وجودها يحتاج ربطاً بفحوص الكبد/الصفراء والتقرير المخبري."],
            ["اليوروبيلينوجين", "يتغير مع الاستقلاب الكبدي/الدموي ووصول الصفراء؛ لا يفسر منفرداً."],
            ["النيتريت", "إيجابيته قد تدعم بعض الجراثيم المختزِلة للنترات؛ سلبيته لا تنفي UTI ولا تعرف نوع الجرثومة."],
            ["اللوكوسايت", "Leukocyte esterase يقيس نشاطاً مرتبطاً بخلايا بيضاء؛ اربطه بالمجهر والعينة والزرع عند الحاجة."],
            ["الدم", "تفاعل blood في الشريط قد يأتي من RBC أو Hb أو myoglobin؛ المجهر يساعد على الفصل."]
        ].forEach(function (entry) {
            const item = findDataItemContaining(urineOverviewData.chemicalExams, 'test', entry[0]);
            addV7LearningDetails(item, { purpose: "فحص كيميائي مسحي ضمن GUE.", method: "اقرأ وفق وقت الشركة وتعليمات الجهاز أو الشريط المستخدم في المختبر.", interpretation: entry[1], pitfall: "تأكد من العينة والوقت والتداخلات قبل اعتماد النتيجة، ولا تستبدل الفحوص التأكيدية عند الحاجة.", studentFriendly: "هذه نتيجة مسحية؛ اربطها ببقية البول ولا تفسرها وحدها." });
        });
    }

    if (typeof urineMicroscopicData !== 'undefined') {
        Object.keys(v7UrineStoolEducation.urineMicroscopy).forEach(function (id) {
            addV7LearningDetails(findDataItemById(urineMicroscopicData, id), v7UrineStoolEducation.urineMicroscopy[id]);
        });
        [
            { id: "yeast", name: "الخمائر (Yeast)", normalRange: "غائبة أو نادرة حسب التقرير", appearance: "أجسام بيضوية متبرعمة وقد تُرى pseudohyphae في بعض العينات.", clinicalSig: "قد تمثل تلوثاً أو استعماراً أو توجد مع سياق مناسب؛ لا تثبت عدوى جهازية من مشهد بولي منفرد.", image: "/urinsed/yeast.jpeg", learningDetails: { purpose: "تمييز الخمائر من RBC أو debris أو crystals.", method: "تراجع العينة الطازجة وجود التبرعم وربما pseudohyphae وتربط النتيجة بجودة الجمع.", interpretation: "تحتاج النتيجة ربطاً بالأعراض والعوامل المهيئة وطريقة الجمع وقد يلزم تأكيد مناسب.", pitfall: "الإفرازات والتلوث قد تعطي خمائر في العينة.", studentFriendly: "رؤية yeast ليست حكماً فورياً بالعدوى؛ تأكد أولاً من جودة العينة والسياق." } },
            { id: "casts_rbc", name: "أسطوانات كريات الدم الحمراء (RBC Casts)", normalRange: "غائبة", appearance: "خلايا حمراء محصورة داخل قالب أسطواني بروتيني.", clinicalSig: "نمط ذو أهمية كلوية محتملة يحتاج تأكيداً وربطاً عاجلاً بالسياق ونتائج البول الأخرى.", image: "/urinsed/rbcast.jpeg", learningDetails: { purpose: "تمييز RBC داخل cast من RBC حرة.", method: "تراجع القالب الأسطواني والخلايا المحصورة داخله في عينة طازجة.", interpretation: "وجود النمط يستدعي ربطاً بمصدر كلوي محتمل ولا يحدد التشخيص وحده.", pitfall: "التأخير يسبب تحلل العناصر وقد يصعب تأكيدها.", studentFriendly: "نوع cast يغيّر معنى RBC؛ لا تكتف بكتابة blood positive." } },
            { id: "casts_granular", name: "الأسطوانات الحبيبية (Granular Casts)", normalRange: "غائبة أو نادرة حسب الطريقة", appearance: "قوالب أسطوانية تحتوي حبيبات خشنة أو دقيقة من تدهور عناصر خلوية أو بروتينية.", clinicalSig: "قد ترافق أذية أو إجهاداً كلوياً في بعض السياقات، لكنها غير نوعية وتحتاج ربطاً سريرياً.", image: "/urinsed/granular.jpeg", learningDetails: { purpose: "تمييز cast حبيبي من amorphous debris.", method: "افحص الحواف الأسطوانية والسياق مع باقي الراسب.", interpretation: "يعرض كنمط يحتاج متابعة لا كتشخيص منفرد.", pitfall: "الجودة الضعيفة للعينة قد تزيد صعوبة الفصل بين الحبيبات والرواسب.", studentFriendly: "الحبيبات داخل قالب أهم من الحبيبات الحرة في الحقل." } },
            { id: "cystine", name: "بلورات السيستين (Cystine Crystals)", normalRange: "غائبة", appearance: "صفائح سداسية عديمة اللون أو شاحبة ذات حواف واضحة.", clinicalSig: "مشاهدة نادرة ذات أهمية محتملة وتحتاج تأكيداً مخبرياً وربطاً بتقييم استقلابي مناسب.", image: "/urinsed/crystal.jpeg", learningDetails: { purpose: "التعرف على الشكل السداسي المميز من دون المبالغة في تفسيره.", method: "تؤكد المورفولوجيا بخبرة مختبرية وفحوص لاحقة عندما يلزم.", interpretation: "لا تعتمد على صورة أو حقل واحد لتقرير سبب وراثي أو حصى.", pitfall: "قد تختلط بأشكال بلورية أخرى عند التركيز أو التصوير الرديء.", studentFriendly: "سداسي الشكل علامة تنبهك للتأكيد، لا نتيجة نهائية." } }
        ].forEach(function (item) { if (!findDataItemById(urineMicroscopicData, item.id)) { urineMicroscopicData.push(item); } });
    }

    if (typeof stoolOverviewData !== 'undefined') {
        stoolOverviewData.collectionGuide = v7UrineStoolEducation.stoolOverview.collectionGuide;
        stoolOverviewData.microscopyGuide = v7UrineStoolEducation.stoolOverview.microscopyGuide;
        [["اللون", "سجّل اللون مع الغذاء والأدوية والعمر، ولا تفسره كنزف أو ركودة من المشاهدة وحدها."], ["القوام", "اكتب القوام لأنه يوجّه طريقة الفحص؛ السائل قد يحتاج فحصاً أسرع للمتحركات."], ["الرائحة", "الرائحة وصف مساعد غير نوعي، ولا تُستعمل وحدها لتسمية عدوى أو سوء امتصاص."], ["المخاط", "اختر جزء المخاط للفحص المجهري عند الطلب؛ الكمية والسياق أهم من وجود كلمة mucus فقط."], ["الدم", "الدم المرئي يستلزم وصفاً دقيقاً وربطاً بالسياق؛ لا تحتاج العينة المرئية الدم لاختبار occult blood للتأكيد الروتيني."], ["القيح", "يمكن أن يشير إلى التهاب لكنه غير نوعي؛ جودة العينة والفحوص المكملة تحدد المعنى."]].forEach(function (entry) {
            const item = findDataItemContaining(stoolOverviewData.physicalExams, 'param', entry[0]);
            addV7LearningDetails(item, { purpose: "وصف عياني منظم لعينة GSE.", method: "افحص قبل مزج العينة وحدد الجزء الممثل وفق سياسة المختبر.", interpretation: entry[1], pitfall: "الغذاء والأدوية والعمر وزمن النقل قد تغير المظهر.", studentFriendly: "الوصف العياني يوجه السؤال التالي؛ لا يحل محل المجهر أو الكيمياء أو الزرع." });
        });
        (stoolOverviewData.chemicalExams || []).forEach(function (item) {
            addV7LearningDetails(item, { purpose: "فحص كيميائي موجّه في البراز.", method: "نوع الوعاء والتحضير وطزاجة العينة وطريقة المختبر جزء من النتيجة.", interpretation: "النتيجة تساعد على تنظيم الاحتمالات وتحتاج ربطاً بالعينة وبقية الفحوص، ولا تثبت السبب المنفرد.", pitfall: "الأدوية والغذاء والمواد المتداخلة أو التخزين قد تغيّر النتيجة؛ راجع سياسة الاختبار المحدد.", studentFriendly: "الفحص الكيميائي يعطي قرينة؛ لا تقفز من positive إلى تشخيص." });
        });
    }

    if (typeof stoolParasitesData !== 'undefined') {
        Object.keys(v7UrineStoolEducation.stoolParasites).forEach(function (id) {
            addV7LearningDetails(findDataItemById(stoolParasitesData, id), v7UrineStoolEducation.stoolParasites[id]);
        });
    }

    if (typeof interpretationEngineData !== 'undefined') {
        (interpretationEngineData.groups || []).forEach(function (group) {
            (group.tests || []).forEach(function (test) {
                if (!test.learningDetails) {
                    test.learningDetails = { whyReadTogether: "اقرأ " + (test.abbreviation || test.test_name_en || "الفحص") + " مع فحوص المجموعة نفسها واتجاه النتيجة ووحدة المختبر، لا كرقم معزول.", methodAndSpecimen: "العينة والطريقة والتحضير قد تختلف حسب المختبر. راجع اسم الطريقة والوحدة وحالة العينة في التقرير أو دليل المختبر قبل المقارنة.", interpretationSequence: "ابدأ بالتأكد من هوية المريض والفاصل المرجعي، ثم قارن الاتجاه بالنتائج المرتبطة، ثم راجع العوامل قبل التحليل والأدوية والسياق السريري.", confirmationNote: "النتيجة غير المتوقعة أو غير المتوافقة لا تُشخّص وحدها؛ قد تحتاج إعادة/تأكيداً أو فحصاً مكملًا بحسب سياسة المختبر والطلب السريري.", studentFriendly: "اسأل: ما الذي يقيسه؟ هل النطاق من نفس المختبر؟ وما الفحوص التي يجب أن أقرأها معه؟" };
                }
            });
        });
    }
}

function applyV6TestEducationMap() {
    if (typeof v6TestEducationData === 'undefined') {
        return;
    }
    [hematologyGroupData, clinicalChemistryGroupData, coagulationGroupData, immunologyGroupData, hormonesGroupData, bloodBankGroupData, virologyGroupData, molecularGroupData].forEach(function (group) {
        const tests = Array.isArray(group.tests) ? group.tests : (group.subGroups || []).flatMap(function (subGroup) { return subGroup.tests || []; });
        tests.forEach(function (test) {
            if (test && test.fullName && v6TestEducationData[test.fullName]) {
                test.learningDetails = v6TestEducationData[test.fullName];
            }
        });
    });
}

applyV6TestEducationMap();
applyV7UrineStoolEducation();

document.addEventListener('DOMContentLoaded', function () {
    normalizeGitHubPagesImages(document);
    if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(function (records) {
            records.forEach(function (record) {
                record.addedNodes.forEach(function (node) {
                    if (node.nodeType !== Node.ELEMENT_NODE) {
                        return;
                    }
                    if (node.matches && node.matches('img[src]')) {
                        const directPath = node.getAttribute('src');
                        const fixedPath = getGitHubPagesAssetPath(directPath);
                        if (fixedPath !== directPath) {
                            node.setAttribute('src', fixedPath);
                        }
                        node.decoding = 'async';
                        if (!node.loading) {
                            node.loading = 'lazy';
                        }
                    }
                    normalizeGitHubPagesImages(node);
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    }
});

// =========================================================
// Practical Lab — عارض مستقل مبني على practicalLabData فقط
// لإضافة تجربة جديدة: أضف object إلى practicalLabData.experiments.
// =========================================================

const practicalLabState = { activeExperimentId: null };

function escapePracticalHTML(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getPracticalExperiments() {
    return typeof practicalLabData !== 'undefined' && Array.isArray(practicalLabData.experiments)
        ? practicalLabData.experiments
        : [];
}

function getPracticalExperimentById(id) {
    return getPracticalExperiments().find(function (experiment) {
        return experiment && experiment.id === id;
    }) || null;
}

function practicalListMarkup(items, className) {
    if (!Array.isArray(items) || !items.length) { return ''; }
    return '<ul class="' + (className || 'practical-list') + '">' + items.map(function (item) {
        return '<li class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(typeof item === 'string' ? item : item.text || item.description || item.name || '') + '</li>';
    }).join('') + '</ul>';
}

function practicalSectionMarkup(id, title, icon, content, extraClass) {
    if (!content) { return ''; }
    return '<section class="practical-section ' + (extraClass || '') + '" id="practical-' + escapePracticalHTML(id) + '"><div class="practical-section-heading"><span aria-hidden="true">' + escapePracticalHTML(icon || '•') + '</span><h3 dir="rtl">' + escapePracticalHTML(title) + '</h3></div>' + content + '</section>';
}

function practicalCardsMarkup(items, type) {
    if (!Array.isArray(items) || !items.length) { return ''; }
    return '<div class="practical-card-grid">' + items.map(function (item) {
        const names = [item.name, item.arabicName, item.label].filter(Boolean).join(' | ');
        const secondary = item.arabicName || item.label || '';
        const description = item.description || item.function || '';
        const imageSource = practicalLocalImageSource(item.image);
        const details = [
            item.use ? '<p class="practical-bilingual-line" dir="auto"><b>الاستخدام:</b> ' + escapePracticalHTML(item.use) + '</p>' : '',
            item.safety ? '<p class="practical-card-safety practical-bilingual-line" dir="auto"><b>السلامة:</b> ' + escapePracticalHTML(item.safety) + '</p>' : '',
            item.notes ? '<p class="practical-bilingual-line" dir="auto"><b>ملاحظة:</b> ' + escapePracticalHTML(item.notes) + '</p>' : ''
        ].join('');
        return '<article class="practical-card practical-' + escapePracticalHTML(type || 'item') + '-card" data-search-name="' + escapePracticalHTML(names) + '">' +
            (imageSource ? '<img class="practical-card-image" src="' + escapePracticalHTML(imageSource) + '" alt="' + escapePracticalHTML(item.imageAlt || item.arabicName || item.name || '') + '" loading="lazy">' : '<div class="practical-card-symbol" aria-hidden="true">' + (type === 'reagent' ? '🧪' : type === 'anatomy' ? '◌' : '🔬') + '</div>') +
            '<div><h4 dir="rtl">' + escapePracticalHTML(item.arabicName || item.label || item.name || '') + '</h4>' +
            (item.name && secondary ? '<p class="practical-card-en" dir="ltr">' + escapePracticalHTML(item.name) + '</p>' : '') +
            (description ? '<p class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(description) + '</p>' : '') + details + '</div></article>';
    }).join('') + '</div>';
}

// لا يقبل القسم سوى مسار محلي داخل المشروع؛ غياب الصورة لا يولّد placeholder خارجياً.
function practicalLocalImageSource(source) {
    const value = String(source || '').trim();
    return value && !/^(?:https?:|data:|javascript:)/i.test(value) ? value : '';
}

function practicalImagesMarkup(images) {
    if (!Array.isArray(images) || !images.length) { return ''; }
    const figures = images.map(function (image) {
        const source = practicalLocalImageSource(image && image.src);
        if (source) {
            return '<figure class="practical-image-figure"><img src="' + escapePracticalHTML(source) + '" alt="' + escapePracticalHTML(image.alt || image.caption || 'صورة تعليمية') + '" loading="lazy" onerror="this.closest(\'figure\').remove();">' + (image.caption ? '<figcaption>' + escapePracticalHTML(image.caption) + '</figcaption>' : '') + '</figure>';
        }
        return '';
    }).filter(Boolean).join('');
    return figures ? '<div class="practical-image-grid">' + figures + '</div>' : '';
}

// دليل صور فصائل الدم: جدول التكتلات مستقل ثم تظهر صور الكواشف الثلاثة بأسمائها فقط.
function practicalBloodTypingVisualGuideMarkup(guide) {
    if (!guide || typeof guide !== 'object') { return ''; }
    const table = guide.table && typeof guide.table === 'object' ? guide.table : null;
    const tableSource = practicalLocalImageSource(table && table.src);
    const reagents = Array.isArray(guide.reagents) ? guide.reagents : [];
    const tableMarkup = tableSource
        ? '<figure class="practical-image-figure practical-blood-typing-table" data-blood-typing-image-slot="' + escapePracticalHTML(table && table.id || 'blood-group-table') + '"><img src="' + escapePracticalHTML(tableSource) + '" alt="' + escapePracticalHTML(table && table.alt || guide.title || 'جدول تحديد فصيلة الدم') + '" loading="lazy" onerror="this.closest(\'figure\').remove();"></figure>'
        : '';
    const reagentMarkup = reagents.map(function (reagent) {
        const source = practicalLocalImageSource(reagent && reagent.src);
        if (!source) { return ''; }
        const name = escapePracticalHTML(reagent && reagent.name || 'Reagent');
        return '<figure class="practical-image-figure practical-blood-typing-reagent" data-blood-typing-image-slot="' + escapePracticalHTML(reagent && reagent.id || '') + '"><img src="' + escapePracticalHTML(source) + '" alt="' + name + '" loading="lazy" onerror="this.closest(\'figure\').remove();"><figcaption>' + name + '</figcaption></figure>';
    }).join('');
    if (!tableMarkup && !reagentMarkup) { return ''; }
    return '<div class="practical-blood-typing-visual-guide"><h4 class="practical-bilingual-line" dir="rtl">' + escapePracticalHTML(guide.title || 'على ضوء هذا الجدول نحدد فصيلة الدم') + '</h4>' + tableMarkup +
        (reagentMarkup ? '<h5 class="practical-blood-typing-reagents-title" dir="rtl">كواشف فصائل الدم</h5><div class="practical-image-grid practical-blood-typing-reagents">' + reagentMarkup + '</div>' : '') + '</div>';
}

function practicalStepsMarkup(steps) {
    if (!Array.isArray(steps) || !steps.length) { return ''; }
    return '<ol class="practical-steps">' + steps.map(function (step, index) {
        return '<li><span class="practical-step-number">' + (index + 1) + '</span><div><h4 dir="rtl">' + escapePracticalHTML(step.title || '') + '</h4><p class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(step.description || '') + '</p></div></li>';
    }).join('') + '</ol>';
}

function practicalVisualGuideMarkup(items) {
    if (!Array.isArray(items) || !items.length) { return ''; }
    return '<div class="practical-visual-guide">' + items.map(function (item) {
        return '<article class="practical-visual-item" data-search-name="' + escapePracticalHTML((item.title || '') + ' ' + (item.description || '')) + '"><span>' + escapePracticalHTML(item.marker || '•') + '</span><div><h4 class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(item.title || '') + '</h4><p class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(item.description || '') + '</p></div></article>';
    }).join('') + '</div>';
}

function practicalTablesMarkup(tables) {
    if (!Array.isArray(tables) || !tables.length) { return ''; }
    return tables.map(function (table) {
        const head = (table.columns || []).map(function (column) { return '<th scope="col" dir="auto">' + escapePracticalHTML(column) + '</th>'; }).join('');
        const rows = (table.rows || []).map(function (row) { return '<tr>' + row.map(function (cell) { return '<td dir="auto">' + escapePracticalHTML(cell) + '</td>'; }).join('') + '</tr>'; }).join('');
        return '<div class="practical-table-wrap"><h4 class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(table.title || '') + '</h4>' +
            (table.caption ? '<p class="practical-table-caption practical-bilingual-line" dir="auto">' + escapePracticalHTML(table.caption) + '</p>' : '') +
            '<div class="practical-table-scroll"><table class="practical-table"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    }).join('');
}

function practicalErrorsMarkup(errors) {
    if (!Array.isArray(errors) || !errors.length) { return ''; }
    return '<div class="practical-error-list">' + errors.map(function (item) {
        return '<article class="practical-error" data-search-name="' + escapePracticalHTML(item.error || '') + '"><h4 class="practical-bilingual-line" dir="auto">✕ ' + escapePracticalHTML(item.error || '') + '</h4><p class="practical-bilingual-line" dir="auto"><b>لماذا؟</b> ' + escapePracticalHTML(item.why || '') + '</p><p class="practical-bilingual-line" dir="auto"><b>✓ الصحيح:</b> ' + escapePracticalHTML(item.correct || '') + '</p></article>';
    }).join('') + '</div>';
}

function practicalNotesMarkup(notes) {
    if (!Array.isArray(notes) || !notes.length) { return ''; }
    return '<div class="practical-notes">' + notes.map(function (note) {
        return '<aside class="practical-note practical-note-' + escapePracticalHTML(note.type || 'important') + '"><h4>' + escapePracticalHTML(note.title || '') + '</h4><p>' + escapePracticalHTML(note.text || '') + '</p></aside>';
    }).join('') + '</div>';
}

function practicalExtraSectionsMarkup(sections) {
    if (!Array.isArray(sections) || !sections.length) { return ''; }
    return sections.map(function (section) {
        const body = section.content ? '<p class="practical-prose">' + escapePracticalHTML(section.content) + '</p>' : practicalListMarkup(section.items);
        return practicalSectionMarkup(section.id || 'extra', section.title || 'معلومة إضافية', section.icon || '✦', body, 'practical-extra-section');
    }).join('');
}

function practicalQuizMarkup(experiment) {
    const quiz = experiment && experiment.quiz;
    if (!Array.isArray(quiz) || !quiz.length) { return ''; }
    return '<section class="practical-quiz" id="practical-quiz"><div class="practical-section-heading"><span aria-hidden="true">🧠</span><h3>اختبر نفسك</h3></div><p class="practical-quiz-intro">اختر إجابة لكل سؤال؛ تظهر المراجعة فوراً مع السبب التعليمي.</p>' + quiz.map(function (item, questionIndex) {
        return '<article class="practical-question" data-question-index="' + questionIndex + '"><h4>' + (questionIndex + 1) + '. ' + escapePracticalHTML(item.question || '') + '</h4><div class="practical-options">' + (item.options || []).map(function (option, optionIndex) {
            return '<button type="button" class="practical-option" data-option-index="' + optionIndex + '">' + escapePracticalHTML(option) + '</button>';
        }).join('') + '</div><p class="practical-feedback" aria-live="polite" hidden></p></article>';
    }).join('') + '</section>';
}

// ملاحظة تعليمية ظاهرة أعلى تجربة فصائل الدم. تبقى البيانات في data.js
// حتى لا ننشئ قالباً منفصلاً أو نعتمد على نص ثابت خارج بنية التجارب الحالية.
function practicalReadingRuleMarkup(rule) {
    if (!rule || typeof rule !== 'object') { return ''; }
    const aboPatterns = Array.isArray(rule.aboPatterns) ? rule.aboPatterns : [];
    const rhPatterns = Array.isArray(rule.rhPatterns) ? rule.rhPatterns : [];
    const examples = Array.isArray(rule.examples) ? rule.examples : [];
    const aboMarkup = aboPatterns.length ? '<div class="practical-reading-patterns" aria-label="أنماط ABO التعليمية">' + aboPatterns.map(function (pattern) {
        return '<div class="practical-reading-pattern"><span><bdi dir="ltr">Anti-A</bdi> <bdi dir="ltr">' + escapePracticalHTML(pattern.antiA || '') + '</bdi></span><span><bdi dir="ltr">Anti-B</bdi> <bdi dir="ltr">' + escapePracticalHTML(pattern.antiB || '') + '</bdi></span><strong dir="ltr">' + escapePracticalHTML(pattern.group || '') + '</strong></div>';
    }).join('') + '</div>' : '';
    const rhMarkup = rhPatterns.length ? '<div class="practical-reading-rh" aria-label="أنماط RhD التعليمية">' + rhPatterns.map(function (pattern) {
        return '<span><bdi dir="ltr">Anti-D</bdi> <bdi dir="ltr">' + escapePracticalHTML(pattern.antiD || '') + '</bdi> <bdi dir="ltr">→ ' + escapePracticalHTML(pattern.result || '') + '</bdi></span>';
    }).join('') + '</div>' : '';
    const examplesMarkup = examples.length ? '<p class="practical-reading-rule-examples" dir="ltr">' + examples.map(function (example) { return escapePracticalHTML(example); }).join(' &nbsp; | &nbsp; ') + '</p>' : '';
    return '<aside class="practical-reading-rule" aria-label="' + escapePracticalHTML(rule.title || 'قاعدة القراءة') + '">' +
        '<strong>🧠 ' + escapePracticalHTML(rule.title || 'قاعدة القراءة') + '</strong>' +
        (rule.lead ? '<p class="practical-reading-rule-lead">' + escapePracticalHTML(rule.lead) + '</p>' : '') +
        '<div class="practical-reading-rule-grid">' +
        '<p class="practical-reading-rule-positive">' + escapePracticalHTML(rule.positive || '') + '</p>' +
        '<p class="practical-reading-rule-negative">' + escapePracticalHTML(rule.negative || '') + '</p>' +
        '</div>' +
        (rule.focus ? '<p class="practical-reading-rule-focus">🔎 ' + escapePracticalHTML(rule.focus) + '</p>' : '') +
        (rule.memory ? '<p class="practical-reading-rule-memory">' + escapePracticalHTML(rule.memory) + '</p>' : '') +
        (aboMarkup ? '<h4 class="practical-reading-subtitle">ABO: من أماكن +</h4>' + aboMarkup : '') +
        (rhMarkup ? '<h4 class="practical-reading-subtitle">RhD: من Anti-D</h4>' + rhMarkup : '') +
        examplesMarkup +
        '</aside>';
}

function renderPracticalExperiment(experimentId) {
    const container = document.getElementById('practical-lab-container');
    const experiment = getPracticalExperimentById(experimentId);
    if (!container || !experiment) { return; }
    practicalLabState.activeExperimentId = experiment.id;
    const experimentList = getPracticalExperiments();
    const readingRuleMarkup = practicalReadingRuleMarkup(experiment.readingRule);
    const bloodTypingVisualGuideMarkup = practicalBloodTypingVisualGuideMarkup(experiment.bloodTypingVisualGuide);
    const sections = [
        practicalSectionMarkup('objectives', 'أهداف التعلّم', '🎯', practicalListMarkup(experiment.objectives)),
        practicalSectionMarkup('principle', 'المبدأ', '⚗️', experiment.principle ? '<p class="practical-prose">' + escapePracticalHTML(experiment.principle) + '</p>' : ''),
        practicalSectionMarkup('methods', 'طرق جمع العينة', '↔', practicalCardsMarkup(experiment.sampleMethods, 'method')),
        practicalSectionMarkup('materials', 'المواد والأدوات', '🧰', practicalCardsMarkup(experiment.materials, 'tool')),
        practicalSectionMarkup('reagents', 'الكواشف', '🧪', practicalCardsMarkup(experiment.reagents, 'reagent')),
        practicalSectionMarkup('anatomy', 'دليل المواضع التشريحي', '◌', practicalCardsMarkup(experiment.anatomyGuide, 'anatomy')),
        practicalSectionMarkup('preparation', 'التحضير قبل البدء', '✓', practicalListMarkup(experiment.preparation, 'practical-check-list')),
        practicalSectionMarkup('procedure', 'الخطوات العملية', '1', practicalStepsMarkup(experiment.steps)),
        practicalSectionMarkup('visual-guide', 'دليل بصري مفاهيمي', '◉', practicalVisualGuideMarkup(experiment.visualGuide)),
        practicalSectionMarkup('images', 'صور تعليمية', '▧', practicalImagesMarkup(experiment.images)),
        practicalSectionMarkup('tables', 'جداول التدريب', '▦', practicalTablesMarkup(experiment.tables)),
        practicalSectionMarkup('results', 'الملاحظة والنتيجة', '🔎', experiment.results ? '<p class="practical-prose">' + escapePracticalHTML(experiment.results) + '</p>' : ''),
        practicalSectionMarkup('interpretation', 'كيف أفسر ما أراه؟', '🧩', experiment.interpretation ? '<p class="practical-prose">' + escapePracticalHTML(experiment.interpretation) + '</p>' : ''),
        practicalSectionMarkup('errors', 'أخطاء شائعة وكيف تصححها', '⚠', practicalErrorsMarkup(experiment.commonErrors)),
        practicalSectionMarkup('safety', 'السلامة المخبرية', '🛡', practicalListMarkup(experiment.safety, 'practical-safety-list'), 'practical-safety-section'),
        practicalSectionMarkup('notes', 'ملاحظات مهمة', '📌', practicalNotesMarkup(experiment.notes)),
        practicalExtraSectionsMarkup(experiment.extraSections),
        practicalQuizMarkup(experiment)
    ].join('');
    container.innerHTML = '<article class="practical-experiment" data-search-name="' + escapePracticalHTML([experiment.title, experiment.englishTitle, experiment.category].join(' | ')) + '"><header class="practical-experiment-header"><div><span class="practical-eyebrow" dir="rtl">' + escapePracticalHTML(experiment.category || 'مختبر عملي') + '</span><h2 dir="rtl">' + escapePracticalHTML(experiment.icon || '🧪') + ' ' + escapePracticalHTML(experiment.title || '') + '</h2><p class="practical-experiment-en" dir="ltr">' + escapePracticalHTML(experiment.englishTitle || '') + '</p><p class="practical-bilingual-line" dir="auto">' + escapePracticalHTML(experiment.description || '') + '</p>' + readingRuleMarkup + practicalSectionMarkup('blood-typing-images', 'دليل صور قراءة الفصيلة', '🖼️', bloodTypingVisualGuideMarkup) + '</div><button type="button" class="practical-back-btn" data-practical-back>← كل التجارب</button></header>' + sections + '<nav class="practical-experiment-switcher" aria-label="التنقل بين التجارب">' + experimentList.map(function (item) { return '<button type="button" class="practical-switch-btn' + (item.id === experiment.id ? ' active' : '') + '" data-practical-open="' + escapePracticalHTML(item.id) + '">' + escapePracticalHTML(item.icon || '🧪') + ' ' + escapePracticalHTML(item.title || '') + '</button>'; }).join('') + '</nav></article>';
    bindPracticalLabEvents(container, experiment);
}

function renderPracticalLab() {
    const container = document.getElementById('practical-lab-container');
    const experiments = getPracticalExperiments();
    if (!container) { return; }
    if (practicalLabState.activeExperimentId && getPracticalExperimentById(practicalLabState.activeExperimentId)) {
        renderPracticalExperiment(practicalLabState.activeExperimentId);
        return;
    }
    const references = typeof practicalLabData !== 'undefined' && Array.isArray(practicalLabData.references) ? practicalLabData.references : [];
    container.innerHTML = '<section class="practical-lab-intro"><span class="practical-eyebrow">مسار تدريبي قابل للتوسعة</span><h3>من المبدأ إلى الملاحظة ثم المراجعة</h3><p>' + escapePracticalHTML(typeof practicalLabData !== 'undefined' ? practicalLabData.introduction : '') + '</p><div class="practical-flow"><span>المبدأ</span><b>←</b><span>الأداة</span><b>←</b><span>الخطوات</span><b>←</b><span>الملاحظة</span><b>←</b><span>اختبر نفسك</span></div></section><section class="practical-experiment-grid" aria-label="التجارب العملية">' + experiments.map(function (experiment) { return '<article class="practical-experiment-card" data-search-name="' + escapePracticalHTML([experiment.title, experiment.englishTitle, experiment.category].join(' | ')) + '"><div class="practical-experiment-icon" aria-hidden="true">' + escapePracticalHTML(experiment.icon || '🧪') + '</div><span>' + escapePracticalHTML(experiment.category || '') + '</span><h3>' + escapePracticalHTML(experiment.title || '') + '</h3><p class="practical-experiment-card-en">' + escapePracticalHTML(experiment.englishTitle || '') + '</p><p>' + escapePracticalHTML(experiment.description || '') + '</p><button type="button" class="practical-open-btn" data-practical-open="' + escapePracticalHTML(experiment.id) + '">افتح التجربة ←</button></article>'; }).join('') + '</section>' + (references.length ? '<aside class="practical-references"><h3>مراجع التدريب</h3><p>للتفاصيل الإجرائية أو الكواشف أو النقل، تبقى SOP وتعليمات الشركة المرجع التنفيذي.</p><ul>' + references.map(function (reference) { return '<li><a href="' + escapePracticalHTML(reference.url) + '" target="_blank" rel="noopener noreferrer">' + escapePracticalHTML(reference.label) + '</a></li>'; }).join('') + '</ul></aside>' : '');
    bindPracticalLabEvents(container, null);
}

function bindPracticalLabEvents(container, experiment) {
    container.querySelectorAll('[data-practical-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            renderPracticalExperiment(button.getAttribute('data-practical-open'));
            const practicalPage = document.getElementById('practical-lab-page');
            if (practicalPage) { practicalPage.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
    container.querySelectorAll('[data-practical-back]').forEach(function (button) {
        button.addEventListener('click', function () { practicalLabState.activeExperimentId = null; renderPracticalLab(); });
    });
    if (!experiment || !Array.isArray(experiment.quiz)) { return; }
    container.querySelectorAll('.practical-question').forEach(function (questionElement) {
        const question = experiment.quiz[Number(questionElement.dataset.questionIndex)];
        questionElement.querySelectorAll('.practical-option').forEach(function (optionButton) {
            optionButton.addEventListener('click', function () {
                const selectedIndex = Number(optionButton.dataset.optionIndex);
                const correct = selectedIndex === question.correctAnswer;
                questionElement.querySelectorAll('.practical-option').forEach(function (button) {
                    button.disabled = true;
                    button.classList.toggle('is-correct', Number(button.dataset.optionIndex) === question.correctAnswer);
                    button.classList.toggle('is-incorrect', Number(button.dataset.optionIndex) === selectedIndex && !correct);
                });
                const feedback = questionElement.querySelector('.practical-feedback');
                feedback.hidden = false;
                feedback.className = 'practical-feedback ' + (correct ? 'is-correct' : 'is-incorrect');
                feedback.textContent = (correct ? '✓ إجابة صحيحة. ' : '✕ راجع الفكرة. ') + (question.explanation || '');
            });
        });
    });
}

function openPracticalExperimentFromSearch(searchText) {
    const normalizedQuery = typeof normalizeText === 'function' ? normalizeText(searchText || '') : String(searchText || '').toLowerCase();
    const matchingExperiment = getPracticalExperiments().find(function (experiment) {
        const sourceText = typeof normalizeText === 'function' ? normalizeText(JSON.stringify(experiment)) : JSON.stringify(experiment).toLowerCase();
        return normalizedQuery && sourceText.includes(normalizedQuery);
    }) || getPracticalExperiments()[0];
    if (matchingExperiment) { renderPracticalExperiment(matchingExperiment.id); } else { renderPracticalLab(); }
}

// =========================================================
// Developer Information — عارض عام مبني على developerInfoData
// أضف البيانات من data.js فقط؛ يبقى هذا العارض صالحاً للمشاريع
// والحسابات والمهارات والتقنيات اللاحقة من دون HTML ثابت.
// =========================================================

function escapeDeveloperHTML(value) {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function safeDeveloperURL(value) {
    try {
        const url = new URL(String(value || ''), window.location.origin);
        return /^(https?:)$/i.test(url.protocol) ? url.href : '#';
    } catch (error) {
        return '#';
    }
}

function developerPillsMarkup(items, className) {
    if (!Array.isArray(items) || !items.length) { return ''; }
    return '<div class="' + className + '">' + items.filter(Boolean).map(function (item) {
        return '<span>' + escapeDeveloperHTML(item) + '</span>';
    }).join('') + '</div>';
}

function developerSiteSectionsMarkup(sections) {
    if (!Array.isArray(sections) || !sections.length) { return ''; }
    return '<div class="developer-site-sections-grid">' + sections.filter(Boolean).map(function (section) {
        return '<article class="developer-site-section-card">' +
            '<span class="developer-site-section-icon" aria-hidden="true">' + escapeDeveloperHTML(section.icon || '✦') + '</span>' +
            '<div><h3>' + escapeDeveloperHTML(section.name || '') + '</h3>' +
            (section.englishName ? '<p class="developer-site-section-en" dir="ltr">' + escapeDeveloperHTML(section.englishName) + '</p>' : '') +
            '<p><strong>الوظيفة:</strong> ' + escapeDeveloperHTML(section.functionality || '') + '</p>' +
            '<p><strong>الهدف:</strong> ' + escapeDeveloperHTML(section.objective || '') + '</p></div>' +
        '</article>';
    }).join('') + '</div>';
}

function renderDeveloperProfile() {
    const container = document.getElementById('developer-profile-container');
    const profile = typeof developerInfoData !== 'undefined' ? developerInfoData : null;

    if (!container || !profile) { return; }

    const imagePath = String(profile.image || '').trim();
    const name = escapeDeveloperHTML(profile.name || 'المطور');
    const latinName = escapeDeveloperHTML(profile.latinName || '');
    const imageAlt = escapeDeveloperHTML(profile.imageAlt || profile.name || 'صورة المطور');
    const skills = developerPillsMarkup(profile.skills, 'developer-pill-list developer-skill-list');
    const technologies = developerPillsMarkup(profile.technologies, 'developer-pill-list developer-technology-list');
    const projects = Array.isArray(profile.projects) ? profile.projects : [];
    const accounts = Array.isArray(profile.accounts) ? profile.accounts : [];
    const siteSections = developerSiteSectionsMarkup(profile.siteSections);
    const accountMarkup = accounts.filter(function (account) {
        return account && account.url && account.label;
    }).map(function (account) {
        const safeUrl = safeDeveloperURL(account.url);
        return '<a class="developer-account-link ' + escapeDeveloperHTML(account.className || '') + '" href="' + escapeDeveloperHTML(safeUrl) + '" target="_blank" rel="noopener noreferrer">' +
            '<span aria-hidden="true">' + escapeDeveloperHTML(account.icon || '↗') + '</span>' + escapeDeveloperHTML(account.label) + '</a>';
    }).join('');
    const projectMarkup = projects.filter(Boolean).map(function (project) {
        return '<article class="developer-project-card"><span class="developer-project-icon" aria-hidden="true">' + escapeDeveloperHTML(project.icon || '✦') + '</span>' +
            '<h3>' + escapeDeveloperHTML(project.title || '') + '</h3><p>' + escapeDeveloperHTML(project.description || '') + '</p></article>';
    }).join('');
    const profileSearchName = [profile.name, profile.latinName, profile.title]
        .concat(profile.skills || [], profile.technologies || [])
        .filter(Boolean)
        .join(' ');
    const imageMarkup = imagePath
        ? '<div class="developer-avatar" aria-label="' + imageAlt + '"><img src="' + escapeDeveloperHTML(imagePath) + '" alt="' + imageAlt + '" loading="lazy" onerror="this.parentElement.classList.add(\'has-no-image\');this.remove();"></div>'
        : '<div class="developer-avatar has-no-image" aria-label="' + imageAlt + '"></div>';

    container.setAttribute('data-search-name', profileSearchName);
    container.innerHTML =
        '<article class="developer-official-profile" data-search-name="' + escapeDeveloperHTML(profileSearchName) + '">' +
            '<header class="developer-project-intro">' +
                '<p class="developer-basmala">' + escapeDeveloperHTML(profile.basmala || '') + '</p>' +
                '<aside class="developer-quote" aria-label="آية عن طلب العلم"><span aria-hidden="true">❝</span><p>' + escapeDeveloperHTML(profile.quranQuote && profile.quranQuote.text) + '</p><small>' + escapeDeveloperHTML(profile.quranQuote && profile.quranQuote.reference) + '</small></aside>' +
                '<div class="developer-project-name"><span class="developer-eyebrow">Zak Lab · Medical Laboratory Platform</span><h3>' + escapeDeveloperHTML(profile.projectName || 'Zak Lab') + '</h3><p>' + escapeDeveloperHTML(profile.projectLabel || 'منصة المختبرات الطبية') + '</p></div>' +
            '</header>' +
            '<section class="developer-project-overview"><div class="developer-section-heading"><span>🧪</span><div><h3>نبذة عن Zak Lab</h3><p>' + escapeDeveloperHTML(profile.projectIntroduction || '') + '</p></div></div></section>' +
            '<section class="developer-purpose-grid"><article><span aria-hidden="true">🎯</span><h3>هدف المنصة</h3><p>' + escapeDeveloperHTML(profile.projectGoal || '') + '</p></article><article><span aria-hidden="true">👨‍🎓</span><h3>الفئة المستهدفة</h3><p>' + escapeDeveloperHTML(profile.targetAudience || '') + '</p></article></section>' +
            (siteSections ? '<section class="developer-site-sections"><div class="developer-section-heading"><span>🧭</span><div><h3>أقسام Zak Lab</h3><p>يعرض كل قسم وظيفة تعليمية واضحة وهدفاً يساعد الطالب على استخدام المنصة بصورة منظمة.</p></div></div>' + siteSections + '</section>' : '') +
            '<section class="developer-about-section"><div class="developer-section-heading"><span>👨‍💻</span><div><h3>عن المطور</h3><p>المعلومات الرسمية المرتبطة بصاحب المنصة ومساره الأكاديمي.</p></div></div><div class="developer-profile-hero"><div class="developer-identity">' + imageMarkup +
                '<div class="developer-title-block"><span class="developer-eyebrow">Developer Information</span><h3>' + name + '</h3>' +
                (latinName ? '<p class="developer-latin-name" dir="ltr">' + latinName + '</p>' : '') +
                '<p class="developer-role">' + escapeDeveloperHTML(profile.title || '') + '</p><p class="developer-about-text">' + escapeDeveloperHTML(profile.aboutDeveloper || '') + '</p></div></div>' +
                '<div class="developer-academic-copy"><h3>المسار الأكاديمي</h3><p>' + escapeDeveloperHTML(profile.academicStatus || '') + '</p><p>' + escapeDeveloperHTML(profile.academicFocus || '') + '</p></div></div></section>' +
            '<section class="developer-capabilities"><div><h3>المهارات</h3>' + skills + '</div><div><h3>التقنيات</h3>' + technologies + '</div></section>' +
            (projectMarkup ? '<section class="developer-projects"><div class="developer-section-heading"><span>✦</span><div><h3>المشاريع والمنصات</h3><p>أمثلة من المسارات التعليمية والتقنية التي يطوّرها صاحب المنصة.</p></div></div><div class="developer-project-grid">' + projectMarkup + '</div></section>' : '') +
            (accountMarkup ? '<section class="developer-accounts"><div class="developer-section-heading"><span>↗</span><div><h3>الحسابات والمنصات الرسمية</h3><p>روابط التواصل والمحتوى التعليمي المرتبط بالمنصات المذكورة أعلاه.</p></div></div><div class="developer-account-grid">' + accountMarkup + '</div></section>' : '') +
            '<section class="developer-future-vision"><span aria-hidden="true">🔭</span><div><h3>الرؤية المستقبلية</h3><p>' + escapeDeveloperHTML(profile.vision || '') + '</p></div></section>' +
            '<footer class="developer-closing"><span aria-hidden="true">🔬</span><p>' + escapeDeveloperHTML(profile.closingMessage || '') + '</p></footer>' +
        '</article>';
}

document.addEventListener('DOMContentLoaded', renderDeveloperProfile);
