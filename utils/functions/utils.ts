import { redirect } from "next/navigation";
// นำเข้า `redirect` จาก Next.js เพื่อใช้สำหรับเปลี่ยนเส้นทาง (Redirect) ไปยังหน้าอื่น

// สร้างฟังก์ชัน `encodedRedirect` สำหรับเปลี่ยนเส้นทางพร้อมแนบข้อความ
export function encodedRedirect(
  type: "error" | "success", // กำหนดประเภทข้อความที่ส่งไป (มีค่าได้แค่ "error" หรือ "success")
  path: string, // เส้นทาง (Path) ที่ต้องการเปลี่ยนเส้นทางไป
  message: string, // ข้อความที่ต้องการส่งไปพร้อม URL
) {
  // ใช้ฟังก์ชัน `redirect` เพื่อเปลี่ยนเส้นทาง
  return redirect(
    `${path}?${type}=${encodeURIComponent(message)}` 
    // สร้าง URL ใหม่:
    // - `path`: เส้นทางปลายทาง
    // - `?${type}=`: ใช้ส่งประเภทของข้อความ ("error" หรือ "success") เป็น query parameter
    // - `encodeURIComponent(message)`: เข้ารหัสข้อความเพื่อให้ปลอดภัยใน URL
    // ตัวอย่างผลลัพธ์: "/sign-in?error=Invalid%20email"
  );
}
