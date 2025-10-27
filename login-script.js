// 🎯 عند تحميل الصفحة، شغّل الأنيميشن
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".login-container");
  container.classList.add("fade-in");
});

// 🎯 تعريف الصفوف
const classMap = {
  "رابع أ": "r4_a", "رابع ب": "r4_b", "رابع ج": "r4_c", "رابع د": "r4_d", "رابع هـ": "r4_e", "رابع و": "r4_f",
  "خامس أ": "r5_a", "خامس ب": "r5_b", "خامس ج": "r5_c", "خامس د": "r5_d", "خامس هـ": "r5_e", "خامس و": "r5_f",
  "سادس أ": "r6_a", "سادس ب": "r6_b", "سادس ج": "r6_c", "سادس د": "r6_d", "سادس هـ": "r6_e", "سادس و": "r6_f"
};

// 🎯 حدث عند الضغط على زر الدخول
document.getElementById("login-btn").addEventListener("click", login);

function login() {
  const code = document.getElementById("code").value.trim().toUpperCase();
  const studentClass = document.getElementById("class").value.trim();

  // ✅ فحص الإدخال
  if (!code || !studentClass) {
    showToast("⚠️ يرجى إدخال الكود واختيار الصف.", "warning");
    return;
  }

  const key = classMap[studentClass];
  if (!key) {
    showToast("❌ الصف غير معروف.", "error");
    return;
  }

  // ✨ عرض تأثير التحميل
  showLoader(true);

  const script = document.createElement("script");
  script.src = `student_data_files/data_${key}.js`;

  script.onload = function () {
    showLoader(false);

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

    // ✨ انتقال ناعم للداشبورد
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  };

  script.onerror = function () {
    showLoader(false);
    showToast("⚠️ تعذر تحميل بيانات الصف المحدد.", "warning");
  };

  document.body.appendChild(script);
}

// 🟣 دالة إظهار التحميل
function showLoader(show) {
  let loader = document.querySelector(".loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = "<div></div><div></div><div></div><div></div>";
    document.body.appendChild(loader);
  }
  loader.style.display = show ? "flex" : "none";
}

// 🟢 دالة عرض Toast بدل الـ alert
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}