import React, { useState } from 'react';
import MotionBlock from './MotionBlock';
import Block from './Block';

const Sidebar = ({ onBlockAdd }) => {
  const [motionInputs, setMotionInputs] = useState({
    move: 10,
    turn: 15,
    goto: { x: 0, y: 0 },
    bounce: 50, 
  });

  const handleMotionChange = (type, key, value) => {
    setMotionInputs((prev) => {
      if (type === 'goto') {
        return {
          ...prev,
          goto: {
            ...prev.goto,
            [key]: parseInt(value) || 0,
          },
        };
      } else {
        return {
          ...prev,
          [type]: parseInt(value) || 0,
        };
      }
    });
  };

  const getLabel = (type) => {
    switch (type) {
      case 'move':
        return `Move ${motionInputs.move} steps`;
      case 'turn':
        return `Turn ${motionInputs.turn} degrees`;
      case 'goto':
        return `Go to x: ${motionInputs.goto.x} y: ${motionInputs.goto.y}`;
      case 'bounce':
        return `Bounce back ${motionInputs.bounce} steps`;
      default:
        return '';
    }
  };

  const handleDragStart = (e, type) => {
    const value = motionInputs[type];
    const label = getLabel(type);
    const blockData = JSON.stringify({ type, value, label });
    e.dataTransfer.setData('application/reactflow', blockData);
  };

  return (
    <div className="w-full lg:w-[350px] xl:w-[380px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="p-6 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {/* Motion Blocks code start */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Motion
            </h2>
          </div>

          <div className="space-y-3">
            {['move', 'turn', 'goto', 'bounce'].map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className="cursor-grab active:cursor-grabbing transform hover:scale-105 transition-all duration-200"
              >
                <MotionBlock
                  type={type}
                  value={motionInputs[type]}
                  onChange={(key, value) => handleMotionChange(type, key, value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Looks Blocks code start */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Looks
            </h2>
          </div>

          <div className="space-y-3">
            <Block type="say" color="#8B5CF6" />
            <Block type="think" color="#8B5CF6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
