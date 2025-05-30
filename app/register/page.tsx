"use client";
import React from "react";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import { RegisterUser } from "./action"; // ฟังก์ชันที่เราสร้างไว้
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldType = {
  username: string;
  password: string;
  confirmPassword?: string;
};

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values.password !== values.confirmPassword) {
      window.alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    const result = await RegisterUser(values.username, values.password);

    if (result.success) {
      message.success(result.message);
      const isConfirmed = window.confirm(
        "สมัครสมาชิกสำเร็จแล้ว กลับเข้าสู่หน้า เข้าสู่ระบบหรือไม่"
      );
      if (isConfirmed) {
        router.push("/");
      }
    } else {
      window.alert(result.message); // ใช้ alert แจ้งเตือนถ้าชื่อซ้ำหรือ error อื่น
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
    window.alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#f0f4ff] via-[#eafbf6] to-[#fefefe] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-3xl w-full max-w-sm p-8"
      >
        {/* โลโก้ */}
        <div className="flex justify-center mb-4">
          <motion.img
            src="c:\Users\DMC-14\Desktop\mbeawww.jpg"
            alt="Logo"
            className="w-16 h-16"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          สมัครสมาชิก
        </h2>

        <Form
          name="register"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="ชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input placeholder="กรอกชื่อผู้ใช้" className="rounded-md" />
          </Form.Item>

          <Form.Item<FieldType>
            label="รหัสผ่าน"
            name="password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่าน" },
              { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="กรอกรหัสผ่าน" className="rounded-md" />
          </Form.Item>

          <Form.Item<FieldType>
            label="ยืนยันรหัสผ่าน"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "กรุณายืนยันรหัสผ่าน" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("รหัสผ่านทั้งสองช่องไม่ตรงกัน!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="ยืนยันรหัสผ่าน"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-medium transition-all duration-300"
            >
              สมัครสมาชิก
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-black mt-4">
          มีบัญชีอยู่แล้ว? <Link href="/">เข้าสู่ระบบที่นี่</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
