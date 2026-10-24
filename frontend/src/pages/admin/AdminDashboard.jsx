import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Plus, BookOpen, Users, DollarSign, 
  Video, Eye, Edit3, Trash2 
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Published Courses', value: '3', icon: BookOpen, change: '+1 this month' },
    { label: 'Active Students', value: '84', icon: Users, change: '100% solo cohort' },
    { label: 'Total Revenue', value: '₹1,84,000', icon: DollarSign, change: 'Via Polar Payments' },
    { label: 'Total Video Lessons', value: '106', icon: Video, change: 'ImageKit HLS' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Full-Stack Fast & Furious: React + FastAPI Production Mastery',
      price: '₹2,499',
      lessons: 42,
      status: 'Published',
      students: 54,
    },
    {
      id: 2,
      title: 'System Design & High-Concurrency Microservices with Python',
      price: '₹2,999',
      lessons: 36,
      status: 'Published',
      students: 21,
    },
    {
      id: 3,
      title: 'Modern Frontend Engineering with React & Tailwind',
      price: '₹1,999',
      lessons: 28,
      status: 'Published',
      students: 9,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Studio Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Manage your courses, curriculum, video uploads, and monitor student enrollments.
          </p>
        </div>

        <button
          onClick={() => alert('Course creator modal will be active in Phase 4 (Admin CMS Studio)!')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-[11px] text-gray-400">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Courses Management Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Your Courses</h3>
          <span className="text-xs text-gray-500">3 of 3 active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-[#0a0d14] text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Lessons</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{course.title}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.price}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.lessons}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{course.students} students</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
