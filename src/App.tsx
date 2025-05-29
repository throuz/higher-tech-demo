import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import HoverCard from "./components/HoverCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full p-8 text-center flex flex-col items-center justify-center min-h-screen">
      <div>
        <a href="https://vite.dev" target="_blank" className="inline-block">
          <img
            src={viteLogo}
            className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" className="inline-block">
          <img
            src={reactLogo}
            className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-5xl font-bold leading-tight mb-8">Vite + React</h1>

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

      <p className="text-[#888] mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
