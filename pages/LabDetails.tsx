import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExperimentsByLab, seedExperiments, Experiment } from '../services/experimentService';
import { getLabs, Lab } from '../services/labService';
import { ChevronRight, Calendar, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export const LabDetails: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { profile } = useAuth();

  const fetchLabAndExperiments = async () => {
    if (!labId) return;
    setLoading(true);
    try {
      const labs = await getLabs();
      const currentLab = labs.find(l => l.id === labId);
      if (currentLab) setLab(currentLab);

      let exps = await getExperimentsByLab(labId);
      if (exps.length === 0) {
        console.log('No experiments found for this lab, seeding...');
        try {
          await seedExperiments(labId);
        } catch (e) {
          console.warn("Could not seed experiments:", e);
        }
        exps = await getExperimentsByLab(labId);
      }
      setExperiments(exps);
    } catch (error) {
      console.error('Error fetching experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabAndExperiments();
  }, [labId]);

  const handleUpdateLabData = async () => {
    if (!labId) return;
    if (window.confirm('Are you sure you want to update the lab data? This will overwrite existing experiments for this lab.')) {
      setUpdating(true);
      try {
        await seedExperiments(labId);
        await fetchLabAndExperiments();
        alert('Lab data updated successfully!');
      } catch (error) {
        console.error('Error updating lab data:', error);
        alert('Failed to update lab data.');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading && !updating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!lab) return <div className="text-center py-12">Lab not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex items-center text-sm text-slate-400 mb-4">
          <Link to="/labs" className="hover:text-indigo-400 transition-colors">Labs</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-slate-200">{lab.name}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl ${lab.bg} flex items-center justify-center ${lab.color} shadow-inner`}>
              <span className="font-bold text-2xl">{lab.code.slice(-2)}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{lab.name}</h1>
              <p className="text-slate-400 font-mono mt-1">{lab.code}</p>
            </div>
          </div>
          
          {profile?.role === 'admin' && (
            <button
              onClick={handleUpdateLabData}
              disabled={updating}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors border border-slate-700 w-fit"
            >
              <RefreshCw size={16} className={updating ? "animate-spin" : ""} />
              <span className="text-sm font-medium">{updating ? 'Updating...' : 'Update Lab Data'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((exp, index) => (
          <Link 
            to={`/labs/${labId}/experiments/${exp.id}`}
            key={exp.id}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                  Week {exp.weekNumber}
                </span>
                <Calendar size={16} className="text-slate-500" />
              </div>
              
              <h3 className="text-lg font-bold mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {exp.title}
              </h3>
              
              <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                {exp.aim}
              </p>
              
              <div className="mt-auto flex items-center justify-between text-sm font-medium text-slate-300 border-t border-slate-700/50 pt-4">
                <div className="flex items-center space-x-2 text-slate-400">
                  <BookOpen size={16} />
                  <span>Manual</span>
                </div>
                <div className="flex items-center text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>View</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
