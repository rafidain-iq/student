// ====== الثوابت والعناصر ======
const SESSION_KEYS = ["studentData", "studentSession", "student"];
const DASHBOARD_ELEMENTS = {
  menuBtn: document.getElementById("menuBtn"),
  sidebar: document.getElementById("sidebar"),
  darkToggle: document.getElementById("darkToggle"),
  studentInfo: document.getElementById("student-info"),
  adminMessage: document.getElementById("admin-message"),
  newsList: document.getElementById('news-list'),
  homeNews: document.getElementById('home-news'),
  activitiesList: document.getElementById("activities-list"),
  course1: document.getElementById("course1"),
  course2: document.getElementById("course2"),
  scheduleTable: document.getElementById("schedule-table")
};

let studentData = null;

// ====== جلسة الطالب (تفضيل sessionStorage) ======
function readStudentSession(){
  for(const k of SESSION_KEYS){
    const raw = sessionStorage.getItem(k) || localStorage.getItem(k); // نبحث في sessionStorage أولاً
    if(raw){
      try { return JSON.parse(raw); } catch(e){ console.error("Session parse error:", e); }
    }
  }
  return null;
}

// ====== عرض صفحة مع أنميشن (الاعتماد على CSS) ======
function showPage(id, navItem){
  // 1. تحديث الشريط الجانبي (فئة active)
  document.querySelectorAll(".sidebar nav li").forEach(li => li.classList.remove("active"));
  if(navItem) navItem.classList.add("active");

  // 2. تحديث المحتوى (فئة active)
  const sections = document.querySelectorAll(".page");
  sections.forEach(p => p.classList.remove("active"));
  
  const el = document.getElementById(id);
  if(el){
    // سنعتمد على CSS لعمل أنيميشن الانتقال بناءً على فئة .page.active
    el.classList.add("active");
  }

  // 3. إغلاق الشريط الجانبي على الجوال
  if(DASHBOARD_ELEMENTS.sidebar.classList.contains("active")) {
    DASHBOARD_ELEMENTS.sidebar.classList.remove("active");
    DASHBOARD_ELEMENTS.sidebar.setAttribute("aria-hidden", true);
  }
  
  // 4. تحميل المحتوى عند النقر لأول مرة (Lazy Loading)
  switch(id) {
    case 'news':
      loadNews(); // يتم التحميل هنا لتجنب التحميل المزدوج
      break;
    case 'activities':
      loadActivities();
      break;
    // الدرجات والجدول يتم تحميلهما عند بدء التشغيل لسرعتهما
  }
}

// ====== وظيفة لعرض البطاقات مع أنيميشن (تم تبسيطها) ======
function displayCards(container, htmlContent){
  container.style.opacity = 0; // إخفاء الحاوية قبل التحديث
  container.innerHTML = htmlContent;
  
  // الاعتماد على CSS لعمل أنيميشن 'fade-in' على العناصر الجديدة
  const cards = container.querySelectorAll(".card");
  cards.forEach((card, i) => {
    card.classList.add('animate-card'); // فئة للأنيميشن في CSS
    card.style.animationDelay = `${i * 0.1}s`; // تأخير متتابع
  });
  
  container.style.opacity = 1; // إظهار الحاوية
}

// ====== تحميل الأخبار (المُحسن) ======
let newsLoaded = false;
async function loadNews() {
  if (newsLoaded) return; // منع التحميل المزدوج
  newsLoaded = true;
  
  const newsTarget = DASHBOARD_ELEMENTS.newsList;
  const homeTarget = DASHBOARD_ELEMENTS.homeNews;
  
  try {
    const res = await fetch('news.json', { cache: 'no-store' });
    const data = await res.json();

    // عرض جميع الأخبار
    if (newsTarget) {
      const allNewsHtml = data.map(item => `
        <div class="news-item card">
          <h3 class="card-title">${item.title}</h3>
          <p class="news-date">${item.date}</p>
          <p class="news-desc">${item.description}</p>
        </div>
      `).join('');
      displayCards(newsTarget, allNewsHtml);
    }

    // عرض آخر 3 أخبار في الرئيسية
    if (homeTarget) {
      const homeNewsHtml = data.slice(0, 3).map(n => `
        <div class="news-item card">
          <h4 class="card-title">${n.title}</h4>
          <p class="news-date">${n.date}</p>
          <p class="news-desc">${n.description}</p>
        </div>
      `).join('');
      displayCards(homeTarget, homeNewsHtml);
    }

  } catch (e) {
    console.error("خطأ في تحميل الأخبار:", e);
    if(newsTarget) newsTarget.innerHTML = "<div class='card error-message'>⚠️ تعذر تحميل الأخبار.</div>";
  }
}

// ====== تحميل النشاطات (Lazy Loaded) ======
let activitiesLoaded = false;
async function loadActivities(){
  if (activitiesLoaded) return;
  activitiesLoaded = true;

  const el = DASHBOARD_ELEMENTS.activitiesList;
  try{
    el.innerHTML = "<div class='loader-spinner'></div>"; // عرض سبينر أثناء التحميل
    const res = await fetch("ac.json",{cache:"no-store"});
    if(!res.ok) throw new Error("no activities");
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error("bad activities");

    const html = `<div class="table-responsive"><table class="activities-table data-table"><thead><tr><th>الاسم</th><th>الصف</th><th>الشعبة</th><th>نوع النشاط</th></tr></thead><tbody>` +
      data.map(a=>`<tr><td>${a.name||a.الاسم||""}</td><td>${a.class||a.الصف||""}</td><td>${a.section||a.الشعبة||""}</td><td>${a.type||a.نوع||""}</td></tr>`).join("") +
      `</tbody></table></div>`; // إضافة حاوية لجعل الجدول مستجيباً
      
    el.innerHTML = html;
  }catch(e){
    el.innerHTML = "<div class='card error-message'>⚠️ تعذر تحميل جدول النشاطات.</div>";
  }
}

// ====== عرض الدرجات (تم دمجها في دالة واحدة) ======
function renderGrades(student){
  if(!student || !student["الدرجات"]){ 
    DASHBOARD_ELEMENTS.course1.innerHTML = "<div class='card'>لا توجد درجات لعرضها.</div>"; 
    DASHBOARD_ELEMENTS.course2.innerHTML = "<div class='card'>لا توجد درجات لعرضها.</div>"; 
    return; 
  }

  const grades = student["الدرجات"];

  // الكورس الأول
  let html1 = `<div class="table-responsive"><table class="grades-table data-table"><thead><tr><th>المادة</th><th>شهر 1</th><th>شهر 2</th><th>نصف السنة</th></tr></thead><tbody>`;
  for (const subj in grades) {
    const d = grades[subj];
    html1 += `<tr><td>${subj}</td><td>${d["الشهر الأول"] ?? d["شهر1"] ?? ""}</td><td>${d["الشهر الثاني"] ?? d["شهر2"] ?? ""}</td><td>${d["نصف السنة"] ?? d["نصف"] ?? ""}</td></tr>`;
  }
  html1 += "</tbody></table></div>";
  DASHBOARD_ELEMENTS.course1.innerHTML = html1;

  // الكورس الثاني
  let html2 = `<div class="table-responsive"><table class="grades-table data-table"><thead><tr><th>المادة</th><th>شهر 1</th><th>شهر 2</th><th>السعي السنوي</th><th>النهائي</th><th>بعد الإكمال</th></tr></thead><tbody>`;
  for (const subj in grades) {
    const d = grades[subj];
    html2 += `<tr><td>${subj}</td><td>${d["الكورس الثاني - الشهر الأول"] ?? d["شهر1_2"] ?? ""}</td><td>${d["الكورس الثاني - الشهر الثاني"] ?? d["شهر2_2"] ?? ""}</td><td>${d["السعي السنوي"] ?? d["سعي_سنوي"] ?? ""}</td><td>${d["الدرجة النهائية"] ?? d["نهائي"] ?? ""}</td><td>${d["الدرجة النهائية بعد الإكمال"] ?? d["بعد_الإكمال"] ?? ""}</td></tr>`;
  }
  html2 += "</tbody></table></div>";
  DASHBOARD_ELEMENTS.course2.innerHTML = html2;
}

// ====== عرض الجدول الأسبوعي (تم دمجها في دالة واحدة) ======
function renderSchedule(student){
  const el = DASHBOARD_ELEMENTS.scheduleTable;
  if(!student || !student["الجدول"]){ el.innerHTML = "<div class='card'>لا يوجد جدول أسبوعي.</div>"; return; }
  
  const week = student["الجدول"];
  const days = Object.keys(week);
  
  let html = "<div class='table-responsive'><table class='schedule-table data-table'><thead><tr><th>اليوم</th><th>حصة1</th><th>حصة2</th><th>حصة3</th><th>حصة4</th><th>حصة5</th><th>حصة6</th></tr></thead><tbody>";
  for(const day of days){
    const row = week[day] || [];
    const cells = [];
    for(let i=0;i<6;i++) cells.push(`<td>${row[i] ?? ""}</td>`);
    html += `<tr><td>${day}</td>` + cells.join("") + `</tr>`;
  }
  html += "</tbody></table></div>";
  el.innerHTML = html;
}

// ====== معلومات الطالب ورسالة الإدارة (تم دمجها في دالة واحدة) ======
function renderStudentHome(student){
  const si = DASHBOARD_ELEMENTS.studentInfo;
  if(!student){ si.innerHTML = "<div>لا توجد بيانات.</div>"; return; }
  
  const name = student["الاسم"] || student.name || student.fullname || "";
  const cls = student["الصف"] || student.class || "";
  const sec = student["الشعبة"] || student.section || "";
  
  si.innerHTML = `
    <div class="student-detail"><span class="detail-label">الاسم:</span> <span class="detail-value">${name}</span></div>
    <div class="student-detail"><span class="detail-label">الصف:</span> <span class="detail-value">${cls} - ${sec}</span></div>
  `; // استخدام فئات للتنسيق

  const admin = DASHBOARD_ELEMENTS.adminMessage;
  const msg = student["رسالة"] || student["adminMessage"] || student.message || "";
  admin.innerHTML = msg ? `<div class="message-content">${msg}</div>` : `<div class="message-content no-message">لا توجد رسالة جديدة من الإدارة حالياً.</div>`;
  
  // تحميل الأخبار في صفحة البداية مباشرةً
  loadNewsHome();
}

// تحميل الأخبار في الرئيسية فقط
async function loadNewsHome() {
    // هذه الدالة ستنفذ جزء الأخبار في الرئيسية فقط، وتعتمد على دالة loadNews الرئيسية
    await loadNews();
}

// ====== الوضع المظلم ======
function applyDarkFromStorage(){
  if(localStorage.getItem("darkMode")==="on") document.body.classList.add("dark");
}
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "on" : "off");
}

// ====== تهيئة الواجهة (المنطق الرئيسي) ======
document.addEventListener("DOMContentLoaded", async () => {
  // 1. قراءة بيانات الطالب
  studentData = readStudentSession();
  if(!studentData){
    window.location.href = "index.html"; // إعادة التوجيه في حالة عدم وجود بيانات
    return;
  }

  // 2. تفعيل الوضع المظلم
  applyDarkFromStorage();

  // 3. عرض البيانات الثابتة
  renderStudentHome(studentData);
  renderGrades(studentData);
  renderSchedule(studentData);
  
  // 4. تهيئة التفاعلات
  DASHBOARD_ELEMENTS.menuBtn.addEventListener("click", ()=> {
    const open = DASHBOARD_ELEMENTS.sidebar.classList.toggle("active");
    DASHBOARD_ELEMENTS.sidebar.setAttribute("aria-hidden", !open);
  });

  document.querySelectorAll(".sidebar nav li[data-section]").forEach(li=>{
    li.addEventListener("click", (e)=> {
      // إغلاق الشريط الجانبي وتغيير الصفحة
      showPage(li.getAttribute("data-section"), li);
    });
  });

  if(DASHBOARD_ELEMENTS.darkToggle) DASHBOARD_ELEMENTS.darkToggle.addEventListener("click", toggleDark);
  
  // عرض الصفحة الرئيسية الافتراضية
  const initialNavItem = document.querySelector(".sidebar nav li[data-section='home']");
  showPage('home', initialNavItem);
});
