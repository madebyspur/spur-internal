'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { HiDotsVertical } from "react-icons/hi";
import Sidebar from '../components/Sidebar';
import withAuth from '@/utils/withAuth';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const supabase = createClientComponentClient({
  url: 'https://opjkbdccpbiosetkkiuv.supabase.co',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wamtiZGNjcGJpb3NldGtraXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NDE4OTUsImV4cCI6MjAzMTQxNzg5NX0.tNF-ZUlPA66G80tBOvbAc3PSQh_dyV_yWzucpnTV-p0',
});

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [targetGoal, setTargetGoal] = useState(0);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [highlightedGoal, setHighlightedGoal] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: salesData, error: salesError } = await supabase
      .from('SalesOrders')
      .select('Total');

    const { count: ordersCount, error: ordersError } = await supabase
      .from('SalesOrders')
      .select('id', { count: 'exact' });

    if (salesError || ordersError) {
      console.error("Error fetching data:", salesError || ordersError);
    } else {
      const totalSales = salesData.reduce((acc, sale) => acc + sale.Total, 0);
      setTotalSales(totalSales);
      setTotalOrders(ordersCount);
    }
  };


  const handleAddGoal = () => {
    if (goals.length >= 6) {
      alert('Maximum of 6 goals reached');
      return;
    }
    setShowModal(true);
  };

  const handleCreateGoal = () => {
    if (!goalName || !selectedVariable || targetGoal <= 0) {
      alert('Please fill in all fields');
      return;
    }

    const newGoal = {
      id: new Date().getTime(), // Unique ID for the goal
      name: goalName,
      endDate,
      target: targetGoal,
      variable: selectedVariable,
      value: selectedVariable === 'Total Sales' ? totalSales : totalOrders,
    };

    setGoals([...goals, newGoal]);
    setShowModal(false);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleHighlightGoal = async (goal) => {
    setHighlightedGoal(goal);
    await supabase
      .from('HighlightedGoal')
      .upsert(goal, { onConflict: ['id'] });
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className={`flex-1 p-6 bg-gray-100 main-content ${isLoaded ? 'main-content-loaded' : ''}`}>
        <h2 className="text-gray-800 text-4xl font-bold mb-6">Goals</h2>
        <button onClick={handleAddGoal} className="mb-4 p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
          Add Goal
        </button>
        <div className="grid grid-cols-3 gap-4">
          {goals.map((goal, index) => (
            <div key={index} className="relative mb-6 p-4 bg-white rounded-md shadow-md">
              <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
              <HorizontalBarChart goal={goal} />
              <div className="absolute top-2 right-2">
                <HiDotsVertical className="cursor-pointer" onClick={() => setGoals(goals.map((g, i) => i === index ? { ...g, showMenu: !g.showMenu } : g))} />
                {goal.showMenu && (
                  <div className="absolute right-0 bg-white border border-gray-200 rounded shadow-md mt-2">
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="block px-4 py-2 text-left w-full text-red-600 hover:bg-gray-100"
                    >
                      Delete Goal
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-md w-1/3">
              <h2 className="text-2xl font-bold mb-4">Add Goal</h2>
              <input
                type="text"
                placeholder="Name of Goal"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="mb-4 p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Target Goal"
                value={targetGoal}
                onChange={(e) => setTargetGoal(parseInt(e.target.value))}
                className="mb-4 p-2 border rounded w-full"
              />
              <select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
              >
                <option value="">Select Variable</option>
                <option value="Total Sales">Total Sales</option>
                <option value="Total Orders">Total Orders</option>
              </select>
              <button
                onClick={handleCreateGoal}
                className="mt-4 p-3 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none opacity-0 transition-opacity duration-500"
                style={{ opacity: goalName && selectedVariable && targetGoal > 0 ? 1 : 0 }}
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function HorizontalBarChart({ goal }) {
  const percentage = Math.min(100, (goal.value / goal.target) * 100); // Calculate the percentage towards the goal

  const data = {
    labels: [goal.variable],
    datasets: [
      {
        label: `${percentage.toFixed(2)}%`,
        data: [percentage],
        backgroundColor: ['#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-32">
      <Bar data={data} options={options} />
    </div>
  );
}

export default withAuth(GoalsPage);
