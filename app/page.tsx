"use client";
import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { Login } from './action';

type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  console.log('Success:', values);
  const isLogin = await Login(values.username, values.password);
  if (isLogin) {
    alert('เข้าสู่ระบบแล้ว');
  } else {
    alert('username หรือ password ไม่ถูกต้อง');
  }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
  message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
};

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-teal-100">
      <div className="bg-white border border-gray-100 shadow-md rounded-2xl w-[400px] p-8">
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
            <Input placeholder="กรอกชื่อผู้ใช้" />
          </Form.Item>

          <Form.Item<FieldType>
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
          >
            <Input.Password placeholder="กรอกรหัสผ่าน" />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" className="mb-4">
            <Checkbox>จดจำการเข้าสู่ระบบ</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="rounded-md">
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
