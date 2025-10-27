// filepath:frontend/src/app/statsCards/admin/page.js
'use client';
import React from 'react';
import { BookOpen, Eye, CreditCard, Check, DollarSign } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Active Courses',
      value: stats.activeCourses,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'text-purple-600'
    },
    {
      title: 'Completed',
      value: stats.completedPayments,
      icon: Check,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 rounded-[19px]" style={{ backgroundColor: "rgb(185, 185, 185)" }}>
            <div className="flex items-center">
              <Icon className={`w-8 h-8 ${card.color}`} />
              <div className="ml-4">
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}