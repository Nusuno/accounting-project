"use client";
import React from "react";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import { RegisterUser } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      window.alert(result.message);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    message.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#78A3D4] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold text-[#4200C5] mb-6">
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
            name="username"
            rules={[
              { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
              {
                pattern: /^(?=.*[A-Z]).{6,}$/,
                message:
                  "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 6 ตัว และมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว",
              },
            ]}
          >
            <Input
              placeholder="Username"
              className="w-full px-4 py-2 border border-[#78A3D4] rounded-md text-[#4200C5] placeholder-[#4200C5] focus:outline-none"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: "กรุณากรอกรหัสผ่าน" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/,
                message:
                  "รหัสผ่านต้องมีความยาว 8-16 ตัว และรวมตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="รหัสผ่าน"
              className="w-full px-4 py-2 border border-[#78A3D4] rounded-md text-[#4200C5] placeholder-[#4200C5] focus:outline-none"
            />
          </Form.Item>

          <Form.Item<FieldType>
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
              สมัครสมาชิก
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-[#4200C5] space-x-2">
          <Link href="/">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;