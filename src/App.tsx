import HoverCard from "./components/HoverCard";
import VirtualList from "./components/VirtualList";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <HoverCard>
          <h3 className="text-xl font-semibold mb-2">Animated Background</h3>
          <p className="text-sm opacity-90">
            This card now has floating particles, waves, and orbs animating
            behind the content.
          </p>
        </HoverCard>

        <HoverCard>
          <h3 className="text-xl font-semibold mb-2">Dynamic Effects</h3>
          <p className="text-sm opacity-90">
            Hover to see the background animations become more prominent and
            interactive.
          </p>
        </HoverCard>

        <HoverCard>
          <h3 className="text-xl font-semibold mb-2">GSAP Powered</h3>
          <p className="text-sm opacity-90">
            Smooth 60fps animations with particles, waves, and floating orbs.
          </p>
        </HoverCard>

        <HoverCard>
          <h3 className="text-xl font-semibold mb-2">Virtual List Demo</h3>
          <p className="text-sm opacity-90 mb-4">
            Efficiently rendering 1,000 live-updating records without freezing
            the UI.
          </p>
          <VirtualList />
        </HoverCard>
      </div>
    </div>
  );
};

export default App;
