// MotionBlock.jsx
import React from 'react';

const MotionBlock = ({ type, value, onChange }) => {
  const getBlockConfig = (type) => {
    const configs = {
      move: {
        label: 'Move',
        icon: '🏃',
        color: 'from-emerald-500 to-emerald-600',
        unit: 'steps'
      },
      turn: {
        label: 'Turn',
        icon: '🔄',
        color: 'from-blue-500 to-blue-600',
        unit: 'degrees'
      },
      goto: {
        label: 'Go to',
        icon: '🎯',
        color: 'from-purple-500 to-purple-600',
        unit: ''
      },
      repeat: {
        label: 'BounceBack',
        icon: '🔁',
        color: 'from-orange-500 to-orange-600',
        unit: 'times'
      }
    };
    return configs[type] || configs.move;
  };

  const config = getBlockConfig(type);

  return (
    <div className={`
      relative p-4 rounded-xl shadow-lg hover:shadow-xl 
      bg-gradient-to-r ${config.color} 
      text-white font-medium
      transform transition-all duration-200 ease-out
      hover:-translate-y-1 hover:shadow-2xl
      border border-white/20
      backdrop-blur-sm
    `}>
     
      <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
      
      <div className="relative z-10">
        {type === 'goto' ? (
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.icon}</span>
              <span className="font-semibold text-sm sm:text-base">{config.label}</span>
            </div>
            
            {/*  inputs */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium opacity-90">X:</label>
                <input
                  type="number"
                  value={value?.x || 0}
                  onChange={(e) => onChange('x', e.target.value)}
                  className="w-16 h-8 text-slate-800 text-sm font-medium bg-white/95 border border-white/30 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium opacity-90">Y:</label>
                <input
                  type="number"
                  value={value?.y || 0}
                  onChange={(e) => onChange('y', e.target.value)}
                  className="w-16 h-8 text-slate-800 text-sm font-medium bg-white/95 border border-white/30 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Icon and Label */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg">{config.icon}</span>
              <span className="font-semibold text-sm sm:text-base">{config.label}</span>
            </div>
            
            {/* Right side - Input and Unit */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={value || 0}
                onChange={(e) => onChange(null, e.target.value)}
                className="w-16 h-8 text-slate-800 text-sm font-medium bg-white/95 border border-white/30 rounded-lg px-2 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                placeholder="0"
              />
              {config.unit && (
                <span className="text-xs font-medium opacity-90 whitespace-nowrap">
                  {config.unit}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionBlock;