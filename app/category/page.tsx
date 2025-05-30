'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Modal, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Category {
  id: number;
  type: 'รายรับ' | 'รายจ่าย';
  icon: string;
  name: string;
}

export default function CategoryManagementPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, type: 'รายรับ', icon: '💰', name: 'เงินเดือน' },
    { id: 2, type: 'รายจ่าย', icon: '🍞', name: 'อาหาร' },
    { id: 3, type: 'รายจ่าย', icon: '🚗', name: 'ค่าเดินทาง' },
    { id: 4, type: 'รายจ่าย', icon: '🧴', name: 'ของใช้ส่วนตัว' },
    { id: 5, type: 'รายจ่าย', icon: '📦', name: 'อื่นๆ' },
  ]);

  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    icon: '',
    type: 'รายจ่าย',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // สำหรับ Modal ใส่จำนวนเงินในกรอบเลือกเงิน
  const [moneyModalOpen, setMoneyModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'รายรับ' | 'รายจ่าย' | null>(null);
  const [moneyAmount, setMoneyAmount] = useState('');

  // ตัวอย่างเก็บจำนวนเงินดึงไปใส่ในหมวดหมู่ (แค่เก็บแบบนี้ไว้ดูผล)
  const [moneyAllocated, setMoneyAllocated] = useState<{ type: 'รายรับ' | 'รายจ่าย'; amount: number }[]>([]);

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setNewCategory({ name: '', icon: '', type: 'รายจ่าย' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!newCategory.name || !newCategory.icon) {
      message.warning('กรุณากรอกชื่อหมวดหมู่และไอคอน');
      return;
    }
    if (editId !== null) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editId ? { ...cat, ...newCategory } : cat
        )
      );
      message.success('แก้ไขหมวดหมู่สำเร็จ');
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), ...newCategory },
      ]);
      message.success('เพิ่มหมวดหมู่สำเร็จ');
    }
    handleCancel();
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?',
      onOk: () => {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        message.success('ลบหมวดหมู่แล้ว');
      },
    });
  };

  const handleEdit = (category: Category) => {
    setNewCategory({ name: category.name, icon: category.icon, type: category.type });
    setEditId(category.id);
    setIsModalOpen(true);
  };

  // ฟังก์ชันเปิด modal ใส่เงิน และเซ็ตประเภทรายรับหรือรายจ่าย
  const openMoneyModal = (type: 'รายรับ' | 'รายจ่าย') => {
    setSelectedType(type);
    setMoneyAmount('');
    setMoneyModalOpen(true);
  };

  // ฟังก์ชันบันทึกเงินที่ใส่
  const saveMoneyAmount = () => {
    const parsed = parseFloat(moneyAmount);
    if (isNaN(parsed) || parsed <= 0) {
      message.error('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }
    if (selectedType) {
      setMoneyAllocated((prev) => [...prev, { type: selectedType, amount: parsed }]);
      message.success(`เพิ่มจำนวนเงิน ${parsed} บาท ให้กับหมวดหมู่ ${selectedType} เรียบร้อย`);
    }
    setMoneyModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-200 py-10 px-4 flex flex-col items-center">
      {/* ปุ่มนำทางด้านบน */}
      <div className="w-full max-w-xl flex justify-between bg-white px-6 py-3 shadow-sm rounded-b-md mb-4">
        <button
          onClick={() => router.push('/transactions')}
          className="text-blue-700 font-semibold hover:underline"
        >
          บันทึกรายการ
        </button>
        <button
          onClick={() => router.push('/summary')}
          className="text-blue-700 font-semibold hover:underline"
        >
          สรุปผล
        </button>
      </div>

      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">จัดหมวดหมู่</h2>

        {/* กรอบเลือกจำนวนเงิน */}
        <div className="flex justify-center gap-6 mb-6">
          <div
            onClick={() => openMoneyModal('รายรับ')}
            className="cursor-pointer border-2 border-green-600 rounded-md px-8 py-6 flex flex-col items-center justify-center text-green-700 font-semibold hover:bg-green-100 transition"
          >
            รายรับ
          </div>
          <div
            onClick={() => openMoneyModal('รายจ่าย')}
            className="cursor-pointer border-2 border-red-600 rounded-md px-8 py-6 flex flex-col items-center justify-center text-red-700 font-semibold hover:bg-red-100 transition"
          >
            รายจ่าย
          </div>
        </div>

        {/* รายการหมวดหมู่ */}
        <div className="flex justify-between text-lg font-semibold mb-4 px-2">
          <span className="text-green-600">รายรับ</span>
          <span className="text-red-500 underline">รายจ่าย</span>
        </div>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center px-2">
              <span>{cat.icon} {cat.name}</span>
              <div className="space-x-2">
                <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(cat)} />
                <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(cat.id)} />
              </div>
            </li>
          ))}
        </ul>
        <Button
          className="mt-6 w-full bg-purple-700 text-white hover:bg-purple-800"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          เพิ่มหมวดหมู่
        </Button>
      </div>

      {/* Modal ใส่จำนวนเงิน */}
      <Modal
        title={`เพิ่มจำนวนเงินให้กับหมวดหมู่ ${selectedType}`}
        open={moneyModalOpen}
        onCancel={() => setMoneyModalOpen(false)}
        onOk={saveMoneyAmount}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Input
          placeholder="กรอกจำนวนเงิน"
          value={moneyAmount}
          onChange={(e) => setMoneyAmount(e.target.value)}
          type="number"
          min={0}
          step="0.01"
          autoFocus
        />
      </Modal>

      {/* Modal เพิ่ม / แก้ไขหมวดหมู่ */}
      <Modal
        title={editId !== null ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <div className="space-y-4">
          <Select<'รายรับ' | 'รายจ่าย'>
            className="w-full"
            value={newCategory.type}
            onChange={(value) => setNewCategory((prev) => ({ ...prev, type: value }))}
            options={[
              { label: 'รายรับ', value: 'รายรับ' },
              { label: 'รายจ่าย', value: 'รายจ่าย' },
            ]}
          />
          <Input
            placeholder="ชื่อหมวดหมู่"
            value={newCategory.name}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="ไอคอน (emoji เช่น 🍕)"
            value={newCategory.icon}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, icon: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}
