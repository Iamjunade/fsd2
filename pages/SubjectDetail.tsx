import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import { ChevronLeft, FileText, Download, ExternalLink, Clock, CheckCircle } from 'lucide-react';

const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const subject = SUBJECTS.find(s => s.id === id);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  if (!subject) {
    return <div className="p-8 text-center text-slate-500">Subject not found.</div>;
  }

  const filteredExperiments = subject.experiments.filter(exp => {
    if (filter === 'all') return true;
    if (filter === 'pending') return exp.status === 'pending';
    return exp.status === 'completed' || exp.status === 'graded';
  });

  return (
    <div className="p-8 max-w-5xl mx-auto h-full">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft size={20} className="mr-1" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className={`h-32 ${subject.color} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="text-3xl font-bold text-white">{subject.name}</h1>
                <p className="text-white/80 mt-1 font-medium">{subject.code} • {subject.instructor}</p>
            </div>
        </div>
        <div className="p-6 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <div className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium">
                Total Labs: {subject.experiments.length}
             </div>
             <div className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium">
                Progress: {subject.progress}%
             </div>
           </div>
           <div className="flex space-x-2">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === f 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredExperiments.map((exp) => (
          <div key={exp.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    exp.status === 'completed' || exp.status === 'graded'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {exp.status}
                  </span>
               </div>
               <p className="text-slate-600 mb-4">{exp.description}</p>
               
               <div className="flex items-center space-x-6 text-sm text-slate-500">
                 <div className="flex items-center">
                   <Clock size={16} className="mr-2" />
                   Due: {exp.dueDate}
                 </div>
                 {exp.resources.length > 0 && (
                   <div className="flex items-center space-x-3">
                     <span className="font-medium text-slate-700">Resources:</span>
                     {exp.resources.map((res, idx) => (
                       <a key={idx} href={res.url} className="text-indigo-600 hover:underline flex items-center">
                         {res.type === 'pdf' ? <FileText size={14} className="mr-1"/> : <ExternalLink size={14} className="mr-1"/>}
                         {res.title}
                       </a>
                     ))}
                   </div>
                 )}
               </div>
             </div>
             
             <div className="flex items-center justify-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {exp.status === 'pending' ? (
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">
                        Submit Report
                    </button>
                ) : (
                    <div className="flex flex-col items-center text-emerald-600">
                        <CheckCircle size={28} className="mb-1" />
                        <span className="text-xs font-bold">Done</span>
                    </div>
                )}
             </div>
          </div>
        ))}
        
        {filteredExperiments.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
            No labs found with this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
