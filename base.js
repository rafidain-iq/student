// ⚙️ ملف: base.js (محسن)

// ====== تبديل الوضع المظلم مع Transition سلس ======
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  // Transition سلس لكل العناصر
  document.body.style.transition = "background 0.4s, color 0.4s";
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// تطبيق الوضع المظلم المحفوظ عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("darkMode") === "true";
  if (savedMode) {
    document.body.classList.add("dark-mode");
    document.body.style.transition = "background 0.4s, color 0.4s";
  }
});

// ====== عرض رسالة مؤقتة بأسلوب احترافي ======
function showMessage(text, type = "info") {
  // حاوية الرسائل (تُنشأ مرة واحدة)
  let container = document.getElementById("message-container");
  if(!container){
    container = document.createElement("div");
    container.id = "message-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }

  const box = document.createElement("div");
  box.className = "message-box";
  box.style.padding = "12px 20px";
  box.style.borderRadius = "8px";
  box.style.minWidth = "200px";
  box.style.textAlign = "center";
  box.style.fontWeight = "500";
  box.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
  box.style.opacity = 0;
  box.style.transform = "translateY(-20px)";
  box.style.transition = "all 0.4s ease";

  // تحديد اللون حسب النوع
  if(type === "error"){
    box.style.background = "#ffcdd2";
    box.style.color = "#b71c1c";
  } else if(type === "success"){
    box.style.background = "#c8e6c9";
    box.style.color = "#1b5e20";
  } else {
    box.style.background = "#e3f2fd";
    box.style.color = "#0d47a1";
  }

  box.textContent = text;
  container.appendChild(box);

  // أنميشن الدخول
  setTimeout(() => {
    box.style.opacity = 1;
    box.style.transform = "translateY(0)";
  }, 50);

  // إزالة الرسالة بعد 4 ثواني مع أنميشن خروج
  setTimeout(() => {
    box.style.opacity = 0;
    box.style.transform = "translateY(-20px)";
    setTimeout(() => box.remove(), 400);
  }, 4000);
}

// ====== أمثلة استخدام ======
// showMessage("تم الحفظ بنجاح!", "success");
// showMessage("حدث خطأ أثناء الحفظ!", "error");
// toggleDarkMode();