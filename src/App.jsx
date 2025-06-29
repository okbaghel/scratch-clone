import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CodeArea from "./components/CodeArea";
import Stage from "./components/Stage";

function App() {
  const [selectedObject, setSelectedObject] = useState(1);
  const [object1Blocks, setObject1Blocks] = useState([]);
  const [object2Blocks, setObject2Blocks] = useState([]);
  const [heroMode, setHeroMode] = useState(false);
  const [triggerPlay, setTriggerPlay] = useState(false);

  const addBlock = (type, value = null, label = "") => {
    const newBlock = { type, value, label: label || type };
    if (selectedObject === 1) {
      setObject1Blocks((prev) => [...prev, newBlock]);
    } else {
      setObject2Blocks((prev) => [...prev, newBlock]);
    }
  };

  const removeBlock = (index) => {
    if (selectedObject === 1) {
      const updated = [...object1Blocks];
      updated.splice(index, 1);
      setObject1Blocks(updated);
    } else {
      const updated = [...object2Blocks];
      updated.splice(index, 1);
      setObject2Blocks(updated);
    }
  };

  const swapBlocks = () => {
    const temp = [...object1Blocks];
    setObject1Blocks(object2Blocks);
    setObject2Blocks(temp);
  };

  const handleDropBlock = (block) => {
    if (selectedObject === 1) {
      setObject1Blocks((prev) => [...prev, block]);
    } else {
      setObject2Blocks((prev) => [...prev, block]);
    }
  };

  const handlePlay = () => {
    setTriggerPlay(false);
    setTimeout(() => setTriggerPlay(true), 50); // reset and re-trigger
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Navbar
        selectedObject={selectedObject}
        onSelectObject={setSelectedObject}
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-5">
        <Sidebar onBlockAdd={addBlock} />
        <CodeArea
          blocks={selectedObject === 1 ? object1Blocks : object2Blocks}
          onRemoveBlock={removeBlock}
          onDropBlock={handleDropBlock}
        />
        <Stage
          object1Blocks={object1Blocks}
          object2Blocks={object2Blocks}
          heroMode={heroMode}
          onSwapBlocks={swapBlocks}
          triggerPlay={triggerPlay}
        />
      </div>
      {/* play and reset button code start  */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handlePlay}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition"
        >
          Play
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
        >
          Reset
        </button>

        {/*  Hero Mode Checkbox code start*/}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={heroMode}
            onChange={(e) => setHeroMode(e.target.checked)}
          />
          <span className="text-sm text-gray-100">Hero Mode</span>
        </label>
      </div>
    </div>
  );
}

export default App;
