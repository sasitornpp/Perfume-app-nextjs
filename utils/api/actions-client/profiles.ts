import { supabaseClient } from "@/utils/supabase/client"; 
// นำเข้าคลาส supabaseClient สำหรับเชื่อมต่อกับ Supabase
// นำเข้าประเภท Gender (ชาย, หญิง, อื่น ๆ) จากไฟล์ types เพื่อใช้กับข้อมูลโปรไฟล์

// ฟังก์ชันสำหรับอัปโหลดรูปภาพโปรไฟล์
const uploadProfileImage = async (file: File, fileName: string) => {
  // อัปโหลดไฟล์ไปยัง Supabase Storage ใน bucket "IMAGES"
  const { error: uploadError } = await supabaseClient.storage
    .from("IMAGES") // เลือก bucket ที่ชื่อ "IMAGES"
    .upload(`Avatars/${fileName}`, file); 
    // อัปโหลดไฟล์ไปที่โฟลเดอร์ "Avatars" และตั้งชื่อไฟล์ตาม fileName

  if (uploadError) { 
    // ถ้าเกิดข้อผิดพลาดระหว่างอัปโหลด
    throw new Error(`Error uploading file: ${uploadError.message}`); 
    // ขว้างข้อผิดพลาดพร้อมข้อความเพื่อแจ้งว่าอัปโหลดไม่สำเร็จ
  }

  // ดึง URL สาธารณะของไฟล์ที่อัปโหลด
  const { data: publicUrlData } = supabaseClient.storage
    .from("IMAGES") // เลือก bucket "IMAGES"
    .getPublicUrl(`Avatars/${fileName}`); 
    // สร้างลิงก์แบบสาธารณะสำหรับไฟล์ที่อัปโหลด

  return publicUrlData?.publicUrl || null; 
  // คืนค่าลิงก์สาธารณะของไฟล์ ถ้าไม่มีให้คืนค่าเป็น null
};

// ฟังก์ชันสำหรับสร้างหรืออัปเดตข้อมูลโปรไฟล์
export const createProfile = async (data: {
  userId: string; // ไอดีของผู้ใช้
  name: string; // ชื่อของผู้ใช้
  gender: string; // เพศของผู้ใช้ (ระบุด้วยประเภท Gender)
  bio: string; // ข้อมูลเกี่ยวกับตัวเอง
  imgFiles?: File; // รูปโปรไฟล์ (เป็นตัวเลือก, ไม่จำเป็นต้องมี)
}) => {
  const { name, bio, imgFiles, userId, gender } = data; 
  // ดึงค่าที่ส่งมาใน object `data`

  let avatarUrl = null; 
  // ตัวแปรสำหรับเก็บ URL รูปโปรไฟล์ (เริ่มต้นเป็น null)

  // ถ้ามีการอัปโหลดรูปภาพ
  if (imgFiles) { 
    avatarUrl = await uploadProfileImage(imgFiles, userId); 
    // เรียกฟังก์ชัน uploadProfileImage เพื่ออัปโหลดรูปและรับ URL
  }

  // อัปเดตข้อมูลโปรไฟล์ในตาราง "profiles"
  const { data: profileData, error: profileError } = await supabaseClient
    .from("profiles") 
    // เลือกตาราง profiles
    .update([
      {
        name: name, // ชื่อผู้ใช้
        bio: bio, // ข้อมูลเกี่ยวกับผู้ใช้
        gender: gender, // เพศของผู้ใช้
        img: avatarUrl, // URL ของรูปโปรไฟล์ (ถ้ามี)
      },
    ])
    .eq("id", userId); 
    // อัปเดตเฉพาะแถวที่มี id ตรงกับ userId

  if (profileError) { 
    // ถ้าเกิดข้อผิดพลาดระหว่างอัปเดต
    throw new Error(`Error creating profile: ${profileError.message}`); 
    // ขว้างข้อผิดพลาดพร้อมข้อความ
  }

  return profileData; 
  // คืนค่าข้อมูลโปรไฟล์ที่อัปเดตสำเร็จ
};
