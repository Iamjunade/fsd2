import React from 'react';
import { Lab } from '../services/labService';
import { ChevronRight, Terminal, Layers, Search, Users, Brain, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LabCardProps {
  lab: Lab;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  Terminal,
  Layers,
  Search,
  Lightbulb,
  Users,
  Brain
};

const LabCard: React.FC<LabCardProps> = ({ lab, index = 0 }) => {
  const IconComponent = iconMap[lab.iconName] || Terminal;

  return (
    <Link to={`/labs/${lab.id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 h-full flex flex-col"
      >
        <div className={`w-14 h-14 rounded-xl ${lab.bg} flex items-center justify-center ${lab.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
          <IconComponent size={24} />
        </div>
        
        <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{lab.name}</h2>
        <p className="text-sm text-slate-400 font-mono mb-6">{lab.code}</p>
        
        <div className="mt-auto flex items-center text-sm font-medium text-slate-300 group-hover:text-indigo-400 transition-colors">
          <span>View 12 Experiments</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default LabCard;
