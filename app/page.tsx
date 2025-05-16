"use client";
import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl w-[400px] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">เข้าสู่ระบบ</h2>

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
            rules={[
              { required: true, message: 'กรุณากรอกรหัสผ่าน' },
              { min: 8, message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' },
            ]}
          >
            <Input.Password placeholder="กรอกรหัสผ่าน" />
          </Form.Item>

          <Form.Item<FieldType> 
            name="remember" 
            valuePropName="checked" 
            className="mb-4">
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
