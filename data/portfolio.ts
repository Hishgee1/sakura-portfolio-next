export type AboutItem = {
  label: string;
  value: string;
};

export type Skill = {
  icon: string;
  name: string;
  desc: string;
  level: number;
};

export type Project = {
  name: string;
  desc: string;
  tags: string[];
  github: string;
  live: string;
};

export type ContactItem = {
  icon: string;
  label: string;
  value: string;
  href: string;
};

export type GalleryPhoto = {
  src: string;
  location: string;
  caption: string;
  date: string;
};

export type LearnItem = {
  type: "video" | "book" | "test";
  title: string;
  desc: string;
  level: string;
  href: string;
  src?: string;   // PDF path in /public/books/ — e.g. "/books/genki1.pdf"
  icon: string;
  tags: string[];
};

export type KanjiCard = {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
};

export type FutureGoal = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  tags: string[];
};

export type PortfolioData = {
  name: string;
  role: string;
  tagline: string;
  available: boolean;
  about: AboutItem[];
  skills: Skill[];
  learn: LearnItem[];
  kanji: KanjiCard[];
  gallery: GalleryPhoto[];
  projects: Project[];
  futureGoals: FutureGoal[];
  notionUrl: string;
  contact: ContactItem[];
};

export const DATA: PortfolioData = {

  name:      "Sakura",
  role:      "Програм хөгжүүлэгч & Өгөгдлийн сангийн мэргэжилтэн",
  tagline:   "Би бол хөөрхнөө барьж дйилэхгүй Мөндөө. ",
  available: true,

  about: [
    { label: "Мэргэжил",      value: "Програмист & DB Админ"     },
    { label: "Чиглэл",        value: "Backend & Data Engineering" },
    { label: "Давуу тал",     value: "Систем загвар, Оновчлол"    },
    { label: "Суралцаж буй",  value: "Cloud Архитектур & DevOps"  },
  ],

  skills: [
    { icon: "🗄️", name: "Өгөгдлийн сан",  desc: "PostgreSQL, MySQL, MSSQL",   level: 90 },
    { icon: "⚙️", name: "Backend",        desc: "Python, Node.js, REST APIs", level: 85 },
    { icon: "🔍", name: "Query оновчлол", desc: "Indexing, Execution Plans",  level: 88 },
    { icon: "🐳", name: "DevOps",         desc: "Docker, Git, CI/CD",         level: 75 },
    { icon: "☁️", name: "Cloud",          desc: "AWS RDS, S3, EC2",           level: 70 },
    { icon: "🔒", name: "Аюулгүй байдал", desc: "Auth, Backup & Recovery",    level: 80 },
  ],

  projects: [
    {
      name:   "Inventory Management System",
      desc:   "Full-stack inventory tracking app with real-time stock alerts, reports, and a normalized PostgreSQL database supporting 100k+ records efficiently.",
      tags:   ["Python", "PostgreSQL", "FastAPI", "React"],
      github: "https://github.com/",
      live:   "https://example.com",
    },
    {
      name:   "DB Performance Monitor",
      desc:   "Dashboard tool that analyzes slow queries, suggests missing indexes, and visualizes execution plans. Reduced query times by up to 60% in testing.",
      tags:   ["Node.js", "MySQL", "Chart.js"],
      github: "https://github.com/",
      live:   "",
    },
    {
      name:   "Automated Backup System",
      desc:   "Scheduled backup and restore tool for multi-database environments with encryption, compression, and Slack/email notifications on failure.",
      tags:   ["Python", "Bash", "AWS S3", "Docker"],
      github: "https://github.com/",
      live:   "",
    },
  ],

  learn: [
    // 📺 Video
    { type: "video", icon: "📺", title: "Nihongo no Mori",     level: "N5~N1", href: "#", desc: "JLPT шалгалтанд зориулсан grammar, vocabulary видео. Тайлбар маш тодорхой.",            tags: ["YouTube", "JLPT", "Grammar"]    },
    { type: "video", icon: "📺", title: "JapanesePod101",      level: "N5~N1", href: "#", desc: "Дуудлага, яриа, grammar — анхан шатнаас дэвшилтэт хүртэл бүх түвшний хичээл.",         tags: ["YouTube", "Listening", "Speaking"] },
    { type: "video", icon: "📺", title: "Organic Japanese",    level: "N4~N2", href: "#", desc: "Grammar-ийн гүнзгий тайлбар. Хэл зүйн бүтцийг ойлгоход хамгийн сайн суваг.",          tags: ["YouTube", "Grammar", "Structure"] },
    { type: "video", icon: "📺", title: "Comprehensible Japanese", level: "N5~N2", href: "#", desc: "Input method-ийн дагуу чихэнд дасгалжуулах. Уншиж, сонсож ойлгоно.",              tags: ["YouTube", "Listening", "Input"]  },

    // 📚 Book
    { type: "book",  icon: "📗", title: "Genki I",             level: "N5",    href: "#", src: "/books/genki1.pdf",      desc: "Японы хэлний анхан шатны сурах бичиг. Тэмдэглэгээ, grammar, vocabulary хамгийн эхнээс.", tags: ["Textbook", "N5", "Beginner"]    },
    { type: "book",  icon: "📘", title: "Genki II",            level: "N4",    href: "#", src: "/books/genki2.pdf",      desc: "Genki I-ийн үргэлжлэл. Дунд шатны grammar болон vocabulary өргөжүүлэх.",              tags: ["Textbook", "N4", "Intermediate"] },
    { type: "book",  icon: "📙", title: "Tobira",              level: "N3~N2", href: "#", src: "/books/tobira.pdf",      desc: "Дунд-дээд шатны сурах бичиг. Grammar болон reading intensive хандлага.",               tags: ["Textbook", "N3", "N2"]           },
    { type: "book",  icon: "📕", title: "Soumatome N2",        level: "N2",    href: "#", src: "/books/soumatome-n2.pdf",desc: "N2 шалгалтанд зориулсан grammar, vocabulary, reading дасгалын ном.",                  tags: ["JLPT", "N2", "Practice"]         },
    { type: "book",  icon: "📔", title: "Shin Kanzen N1",      level: "N1",    href: "#", src: "/books/shinkanzen-n1.pdf",desc: "N1 шалгалтанд зориулсан хамгийн дэлгэрэнгүй бэлтгэл ном. Нарийн grammar.",          tags: ["JLPT", "N1", "Advanced"]         },

    // 📝 Test
    { type: "test",  icon: "📝", title: "JLPT Official Practice", level: "N5~N1", href: "#", desc: "JLPT-ийн албан ёсны дасгал шалгалт. Бодит шалгалттай яг адил форматтай.",          tags: ["Official", "Full test"]          },
    { type: "test",  icon: "🧪", title: "Jtest4you",            level: "N5~N1", href: "#", desc: "Онлайн JLPT дасгал. Grammar, vocabulary, reading тус тусдаа дасгалжуулах боломжтой.", tags: ["Online", "Free", "Practice"]    },
    { type: "test",  icon: "⏱️", title: "N5 Mock Test",         level: "N5",    href: "#", desc: "N5 шалгалтын иж бүрэн дасгал. Хугацаа хэмжигдэг — бодит шалгалтын мэдрэмж.",        tags: ["N5", "Timed", "Mock"]           },
  ],

  kanji: [
    // N5
    { kanji: "日", reading: "にち・ひ",     meaning: "Нар / Өдөр",     level: "N5" },
    { kanji: "本", reading: "ほん・もと",   meaning: "Ном / Үндэс",    level: "N5" },
    { kanji: "山", reading: "やま・さん",   meaning: "Уул",             level: "N5" },
    { kanji: "水", reading: "みず・すい",   meaning: "Ус",              level: "N5" },
    { kanji: "人", reading: "ひと・じん",   meaning: "Хүн",             level: "N5" },
    { kanji: "大", reading: "おお・だい",   meaning: "Том / Агуу",      level: "N5" },
    { kanji: "小", reading: "ちい・しょう", meaning: "Жижиг",           level: "N5" },
    { kanji: "火", reading: "ひ・か",       meaning: "Гал",             level: "N5" },
    { kanji: "木", reading: "き・もく",     meaning: "Мод",             level: "N5" },
    { kanji: "月", reading: "つき・げつ",   meaning: "Сар / Долоо хоног", level: "N5" },
    { kanji: "上", reading: "うえ・じょう", meaning: "Дээр",            level: "N5" },
    { kanji: "下", reading: "した・か",     meaning: "Доор",            level: "N5" },
    // N4
    { kanji: "両", reading: "りょう",       meaning: "Хоёул / Аль аль", level: "N4" },
    { kanji: "運", reading: "うん・はこ",   meaning: "Хувь заяа / Зөөх", level: "N4" },
    { kanji: "映", reading: "えい・うつ",   meaning: "Кино / Тусгах",   level: "N4" },
    { kanji: "音", reading: "おと・おん",   meaning: "Дуу / Авиа",      level: "N4" },
    { kanji: "花", reading: "はな・か",     meaning: "Цэцэг",           level: "N4" },
    { kanji: "海", reading: "うみ・かい",   meaning: "Тэнгис",          level: "N4" },
    // N3
    { kanji: "確", reading: "かく・たし",   meaning: "Баталгаатай",     level: "N3" },
    { kanji: "願", reading: "がん・ねが",   meaning: "Хүсэл / Гуйх",   level: "N3" },
    { kanji: "境", reading: "きょう・さかい", meaning: "Хил / Орчин",   level: "N3" },
    { kanji: "幸", reading: "こう・しあわ", meaning: "Аз жаргал",       level: "N3" },
    // N2
    { kanji: "憶", reading: "おく",         meaning: "Санах / Дурсах",  level: "N2" },
    { kanji: "響", reading: "きょう・ひび", meaning: "Дуурсах / Нөлөө", level: "N2" },
    // N1
    { kanji: "叡", reading: "えい",         meaning: "Оюун ухаан",      level: "N1" },
    { kanji: "麗", reading: "れい・うるわ", meaning: "Гоё / Үзэсгэлэнт", level: "N1" },
  ],

  gallery: [
    { src: "/gallery/photo-01.jpg", location: "Дурсамж", caption: "Photo 01", date: "2026" },
    { src: "/gallery/photo-02.jpg", location: "Дурсамж", caption: "Photo 02", date: "2026" },
    { src: "/gallery/photo-03.jpg", location: "Дурсамж", caption: "Photo 03", date: "2026" },
    { src: "/gallery/photo-04.jpg", location: "Дурсамж", caption: "Photo 04", date: "2026" },
    { src: "/gallery/photo-05.jpg", location: "Дурсамж", caption: "Photo 05", date: "2026" },
    { src: "/gallery/photo-06.jpg", location: "Дурсамж", caption: "Photo 06", date: "2026" },
    { src: "/gallery/photo-07.jpg", location: "Дурсамж", caption: "Photo 07", date: "2026" },
    { src: "/gallery/photo-08.jpg", location: "Дурсамж", caption: "Photo 08", date: "2026" },
    { src: "/gallery/photo-09.jpg", location: "Дурсамж", caption: "Photo 09", date: "2026" },
    { src: "/gallery/photo-10.jpg", location: "Дурсамж", caption: "Photo 10", date: "2026" },
    { src: "/gallery/photo-11.jpg", location: "Дурсамж", caption: "Photo 11", date: "2026" },
    { src: "/gallery/photo-12.jpg", location: "Дурсамж", caption: "Photo 12", date: "2026" },
    { src: "/gallery/photo-13.jpg", location: "Дурсамж", caption: "Photo 13", date: "2026" },
    { src: "/gallery/photo-14.jpg", location: "Дурсамж", caption: "Photo 14", date: "2026" },
    { src: "/gallery/photo-15.jpg", location: "Дурсамж", caption: "Photo 15", date: "2026" },
    { src: "/gallery/photo-16.jpg", location: "Дурсамж", caption: "Photo 16", date: "2026" },
    { src: "/gallery/photo-17.jpg", location: "Дурсамж", caption: "Photo 17", date: "2026" },
    { src: "/gallery/photo-18.jpg", location: "Дурсамж", caption: "Photo 18", date: "2026" },
    { src: "/gallery/photo-19.jpg", location: "Дурсамж", caption: "Photo 19", date: "2026" },
    { src: "/gallery/photo-20.jpg", location: "Дурсамж", caption: "Photo 20", date: "2026" },
    { src: "/gallery/photo-21.jpg", location: "Дурсамж", caption: "Photo 21", date: "2026" },
    { src: "/gallery/photo-22.jpg", location: "Дурсамж", caption: "Photo 22", date: "2026" },
    { src: "/gallery/photo-23.jpg", location: "Дурсамж", caption: "Photo 23", date: "2026" },
    { src: "/gallery/photo-24.jpg", location: "Дурсамж", caption: "Photo 24", date: "2026" },
    { src: "/gallery/photo-25.jpg", location: "Дурсамж", caption: "Photo 25", date: "2026" },
    { src: "/gallery/photo-26.jpg", location: "Дурсамж", caption: "Photo 26", date: "2026" },
    { src: "/gallery/photo-27.jpg", location: "Дурсамж", caption: "Photo 27", date: "2026" },
    { src: "/gallery/photo-28.jpg", location: "Дурсамж", caption: "Photo 28", date: "2026" },
    { src: "/gallery/photo-29.jpg", location: "Дурсамж", caption: "Photo 29", date: "2026" },
    { src: "/gallery/photo-30.jpg", location: "Дурсамж", caption: "Photo 30", date: "2026" },
    { src: "/gallery/photo-31.jpg", location: "Дурсамж", caption: "Photo 31", date: "2026" },
    { src: "/gallery/photo-32.jpg", location: "Дурсамж", caption: "Photo 32", date: "2026" },
    { src: "/gallery/photo-33.jpg", location: "Дурсамж", caption: "Photo 33", date: "2026" },
    { src: "/gallery/photo-34.jpg", location: "Дурсамж", caption: "Photo 34", date: "2026" },
    { src: "/gallery/photo-35.jpg", location: "Дурсамж", caption: "Photo 35", date: "2026" },
    { src: "/gallery/photo-36.jpg", location: "Дурсамж", caption: "Photo 36", date: "2026" },
    { src: "/gallery/photo-37.jpg", location: "Дурсамж", caption: "Photo 37", date: "2026" },
    { src: "/gallery/photo-38.jpg", location: "Дурсамж", caption: "Photo 38", date: "2026" },
    { src: "/gallery/photo-39.jpg", location: "Дурсамж", caption: "Photo 39", date: "2026" },
    { src: "/gallery/photo-40.jpg", location: "Дурсамж", caption: "Photo 40", date: "2026" },
    { src: "/gallery/photo-41.jpg", location: "Дурсамж", caption: "Photo 41", date: "2026" },
    { src: "/gallery/photo-42.jpg", location: "Дурсамж", caption: "Photo 42", date: "2026" },
    { src: "/gallery/photo-43.jpg", location: "Дурсамж", caption: "Photo 43", date: "2026" },
    { src: "/gallery/photo-44.jpg", location: "Дурсамж", caption: "Photo 44", date: "2026" },
    { src: "/gallery/photo-45.jpg", location: "Дурсамж", caption: "Photo 45", date: "2026" },
  ],

  notionUrl: "https://www.notion.com/",

  futureGoals: [
    {
      title:    "Токиогийн Их Сургууль",
      subtitle: "Токио, Япон",
      desc:     "Бидний хамгийн том зорилго бол Азийн шилдэг их сургуулиудын нэг — Токиогийн Их Сургуульд программ хангамжаар суралцах. Миний хөөрхөн Мөндөө магистраар элсэж, харин би бакалавраар элсэж, судалгааны ажил хийх, Японы технологийн салбарт туршлага хуримтлуулах хүсэлтэй.",
      image:    "/tokyo-university.jpg",
      tags:     ["Программ хангамж","Магистр", "Бакалавр","Ажил"],
    },
  ],

  contact: [
    { icon: "✉️", label: "Email",     value: "sakura@example.com",        href: "mailto:sakura@example.com"   },
    { icon: "🐙", label: "GitHub",    value: "github.com/sakura",         href: "https://github.com/"         },
    { icon: "💼", label: "LinkedIn",  value: "linkedin.com/in/sakura",    href: "https://linkedin.com/"       },
    { icon: "📘", label: "Facebook",  value: "facebook.com/sakura",       href: "https://facebook.com/"       },
    { icon: "📸", label: "Instagram", value: "@sakura",                   href: "https://instagram.com/"      },
  ],
};
