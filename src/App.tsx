import { useState } from "react";
import HoverCard from "./components/HoverCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full p-8 text-center flex flex-col items-center justify-center min-h-screen">
      <HoverCard>
        <h2 className="text-2xl font-bold mb-4">Interactive Hover Card</h2>
        <p className="mb-4">Hover over me to see the animation effect!</p>
        <div className="p-8">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-[#1a1a1a] cursor-pointer transition-colors hover:border-[#646cff] focus:outline-none focus:ring-4"
          >
            count is {count}
          </button>
        </div>
      </HoverCard>
    </div>
  );
}

export default App;
