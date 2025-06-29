// Block.jsx
import React, { useState } from 'react';

const Block = ({ type, color = '#808080' }) => {
  const [value, setValue] = useState(() => {
    if (type === 'goto') return { x: 0, y: 0 };
    if (type === 'say' || type === 'think') return { message: 'Hello', duration: 2 };
    return 10;
  });

  const handleChange = (e, key) => {
    const val = key === 'message' ? e.target.value : parseInt(e.target.value) || 0;
    if (type === 'goto' || type === 'say' || type === 'think') {
      setValue({ ...value, [key]: val });
    } else {
      setValue(val);
    }
  };

  const getLabel = () => {
    if (type === 'move') return `Move ${value} steps`;
    if (type === 'turn') return `Turn ${value}°`;
    if (type === 'goto') return `Go to x: ${value.x} y: ${value.y}`;
    if (type === 'repeat') return `Repeat ${value} times`;
    if (type === 'say') return `Say "${value.message}" for ${value.duration} seconds`;
    if (type === 'think') return `Think "${value.message}" for ${value.duration} seconds`;
    return '';
  };

  return (
    <div
      className="p-2 rounded-md shadow-md text-white mb-2 select-none text-sm sm:text-base w-full cursor-move"
      style={{ backgroundColor: color }}
      draggable
      onDragStart={(e) => {
        const label = getLabel();
        e.dataTransfer.setData(
          'application/reactflow',
          JSON.stringify({ type, value, label })
        );
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="capitalize">{type}</span>

        {type === 'goto' && (
          <>
            <span>x:</span>
            <input
              type="number"
              value={value.x}
              onChange={(e) => handleChange(e, 'x')}
              className="w-12 text-black px-1 rounded"
            />
            <span>y:</span>
            <input
              type="number"
              value={value.y}
              onChange={(e) => handleChange(e, 'y')}
              className="w-12 text-black px-1 rounded"
            />
          </>
        )}

        {(type === 'say' || type === 'think') && (
          <>
            <input
              type="text"
              value={value.message}
              onChange={(e) => handleChange(e, 'message')}
              placeholder="message"
              className="w-24 text-black px-1 rounded"
            />
            <input
              type="number"
              value={value.duration}
              onChange={(e) => handleChange(e, 'duration')}
              className="w-14 text-black px-1 rounded"
            />
            <span>s</span>
          </>
        )}

        {type !== 'goto' && type !== 'say' && type !== 'think' && (
          <>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(e)}
              className="w-16 text-black px-1 rounded"
            />
            <span>
              {type === 'move' ? 'steps' : type === 'turn' ? '°' : 'times'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Block;
