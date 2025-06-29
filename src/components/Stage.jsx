import React, { useRef, useState, useEffect } from "react";

const Stage = ({
  object1Blocks,
  object2Blocks,
  heroMode,
  onSwapBlocks,
  triggerPlay,
}) => {
  const stageRef = useRef(null);
  const [obj1Pos, setObj1Pos] = useState({
    x: 50,
    y: 50,
    angle: 0,
    bubble: null,
  });
  const [obj2Pos, setObj2Pos] = useState({
    x: 200,
    y: 50,
    angle: 0,
    bubble: null,
  });
  const [heroHit, setHeroHit] = useState(false);
  const SPRITE_SIZE = 60;
  const [stageBounds, setStageBounds] = useState({ width: 300, height: 300 });

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    if (stageRef.current) {
      const bounds = stageRef.current.getBoundingClientRect();
      setStageBounds({ width: bounds.width, height: bounds.height });
    }
  }, []);

  const moveSprite = async (blocks, setPosition, startPos, isObj1) => {
    let pos = { ...startPos };

    const executeBlocks = async (blockList) => {
      for (const block of blockList) {
        const prevPos = { ...pos };

        switch (block.type) {
          case "move":
            const steps = parseInt(block.value || 10);
            const angleRad = (pos.angle * Math.PI) / 180;
            const dx = Math.round(Math.cos(angleRad) * steps);
            const dy = Math.round(Math.sin(angleRad) * steps);
            const nextX = pos.x + dx;
            const nextY = pos.y + dy;
            const maxX = stageBounds.width - SPRITE_SIZE;
            const maxY = stageBounds.height - SPRITE_SIZE;

            if (nextX < 0 || nextX > maxX || nextY < 0 || nextY > maxY) {
              pos.angle = (pos.angle + 180) % 360;
            } else {
              pos.x = nextX;
              pos.y = nextY;
            }
            break;

          case "goto":
            pos.x = parseInt(block.value?.x || 0);
            pos.y = parseInt(block.value?.y || 0);
            break;

          case "turn":
            pos.angle = (pos.angle + parseInt(block.value || 15)) % 360;
            break;

          case "bounce":
            const bounceSteps = parseInt(block.value || 10);
            const bounceRad = (pos.angle * Math.PI) / 180;
            pos.x += Math.round(Math.cos(bounceRad) * bounceSteps);
            pos.y += Math.round(Math.sin(bounceRad) * bounceSteps);
            setPosition({ ...pos });
            await delay(500);
            pos.x -= Math.round(Math.cos(bounceRad) * bounceSteps);
            pos.y -= Math.round(Math.sin(bounceRad) * bounceSteps);
            break;

          case "say":
          case "think":
            const { message = "Hello", duration = 2 } = block.value || {};
            pos.bubble = { text: message, type: block.type };
            setPosition({ ...pos });
            await delay(duration * 1000);
            pos.bubble = null;
            break;

          case "repeat":
            const times = parseInt(block.value || 1);
            const subBlocks = block.subBlocks || [];
            for (let i = 0; i < times; i++) {
              await executeBlocks(subBlocks);
            }
            break;
        }

        if (
          pos.x < 0 ||
          pos.y < 0 ||
          pos.x > stageBounds.width - SPRITE_SIZE ||
          pos.y > stageBounds.height - SPRITE_SIZE
        ) {
          pos = { ...prevPos };
        }

        setPosition({ ...pos });
        await delay(500);

        if (heroMode) {
          const otherPos = isObj1 ? obj2Pos : obj1Pos;
          const collided =
            Math.abs(pos.x - otherPos.x) < SPRITE_SIZE &&
            Math.abs(pos.y - otherPos.y) < SPRITE_SIZE;

          if (collided) {
            setHeroHit(true);
            setTimeout(() => setHeroHit(false), 1000);
            setObj1Pos((prev) => ({
              ...prev,
              bubble: { text: "Ouch!", type: "say" },
            }));
            setObj2Pos((prev) => ({
              ...prev,
              bubble: { text: "Oops!", type: "say" },
            }));
            setTimeout(() => {
              setObj1Pos((prev) => ({ ...prev, bubble: null }));
              setObj2Pos((prev) => ({ ...prev, bubble: null }));
            }, 1500);
            onSwapBlocks();
            return;
          }
        }
      }
    };

    await executeBlocks(blocks);
    pos.bubble = null;
    setPosition({ ...pos });
  };

  useEffect(() => {
    if (triggerPlay) {
      moveSprite(object1Blocks, setObj1Pos, obj1Pos, true);
      moveSprite(object2Blocks, setObj2Pos, obj2Pos, false);
    }
  }, [triggerPlay]);

  const renderBubble = (bubble, x, y) => {
    if (!bubble) return null;
    return (
      <div
        className={`absolute px-3 py-2 text-sm font-medium rounded-lg shadow-lg z-10 ${
          bubble.type === "say"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
        style={{
          left: x + 50,
          top: y - 10,
          whiteSpace: "nowrap",
        }}
      >
        {bubble.text}
        <div
          className={`absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            bubble.type === "say" ? "border-t-blue-500" : "border-t-gray-200"
          }`}
        />
      </div>
    );
  };

  const handleDrag = (e, setPosition) => {
    const stageRect = stageRef.current.getBoundingClientRect();
    const newX = e.clientX - stageRect.left - SPRITE_SIZE / 2;
    const newY = e.clientY - stageRect.top - SPRITE_SIZE / 2;
    if (
      newX >= 0 &&
      newY >= 0 &&
      newX <= stageBounds.width - SPRITE_SIZE &&
      newY <= stageBounds.height - SPRITE_SIZE
    ) {
      setPosition((pos) => ({ ...pos, x: newX, y: newY }));
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sprite Playground
        </h3>
        {heroMode && (
          <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
            ⚡ Hero Mode
          </span>
        )}
      </div>

      <div
        ref={stageRef}
        className="relative w-full h-80 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-200 overflow-hidden shadow-inner"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(173, 216, 230, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 224, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Monkey */}
        <img
          src="/monkey.png"
          alt="Monkey"
          className={`absolute w-12 h-12 transition-all duration-500 cursor-move ${
            heroHit ? "animate-pulse" : ""
          }`}
          style={{
            transform: `translate(${obj1Pos.x}px, ${obj1Pos.y}px) rotate(${obj1Pos.angle}deg)`,
          }}
          draggable
          onDrag={(e) => handleDrag(e, setObj1Pos)}
        />
        {renderBubble(obj1Pos.bubble, obj1Pos.x, obj1Pos.y)}

        {/* Banana */}
        <img
          src="/banana.png"
          alt="Banana"
          className={`absolute w-12 h-12 transition-all duration-500 cursor-move ${
            heroHit ? "animate-pulse" : ""
          }`}
          style={{
            transform: `translate(${obj2Pos.x}px, ${obj2Pos.y}px) rotate(${obj2Pos.angle}deg)`,
          }}
          draggable
          onDrag={(e) => handleDrag(e, setObj2Pos)}
        />
        {renderBubble(obj2Pos.bubble, obj2Pos.x, obj2Pos.y)}

        {/* Collision Effect */}
        {heroHit && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500 text-white font-bold text-2xl px-4 py-2 rounded-lg shadow-lg animate-bounce">
               BOOM!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stage;
