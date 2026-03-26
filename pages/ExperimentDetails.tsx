import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExperiment, Experiment } from '../services/experimentService';
import { getContributionsByExperiment, addContribution, upvoteContribution, deleteContribution, updateContribution, Contribution } from '../services/contributionService';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, FileText, MessageSquare, Code, Image as ImageIcon, ThumbsUp, Plus, X, Trash2, Hammer, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'contributions', label: 'Community Contributions' }
];

export const ExperimentDetails: React.FC = () => {
  const { labId, experimentId } = useParams<{ labId: string, experimentId: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionContent, setContributionContent] = useState('');
  const [contributionType, setContributionType] = useState<'note' | 'solution' | 'code' | 'diagram' | 'comment'>('note');

  const [editingContributionId, setEditingContributionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editType, setEditType] = useState<'note' | 'solution' | 'code' | 'diagram' | 'comment'>('note');

  useEffect(() => {
    const fetchExperimentData = async () => {
      if (!experimentId) return;
      try {
        const exp = await getExperiment(experimentId);
        setExperiment(exp);
        const contribs = await getContributionsByExperiment(experimentId);
        setContributions(contribs);
      } catch (error) {
        console.error('Error fetching experiment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperimentData();
  }, [experimentId]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experimentId || !contributionContent.trim()) return;

    try {
      const newContrib = await addContribution({
        experimentId,
        userId: user?.uid || 'anonymous-' + Math.random().toString(36).substring(2, 15),
        username: profile?.username || 'Anonymous Student',
        content: contributionContent,
        type: contributionType
      });
      setContributions([newContrib, ...contributions]);
      setShowContributeModal(false);
      setContributionContent('');
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  const handleUpvote = async (contributionId: string, authorId: string) => {
    if (!user) {
      alert("Please sign in to upvote.");
      return;
    }
    if (user.uid === authorId) {
      alert("You cannot upvote your own contribution.");
      return;
    }
    try {
      await upvoteContribution(contributionId, user.uid, authorId);
      // Optimistically update UI
      setContributions(contributions.map(c => 
        c.id === contributionId ? { ...c, upvotes: c.upvotes + 1 } : c
      ));
    } catch (error: any) {
      if (error.message === "Already upvoted") {
        alert("You have already upvoted this contribution.");
      } else {
        console.error('Error upvoting:', error);
      }
    }
  };

  const handleDelete = async (contributionId: string) => {
    if (window.confirm('Are you sure you want to delete this contribution?')) {
      try {
        await deleteContribution(contributionId);
        setContributions(contributions.filter(c => c.id !== contributionId));
      } catch (error) {
        console.error('Error deleting contribution:', error);
      }
    }
  };

  const handleUpdate = async (contributionId: string) => {
    if (!editContent.trim()) return;
    try {
      await updateContribution(contributionId, editContent, editType);
      setContributions(contributions.map(c => 
        c.id === contributionId ? { ...c, content: editContent, type: editType } : c
      ));
      setEditingContributionId(null);
    } catch (error) {
      console.error('Error updating contribution:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!experiment) return <div className="text-center py-12">Experiment not found</div>;

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
          <Link to={`/labs/${labId}`} className="hover:text-indigo-400 transition-colors">{labId}</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-slate-200">Week {experiment.weekNumber}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{experiment.title}</h1>
            <p className="text-slate-400 font-mono">Week {experiment.weekNumber}</p>
          </div>
          <button 
            onClick={() => setShowContributeModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            <span className="font-medium hidden sm:inline">Contribute</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide mb-6 border-b border-slate-700/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 md:p-8 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <section>
              <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center">
                <FileText size={20} className="mr-2" /> Aim
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300">
                <ReactMarkdown>{experiment.aim}</ReactMarkdown>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center">
                <BookOpen size={20} className="mr-2" /> Theory
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300">
                <ReactMarkdown>{experiment.theory}</ReactMarkdown>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4 text-indigo-400 flex items-center">
                <Hammer size={20} className="mr-2" /> Materials Required
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300">
                <ReactMarkdown>{experiment.materials}</ReactMarkdown>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-indigo-400">Community Contributions</h2>
              <span className="text-sm text-slate-400">{contributions.length} contributions</span>
            </div>

            {contributions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No contributions yet. Be the first to share your notes or solutions!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map(contrib => (
                  <div key={contrib.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {contrib.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-200">{contrib.username}</p>
                          <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(contrib.createdAt))} ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-slate-700 text-slate-300 uppercase tracking-wider">
                          {contrib.type}
                        </span>
                        <button 
                          onClick={() => handleUpvote(contrib.id, contrib.userId)}
                          className="flex items-center space-x-1 text-slate-400 hover:text-indigo-400 transition-colors bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700"
                        >
                          <ThumbsUp size={14} />
                          <span className="text-xs font-medium">{contrib.upvotes}</span>
                        </button>
                        {user && (user.uid === contrib.userId || profile?.role === 'admin') && (
                          <>
                            {user.uid === contrib.userId && (
                              <button 
                                onClick={() => {
                                  setEditingContributionId(contrib.id);
                                  setEditContent(contrib.content);
                                  setEditType(contrib.type);
                                }}
                                className="flex items-center space-x-1 text-slate-400 hover:text-blue-400 transition-colors bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(contrib.id)}
                              className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingContributionId === contrib.id ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {['note', 'solution', 'code', 'diagram', 'comment'].map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setEditType(type as any)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                                  editType === type 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                            placeholder="Edit your contribution here..."
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingContributionId(null)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(contrib.id)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-sm text-slate-300">
                        <ReactMarkdown>{contrib.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contribute Modal */}
      <AnimatePresence>
        {showContributeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add Contribution</h2>
                <button onClick={() => setShowContributeModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleContribute} className="space-y-4">
                {!user && (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4">
                    <p className="text-sm text-indigo-300">
                      You are contributing anonymously. <button type="button" onClick={() => {/* trigger login if needed */}} className="underline font-medium">Sign in</button> to track your contributions and earn points!
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Contribution Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['note', 'solution', 'code', 'diagram', 'comment'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setContributionType(type as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          contributionType === type 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Content (Markdown supported)</label>
                  <textarea
                    value={contributionContent}
                    onChange={(e) => setContributionContent(e.target.value)}
                    className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                    placeholder="Write your contribution here..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowContributeModal(false)}
                    className="px-6 py-2 rounded-xl font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!contributionContent.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    Post Contribution
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper component for icons
function BookOpen(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
