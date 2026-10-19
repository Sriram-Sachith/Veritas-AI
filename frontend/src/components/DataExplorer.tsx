import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function DataExplorer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const distributionData = [
    { range: '0-20', count: 45 },
    { range: '20-40', count: 78 },
    { range: '40-60', count: 92 },
    { range: '60-80', count: 65 },
    { range: '80-100', count: 38 },
  ];

  const correlationData = [
    { x: 25, y: 65, size: 200 },
    { x: 35, y: 72, size: 220 },
    { x: 45, y: 78, size: 240 },
    { x: 55, y: 85, size: 260 },
    { x: 65, y: 88, size: 280 },
    { x: 75, y: 92, size: 300 },
    { x: 85, y: 95, size: 320 },
  ];

  const dataQuality = [
    { name: 'Complete', value: 94 },
    { name: 'Missing', value: 4 },
    { name: 'Duplicates', value: 2 },
  ];

  const sampleDataRows = [
    { id: 1, feature1: 23.4, feature2: 'A', feature3: 0.78, feature4: 'Active' },
    { id: 2, feature1: 34.2, feature2: 'B', feature3: 0.82, feature4: 'Active' },
    { id: 3, feature1: 45.1, feature2: 'A', feature3: 0.65, feature4: 'Inactive' },
    { id: 4, feature1: 56.3, feature2: 'C', feature3: 0.91, feature4: 'Active' },
    { id: 5, feature1: 67.8, feature2: 'B', feature3: 0.75, feature4: 'Active' },
  ];

  const columns = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'feature1', label: 'Feature 1', type: 'number' },
    { key: 'feature2', label: 'Feature 2', type: 'string' },
    { key: 'feature3', label: 'Feature 3', type: 'number' },
    { key: 'feature4', label: 'Feature 4', type: 'string' },
  ];

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const csv = [
        columns.map(c => c.label).join(','),
        ...sampleDataRows.map(row => 
          columns.map(c => row[c.key as keyof typeof row]).join(',')
        ),
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-explorer-export.csv';
      a.click();
    } else {
      const json = JSON.stringify(sampleDataRows, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-explorer-export.json';
      a.click();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dataset Explorer</h1>
          <p className="text-gray-400">
            Explore dataset distributions, relationships, and data quality issues
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'quality', label: 'Data Quality', icon: '✓' },
            { id: 'distributions', label: 'Distributions', icon: '📈' },
            { id: 'relationships', label: 'Relationships', icon: '🔗' },
            { id: 'data', label: 'Data Preview', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Rows', value: '10,000', icon: '📊' },
                { label: 'Total Columns', value: '42', icon: '📐' },
                { label: 'Missing Values', value: '1.2%', icon: '❌' },
                { label: 'Duplicates', value: '0.3%', icon: '🔄' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Data Quality Tab */}
          {activeTab === 'quality' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Data Quality Report</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quality Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Completeness', score: 94 },
                      { metric: 'Validity', score: 97 },
                      { metric: 'Consistency', score: 91 },
                      { metric: 'Uniqueness', score: 96 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300 text-sm">{item.metric}</span>
                          <span className="text-white font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Data Composition</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dataQuality}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis stroke="#9ca3af" dataKey="name" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Distributions Tab */}
          {activeTab === 'distributions' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Feature Distributions</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis stroke="#9ca3af" dataKey="range" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Relationships Tab */}
          {activeTab === 'relationships' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Feature Correlations</h2>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" name="Feature 1" dataKey="x" />
                  <YAxis type="number" stroke="#9ca3af" name="Feature 2" dataKey="y" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter
                    name="Correlation"
                    data={correlationData}
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Data Preview Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Search and Export */}
              <div className="flex gap-4 justify-between items-center">
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    📥 CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    📥 JSON
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900 border-b border-gray-700">
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            onClick={() => handleSort(col.key)}
                            className="px-6 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {col.label}
                              {sortConfig.key === col.key && (
                                <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleDataRows.map((row, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors"
                        >
                          {columns.map((col) => (
                            <td
                              key={`${idx}-${col.key}`}
                              className="px-6 py-4 text-gray-300"
                            >
                              {col.type === 'number'
                                ? typeof row[col.key as keyof typeof row] === 'number'
                                  ? (row[col.key as keyof typeof row] as number).toFixed(2)
                                  : row[col.key as keyof typeof row]
                                : row[col.key as keyof typeof row]}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Showing 5 of 10,000 rows</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    ← Previous
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
