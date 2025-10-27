// ⚙️ ملف: base.js (مطوَّر ليعتمد على CSS)

// ====== تبديل الوضع المظلم (اعتماد كامل على CSS) ======
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  // لا نحتاج لتعيين transition هنا، بل نضعها في CSS على body
  localStorage.setItem("darkMode", isDark);

  // تحديث نص زر التبديل إذا كان موجودًا
  const toggleBtn = document.getElementById("darkToggle");
  if(toggleBtn) {
    toggleBtn.innerHTML = isDark ? 
      '<span class="icon">☀️</span> تفعيل الوضع الفاتح' : 
      '<span class="icon">🌙</span> تفعيل الوضع المظلم';
  }
}

// تطبيق الوضع المظلم المحفوظ عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("darkMode") === "true";
  if (savedMode) {
    // نطبق الفئة مباشرة
    document.body.classList.add("dark-mode");
  }
  
  // تحديث حالة زر التبديل عند بدء التشغيل
  const toggleBtn = document.getElementById("darkToggle");
  if(toggleBtn) {
    const isDark = document.body.classList.contains("dark-mode");
    toggleBtn.innerHTML = isDark ? 
      '<span class="icon">☀️</span> تفعيل الوضع الفاتح' : 
      '<span class="icon">🌙</span> تفعيل الوضع المظلم';
      
    // إضافة مستمع الحدث للزر
    toggleBtn.addEventListener("click", toggleDarkMode);
  }
});


// ====== عرض رسالة مؤقتة بأسلوب احترافي (يعتمد على فئات CSS) ======
function showMessage(text, type = "info") {
  // 1. حاوية الرسائل (تُنشأ مرة واحدة مع فئة CSS)
  let container = document.getElementById("message-container");
  if(!container){
    container = document.createElement("div");
    container.id = "message-container";
    // سنعتمد على CSS لجميع تنسيقات الموقع والثبات (position, zIndex, flex)
    document.body.appendChild(container);
  }

  // 2. إنشاء صندوق الرسالة
  const box = document.createElement("div");
  // إضافة فئات CSS لتنسيق الصندوق والنوع
  box.className = `message-box message-box-${type}`;
  box.textContent = text;
  container.appendChild(box);

  // 3. أنميشن الدخول (باستخدام فئة CSS)
  // ننتظر 50ms للتأكد من أن المتصفح طبق الأبعاد الابتدائية قبل إضافة فئة الدخول
  setTimeout(() => {
    box.classList.add("show");
  }, 50);

  // 4. إزالة الرسالة بعد 4 ثواني مع أنميشن خروج
  setTimeout(() => {
    box.classList.remove("show"); // إزالة فئة الدخول لبدء أنيميشن الخروج في CSS
    // الانتظار حتى اكتمال أنيميشن الخروج (يجب أن يكون 400ms أو أكثر في CSS)
    setTimeout(() => box.remove(), 500);
  }, 4000);
}


// ====== تصدير الدوال (إذا كنت تستخدم Modules) ======
// export { toggleDarkMode, showMessage };
