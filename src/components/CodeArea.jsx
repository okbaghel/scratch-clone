// CodeArea.jsx
import React, { useState } from 'react';

const CodeArea = ({ blocks, onRemoveBlock, onDropBlock }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = e.dataTransfer.getData('application/reactflow');
    if (data) {
      const block = JSON.parse(data);
      onDropBlock(block);
    }
  };

  const getBlockIcon = (type) => {
    const icons = {
      move: '→',
      turn: '↻',
      goto: '⌖',
      repeat: '⟲',
      say: '💬',
      think: '💭'
    };
    return icons[type] || '■';
  };

  const getBlockColor = (type) => {
    const colors = {
      move: 'bg-blue-500',
      turn: 'bg-green-500',
      goto: 'bg-purple-500',
      repeat: 'bg-orange-500',
      say: 'bg-pink-500',
      think: 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="bg-white lg:w-[40vw] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Code Workspace
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {blocks.length === 0 
                ? 'Drag blocks here to start coding' 
                : `${blocks.length} block${blocks.length !== 1 ? 's' : ''} ready`
              }
            </p>
          </div>
          {blocks.length > 0 && (
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ready
            </div>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 min-h-[400px] transition-colors duration-200 ${
          isDragOver
            ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600'
            : 'bg-transparent'
        }`}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-7">
            <div
              className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl ${
                isDragOver
                  ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              } transition-all duration-200`}
            >
              {isDragOver ? '↓' : '{ }'}
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragOver ? 'Drop here!' : 'Drop blocks'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              {isDragOver
                ? 'Release to add the block to your sprit'
                : 'Drag blocks from the sidebar to build your task sequence'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div key={index} className="flex items-center group">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </div>
                <div
                  className={`flex-1 flex items-center justify-between p-3 rounded-lg ${getBlockColor(
                    block.type
                  )} text-white shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">
                      {getBlockIcon(block.type)}
                    </span>
                    <span className="font-medium">{block.label}</span>
                  </div>
                  <button
                    onClick={() => onRemoveBlock(index)}
                    className="w-12 h-5 rounded bg-black/20 hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none"
                    title="Remove block"
                  >
                    <span className="text-sm">×</span>
                  </button>
                </div>
                {index < blocks.length - 1 && (
                  <div className="flex-shrink-0 w-8 flex justify-center py-2">
                    <div className="w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                )}
              </div>
            ))}
         
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeArea;
