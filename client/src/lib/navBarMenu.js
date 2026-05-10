

export const adminMenu = [
  { menu: "แดชบอร์ด", navigate: "/admin" },
  { menu: "ระบบจัดการผู้ใช้", navigate: "/admin/manage-user" },
  { menu: "เพิ่มผู้ใช้งานใหม่", navigate: "/admin/add-user" },
  { menu: "ระบบประวัติการจำแนก", navigate: "/admin/history" },
  { menu: "ระบบจัดการสายพันธุ์", navigate: "/admin/manage-species" },
  { menu: "เพิ่มสายพันธุ์ใหม่", navigate: "/admin/add-species" },
  { menu: "ระบบจัดการครังรูปภาพ", navigate: "/admin/manage-gallery" },
];

export const userMenu = [
  { menu: "หน้าหลัก", navigate: "/" },
  { menu: "เริ่มการจำแนก", navigate: "/classification" },
  { menu: "เตรียมข้อมูลภาพ", navigate: "/preview" },
  { menu: "ประวัติการจำแนก", navigate: "/history" },
  { menu: "สายพันธุ์มันพื้นบ้าน", navigate: "/species" },
  { menu: "เข้าสู่หน้าผู้ดูแลระบบ", navigate: "/admin", adminOnly: true },
];

export const authMenu = [
  { menu: "เข้าสู่ระบบ", navigate: "/login" },
  { menu: "สมัครสมาชิก", navigate: "/signup" },
];
