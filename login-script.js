// ====== الثوابت والعناصر ======
// 🎯 عند تحميل الصفحة، شغّل الأنيميشن
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".login-container");
  // استخدام فئة التحميل البطيء (fade-in) التي يفترض أنها في ملف CSS
  if (container) {
    container.classList.add("fade-in");
  }
});

// 🎯 تعريف الصفوف (استخدام const أفضل)
const CLASS_MAP = {
  "رابع أ": "r4_a", "رابع ب": "r4_b", "رابع ج": "r4_c", "رابع د": "r4_d", "رابع هـ": "r4_e", "رابع و": "r4_f",
  "خامس أ": "r5_a", "خامس ب": "r5_b", "خامس ج": "r5_c", "خامس د": "r5_d", "خامس هـ": "r5_e", "خامس و": "r5_f",
  "سادس أ": "r6_a", "سادس ب": "r6_b", "سادس ج": "r6_c", "سادس د": "r6_d", "سادس هـ": "r6_e", "سادس و": "r6_f"
};

// 🎯 العناصر الرئيسية
const loginBtn = document.getElementById("login-btn");
const codeInput = document.getElementById("code");
const classSelect = document.getElementById("class");

// 🎯 حدث عند الضغط على زر الدخول
if (loginBtn) {
    loginBtn.addEventListener("click", login);
}


// ====== دالة تسجيل الدخول الرئيسية ======
function login() {
  const code = codeInput.value.trim().toUpperCase();
  const studentClass = classSelect.value.trim();

  // ✅ فحص الإدخال
  if (!code || !studentClass) {
    showToast("⚠️ يرجى إدخال الكود واختيار الصف.", "warning");
    return;
  }

  const key = CLASS_MAP[studentClass];
  if (!key) {
    showToast("❌ الصف غير معروف.", "error");
    return;
  }

  // ✨ عرض تأثير التحميل على الزر والشاشة
  setLoadingState(true);

  // 1. إنشاء عنصر سكريبت جديد
  const script = document.createElement("script");
  script.src = `student_data_files/data_${key}.js`;

  // 2. عند التحميل بنجاح
  script.onload = function () {
    setLoadingState(false);
    
    // فحص تحميل البيانات (افتراض أن المتغير 'students' معرف داخل ملف البيانات)
    if (typeof students === "undefined") {
      showToast("🚫 تعذر تحميل بيانات الطلاب.", "error");
      return;
    }

    const student = students.find(s => s["الكود"] === code);
    if (!student) {
      showToast("❌ الكود غير صحيح أو لا ينتمي للصف المحدد.", "error");
      return;
    }

    // ✅ تخزين البيانات والانتقال
    localStorage.setItem("studentData", JSON.stringify(student));

    // ✨ انتقال ناعم للداشبورد باستخدام فئة CSS
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  };

  // 3. عند حدوث خطأ في التحميل
  script.onerror = function () {
    setLoadingState(false);
    showToast("⚠️ تعذر تحميل بيانات الصف المحدد.", "warning");
  };

  // 4. إضافة السكريبت إلى الصفحة لبدء التحميل
  document.body.appendChild(script);
}


// ====== وظائف المساعدة (Utilities) ======

// 🟣 دالة تحديث حالة التحميل (تشمل الزر و الشاشة)
function setLoadingState(isLoading) {
  // تحديث حالة الزر (لتطبيق تأثير الأنيميشن المطلوب في CSS)
  loginBtn.disabled = isLoading;
  loginBtn.classList.toggle("is-loading", isLoading);
  
  // إظهار أو إخفاء محمل الشاشة الكامل
  showLoader(isLoading); 
}

// 🟢 دالة إظهار محمل الشاشة الكامل (المحسن)
function showLoader(show) {
  let loader = document.querySelector(".loader-overlay");
  
  if (show && !loader) {
    // إنشاء Loader (Overlay)
    loader = document.createElement("div");
    loader.className = "loader-overlay"; // تغيير الاسم ليكون أوضح
    loader.innerHTML = '<div class="spinner"></div>'; // استخدام سبينر أبسط لتطبيق تصميم احترافي
    document.body.appendChild(loader);
    
  } else if (!show && loader) {
    // إزالة Loader
    loader.remove();
  }
}

// 🟡 دالة عرض Toast بدل الـ alert (احترافية ومحفوظة)
function showToast(message, type = "info") {
  const toastContainer = document.querySelector(".toast-container") || (() => {
    const div = document.createElement("div");
    div.className = "toast-container";
    document.body.appendChild(div);
    return div;
  })();
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // إظهار التوست
  setTimeout(() => toast.classList.add("show"), 50);
  
  // إخفاء التوست
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400); // إزالة بعد انتهاء أنيميشن الإخفاء
  }, 3000); // يختفي بعد 3 ثوانٍ
}
