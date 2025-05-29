// 'use client';
// import React from 'react';
// import { Button, Form, Input, message } from 'antd';
// import type { FormProps } from 'antd';
// import { motion } from 'framer-motion';
// import { Register } from '../action';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // << เพิ่มตรงนี้

// type FieldType = {
//   username: string;
//   password: string;
//   confirmPassword: string;
// };

// const RegisterPage: React.FC = () => {
//   const router = useRouter(); // << ใช้ router เพื่อเปลี่ยนหน้า

//   const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
//     if (values.password !== values.confirmPassword) {
//       message.error('รหัสผ่านไม่ตรงกัน');
//       return;
//     }

//     const success = await Register(values.username, values.password);
//     if (success) {
//       message.success('สมัครสมาชิกสำเร็จ! 🎉');
//       setTimeout(() => {
//         router.push('/'); // << เปลี่ยนเส้นทางไปยังหน้า login (หรือหน้าที่ต้องการ)
//       }, 1500); // รอให้ message แสดงก่อน 1.5 วิ
//     } else {
//       message.error('ชื่อผู้ใช้นี้ถูกใช้แล้ว');
//     }
//   };

//   const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
//     message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#eafbf6] to-[#fefefe] px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-3xl w-full max-w-sm p-8"
//       >
//         <div className="flex justify-center mb-4">
//           <motion.img
//             src="https://www.yuvabadhanafoundation.org/wp-content/uploads/2021/09/%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99-01-01.png"
//             alt="Logo"
//             className="w-16 h-16"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           />
//         </div>

//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">สมัครสมาชิก</h2>

//         <Form
//           name="register"
//           layout="vertical"
//           onFinish={onFinish}
//           onFinishFailed={onFinishFailed}
//           autoComplete="off"
//         >
//           <Form.Item<FieldType>
//             label="ชื่อผู้ใช้"
//             name="username"
//             rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
//           >
//             <Input placeholder="ตั้งชื่อผู้ใช้" className="rounded-md" />
//           </Form.Item>

//           <Form.Item<FieldType>
//             label="รหัสผ่าน"
//             name="password"
//             rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
//           >
//             <Input.Password placeholder="กรอกรหัสผ่าน" className="rounded-md" />
//           </Form.Item>

//           <Form.Item<FieldType>
//             label="ยืนยันรหัสผ่าน"
//             name="confirmPassword"
//             rules={[{ required: true, message: 'กรุณายืนยันรหัสผ่าน' }]}
//           >
//             <Input.Password placeholder="ยืนยันรหัสผ่าน" className="rounded-md" />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               className="rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-white font-medium transition-all duration-300"
//             >
//               สมัครสมาชิก
//             </Button>
//           </Form.Item>
//         </Form>

//         <div className="text-center text-black">
//           <Link href="/">เข้าสู่ระบบ</Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RegisterPage;
