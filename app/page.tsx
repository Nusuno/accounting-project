"use client";
import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { Login } from './action';
import { motion } from 'framer-motion';

type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  const isLogin = await Login(values.username, values.password);
  if (isLogin) {
    alert('เข้าสู่ระบบแล้ว');
  } else {
    alert('username หรือ password ไม่ถูกต้อง');
  }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
  message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
};

const LoginPage: React.FC = () => {
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
            src="https://www.yuvabadhanafoundation.org/wp-content/uploads/2021/09/%E0%B8%AD%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99-01-01.png"
            alt="Logo"
            className="w-16 h-16"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">เข้าสู่ระบบ</h2>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="ชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
          >
            <Input placeholder="กรอกชื่อผู้ใช้" className="rounded-md" />
          </Form.Item>

          <Form.Item<FieldType>
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
          >
            <Input.Password placeholder="กรอกรหัสผ่าน" className="rounded-md" />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" className="mb-4">
            <Checkbox className="text-gray-600">จดจำการเข้าสู่ระบบ</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="rounded-lg bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-500 hover:to-emerald-500 text-white font-medium transition-all duration-300"
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
