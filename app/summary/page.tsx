"use client";
import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// เพิ่ม property ที่ขาดไปใน Transaction
type Transaction = {
  id: string;
  createdAt: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
};

type ChartData = {
  category: string;
  income: number;
  expense: number;
};

type ViewMode = "overall" | "monthly" | "daily";

export default function SummaryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("overall");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [displayTotalIncome, setDisplayTotalIncome] = useState<number>(0);
  const [displayTotalExpense, setDisplayTotalExpense] = useState<number>(0);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData);
      });
  }, []);

  const uniqueMonths = useMemo(() => {
    if (!transactions.length) return [];
    const months = new Set(
      transactions.map((t) => t.createdAt.substring(0, 7))
    );
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const uniqueDates = useMemo(() => {
    if (!transactions.length) return [];
    let filteredByMonth = transactions;
    if (
      viewMode === "daily" &&
      selectedMonth &&
      uniqueMonths.includes(selectedMonth)
    ) {
      filteredByMonth = transactions.filter((t) =>
        t.createdAt.startsWith(selectedMonth)
      );
    }
    const dates = new Set(
      filteredByMonth.map((t) => t.createdAt.substring(0, 10))
    );
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [transactions, viewMode, selectedMonth, uniqueMonths]);

  useEffect(() => {
    if (viewMode === "monthly" && uniqueMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(uniqueMonths[0]);
    }
    if (viewMode === "daily" && uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [viewMode, uniqueMonths, uniqueDates, selectedMonth, selectedDate]);

  useEffect(() => {
    if (!transactions.length) {
      setChartData([]);
      setDisplayTotalIncome(0);
      setDisplayTotalExpense(0);
      return;
    }

    let filteredTransactions = transactions;

    if (viewMode === "monthly" && selectedMonth) {
      filteredTransactions = transactions.filter((t) =>
        t.createdAt.startsWith(selectedMonth)
      );
    } else if (viewMode === "daily" && selectedDate) {
      filteredTransactions = transactions.filter((t) =>
        t.createdAt.startsWith(selectedDate)
      );
    }

    const aggregatedData: {
      [key: string]: { income: number; expense: number };
    } = {};
    let currentTotalIncome = 0;
    let currentTotalExpense = 0;

    filteredTransactions.forEach((t) => {
      if (!aggregatedData[t.category]) {
        aggregatedData[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === "INCOME") {
        aggregatedData[t.category].income += t.amount;
        currentTotalIncome += t.amount;
      } else if (t.type === "EXPENSE") {
        aggregatedData[t.category].expense += t.amount;
        currentTotalExpense += t.amount;
      }
    });

    const newChartData = Object.keys(aggregatedData)
      .map((category) => ({
        category,
        income: aggregatedData[category].income,
        expense: aggregatedData[category].expense,
      }))
      .filter((d) => d.income > 0 || d.expense > 0);

    setChartData(newChartData);
    setDisplayTotalIncome(currentTotalIncome);
    setDisplayTotalExpense(currentTotalExpense);
  }, [transactions, viewMode, selectedMonth, selectedDate]);

  return (
    <div className="bg-[#78A3D4] min-h-screen text-[#4200C5] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4200C5]">
          แดชบอร์ดสรุปสถานะทางการเงิน
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            {(["overall", "monthly", "daily"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  if (mode !== "monthly") setSelectedMonth("");
                  if (mode !== "daily") setSelectedDate("");
                }}
                className={`px-4 py-2 rounded-md font-semibold transition-colors
                  ${
                    viewMode === mode
                      ? "bg-[#4200C5] text-white"
                      : "bg-gray-200 text-[#4200C5] hover:bg-gray-300"
                  }`}
              >
                {mode === "overall"
                  ? "ภาพรวม"
                  : mode === "monthly"
                  ? "รายเดือน"
                  : "รายวัน"}
              </button>
            ))}
          </div>

          {viewMode === "monthly" && uniqueMonths.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border border-[#78A3D4] rounded-md text-[#4200C5] focus:ring-2 focus:ring-[#4200C5]"
            >
              {uniqueMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          )}
          {viewMode === "daily" && uniqueDates.length > 0 && (
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-[#78A3D4] rounded-md text-[#4200C5] focus:ring-2 focus:ring-[#4200C5]"
            >
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-8">
          <div className="bg-[#A8D5BA] text-[#004D40] rounded-lg p-6 shadow">
            <p className="text-xl">รายรับรวม</p>
            <p className="text-3xl font-bold">
              ฿{displayTotalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#F8BABA] text-[#7F0000] rounded-lg p-6 shadow">
            <p className="text-xl">รายจ่ายรวม</p>
            <p className="text-3xl font-bold">
              ฿{displayTotalExpense.toFixed(2)}
            </p>
          </div>
        </div>
        {chartData.length > 0 ? (
          <div style={{ width: "100%", height: 400 }} className="mb-8">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D1C4E9" />
                <XAxis
                  dataKey="category"
                  angle={-30}
                  textAnchor="end"
                  height={70}
                  stroke="#4200C5"
                  interval={0}
                />
                <YAxis stroke="#4200C5" />
                <Tooltip
                  formatter={(value: number) => `฿${value.toFixed(2)}`}
                  cursor={{ fill: "#F3E5F5" }}
                />
                <Legend wrapperStyle={{ color: "#4200C5" }} />
                <Bar dataKey="income" fill="#4CAF50" name="รายรับ" />
                <Bar dataKey="expense" fill="#F44336" name="รายจ่าย" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-[#4200C5] py-10">
            {transactions.length === 0
              ? "กำลังโหลดข้อมูล..."
              : "ไม่พบข้อมูลสำหรับช่วงเวลาที่เลือก"}
          </p>
        )}
      </div>
    </div>
  );
}
