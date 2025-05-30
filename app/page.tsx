"use client";
import React from "react";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import { Login } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/user";

type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const userStore = useUserStore();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const isLogin = await Login(values.username, values.password);
    if (isLogin !== false) {
      alert("เข้าสู่ระบบแล้ว");
      userStore.setUser(isLogin.id, isLogin.username);
      router.push("/transactions");
    } else {
      alert("username หรือ password ไม่ถูกต้อง");
      form.resetFields();
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#78A3D4] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold text-[#4200C5] mb-6">เข้าสู่ระบบ</h2>

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input
              placeholder="Username"
              className="w-full px-4 py-2 border border-[#78A3D4] rounded-md text-[#4200C5] placeholder-[#4200C5] focus:outline-none"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input.Password
              placeholder="รหัสผ่าน"
              className="w-full px-4 py-2 border border-[#78A3D4] rounded-md text-[#4200C5] placeholder-[#4200C5] focus:outline-none"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-[#222CF3] border border-[#78A3D4] text-white py-2 rounded-md hover:bg-[#5930d9] transition"
            >
              ล็อกอิน
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-[#4200C5] space-x-2">
          <Link href="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
