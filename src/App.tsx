import HoverCard from "./components/HoverCard";
import VirtualList from "./components/VirtualList";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <HoverCard>
        <h3 className="text-xl font-semibold mb-2">Virtual List Demo</h3>
        <p className="text-sm opacity-90 mb-4">
          Efficiently rendering 1,000 live-updating records without freezing the
          UI.
        </p>
        <VirtualList />
      </HoverCard>
    </div>
  );
};

export default App;
