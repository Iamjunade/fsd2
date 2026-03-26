import React, { useState, useEffect } from 'react';
import { TARGET_DATE } from '../constants';
import LabCard from '../components/LabCard';
import { getLabs, Lab } from '../services/labService';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const now = new Date();
  const daysRemaining = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    const fetchLabs = async () => {
      const fetchedLabs = await getLabs();
      setLabs(fetchedLabs);
    };
    fetchLabs();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back, Student</h1>
          <p className="text-slate-500">2nd Year, 2nd Semester • Engineering Department</p>
        </div>
        <div className="bg-indigo-50 text-indigo-900 px-4 py-3 rounded-xl flex items-center border border-indigo-100">
          <Calendar size={20} className="mr-3 text-indigo-600" />
          <div>
             <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">Target: May 2026</p>
             <p className="font-bold text-lg leading-none">{daysRemaining} <span className="text-sm font-normal">Days to Go</span></p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4">
             <CheckCircle2 size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-slate-800">12</p>
             <p className="text-sm text-slate-500">Completed Labs</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
             <Clock size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-slate-800">5</p>
             <p className="text-sm text-slate-500">Pending Reports</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
             <Calendar size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-slate-800">4</p>
             <p className="text-sm text-slate-500">Active Subjects</p>
           </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-6">Current Labs</h2>
      
      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {labs.map((lab, index) => (
          <LabCard key={lab.id} lab={lab} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
