import React, { useState, useEffect } from 'react';
import { getLabs, seedLabs, Lab } from '../services/labService';
import LabCard from '../components/LabCard';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

export const Labs: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { profile } = useAuth();

  const fetchLabs = async () => {
    try {
      const data = await getLabs();
      setLabs(data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleUpdateLabs = async () => {
    if (window.confirm('Are you sure you want to update the labs data? This will overwrite existing labs.')) {
      setUpdating(true);
      try {
        await seedLabs();
        await fetchLabs();
        alert('Labs data updated successfully!');
      } catch (error) {
        console.error('Error updating labs data:', error);
        alert('Failed to update labs data. You may not have permission.');
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Engineering Labs</h1>
          <p className="text-slate-400">Select a lab to view experiments and community contributions.</p>
        </div>
        
        {profile?.role === 'admin' && (
          <button
            onClick={handleUpdateLabs}
            disabled={updating}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors border border-slate-700 whitespace-nowrap"
          >
            <RefreshCw size={16} className={updating ? "animate-spin" : ""} />
            <span>{updating ? 'Updating...' : 'Update Labs Data'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab, index) => (
          <LabCard key={lab.id} lab={lab} index={index} />
        ))}
      </div>
    </motion.div>
  );
};
