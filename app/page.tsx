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

const LoginForm: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Form
        name="login"
        layout="vertical"
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>

        <Form.Item<FieldType>
          label="ชื่อผู้ใช้"
          name="username"
          rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="รหัสผ่าน"
          name="password"
          rules={[
            { required: true, message: 'กรุณากรอกรหัสผ่าน' },
            { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>จดจำการเข้าสู่ระบบ</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            เข้าสู่ระบบ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
