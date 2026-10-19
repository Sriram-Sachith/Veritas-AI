import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useApp } from '../context/AppContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { datasets, experiments, setLoading, loading } = useApp();
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalExperiments: 0,
    completedRuns: 0,
    accuracyImprovement: 0,
  });

  // Chart data
  const [performanceData] = useState([
    { name: 'Run 1', baseline: 0.82, verified: 0.85, improvement: 3 },
    { name: 'Run 2', baseline: 0.78, verified: 0.84, improvement: 6 },
    { name: 'Run 3', baseline: 0.80, verified: 0.87, improvement: 7 },
    { name: 'Run 4', baseline: 0.85, verified: 0.89, improvement: 4 },
    { name: 'Run 5', baseline: 0.88, verified: 0.91, improvement: 3 },
  ]);

  const [modelAccuracyData] = useState([
    { name: 'RandomForest', value: 0.89, color: '#3b82f6' },
    { name: 'LogisticRegression', value: 0.82, color: '#8b5cf6' },
    { name: 'SVM', value: 0.85, color: '#ec4899' },
    { name: 'KNN', value: 0.78, color: '#f59e0b' },
  ]);

  const [verificationMetrics] = useState([
    { metric: 'Schema Integrity', passed: 95, failed: 5 },
    { metric: 'Data Splitting', passed: 98, failed: 2 },
    { metric: 'Metric Correctness', passed: 92, failed: 8 },
    { metric: 'Reproducibility', passed: 90, failed: 10 },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const datasetsResult = await apiClient.getDatasets();
      if (datasetsResult.data) {
        setStats((prev) => ({
          ...prev,
          totalDatasets: datasetsResult.data.length,
        }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statCards = [
    {
      title: 'Total Datasets',
      value: datasets.length,
      icon: '📊',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Experiments',
      value: experiments.length,
      icon: '🔬',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Completed Runs',
      value: stats.completedRuns,
      icon: '✅',
      color: 'from-green-600 to-green-400',
    },
    {
      title: 'Avg. Improvement',
      value: `${stats.accuracyImprovement}%`,
      icon: '📈',
      color: 'from-orange-600 to-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          DataScientist Arena
        </h1>
        <p className="text-gray-400 text-lg">
          Testing AI Reliability in Data Science Workflows
        </p>
      </motion.div>

      {/* Research Question Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-8 mb-12 backdrop-blur-sm"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
            Core Research Question
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Does independent verification substantially reduce errors in
            AI-generated data science workflows?
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-400 mb-2">Approach 1</h3>
            <p className="text-gray-300 text-sm">
              AI Baseline: Standard AI analysis without verification
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-purple-400 mb-2">Approach 2</h3>
            <p className="text-gray-300 text-sm">
              Independent Verification: Second AI system validates results
            </p>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-pink-400 mb-2">Approach 3</h3>
            <p className="text-gray-300 text-sm">
              Manual Review: Expert human verification of analysis
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {statCards.map((card) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="text-sm opacity-90 mb-1">{card.title}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
      >
        {/* Performance Improvement Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="#ef4444" strokeWidth={2} name="Baseline" />
              <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} name="Verified" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model Accuracy Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Model Accuracy Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9ca3af" dataKey="name" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {modelAccuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Verification Metrics */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Verification Pass Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verificationMetrics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="metric" type="category" stroke="#9ca3af" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Bar dataKey="passed" fill="#10b981" stackId="a" />
              <Bar dataKey="failed" fill="#ef4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Improvement Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Accuracy Improvement Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: '0-2%', value: 15, color: '#f3f4f6' },
                  { name: '2-4%', value: 35, color: '#3b82f6' },
                  { name: '4-6%', value: 30, color: '#10b981' },
                  { name: '6%+', value: 20, color: '#fbbf24' },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { color: '#f3f4f6' },
                  { color: '#3b82f6' },
                  { color: '#10b981' },
                  { color: '#fbbf24' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/dataset-upload')}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          📤 Upload Dataset
        </motion.button>
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/ai-lab')}
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          🧪 Start Experiment
        </motion.button>
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/verification-center')}
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          ✓ Verification Center
        </motion.button>
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 backdrop-blur-sm"
      >
        <motion.h3 variants={itemVariants} className="text-2xl font-bold text-white mb-6">
          🚀 Quick Start Guide
        </motion.h3>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { step: 1, title: 'Upload Data', desc: 'Add your CSV dataset' },
            {
              step: 2,
              title: 'Configure Experiment',
              desc: 'Set research question',
            },
            {
              step: 3,
              title: 'Run Analysis',
              desc: 'Execute AI workflows',
            },
            {
              step: 4,
              title: 'Compare Results',
              desc: 'View improvements',
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
              className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
            >
              <div className="text-2xl font-bold text-indigo-400 mb-2">
                {item.step}
              </div>
              <p className="font-semibold text-white mb-1">{item.title}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};
