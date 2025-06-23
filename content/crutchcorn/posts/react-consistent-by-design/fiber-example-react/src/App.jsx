import { useState, useTransition, useMemo } from 'react';

// --- Helper Components ---

// A single item in our list.
const ListItem = ({ children }) => (
  <div className="p-2 border-b border-gray-700 text-gray-300">{children}</div>
);

// An artificially slow component to render the list.
// In a real app, this might be a complex chart or a large data grid.
const SlowList = ({ text }) => {
  // We use useMemo to only re-calculate the list when the text changes.
  const items = useMemo(() => {
    // This is an artificially expensive calculation to simulate a slow render.
    // We are creating a large list and performing some work for each item.
    let list = [];
    for (let i = 0; i < 20000; i++) {
        list.push(`Item ${i} - includes '${text}'`);
    }
    return list.filter(item => item.toLowerCase().includes(text.toLowerCase()));
  }, [text]);

  return (
    <div className="h-64 overflow-y-scroll border border-gray-600 rounded-lg bg-gray-800/50 mt-4">
      {items.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </div>
  );
};


// --- Demo Components ---

const LegacyDemo = () => {
  const [inputText, setInputText] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    // In the legacy approach, this state update causes an immediate,
    // blocking re-render of the SlowList component.
    setFilterTerm(value);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-amber-400">Legacy Mode (Blocking Render)</h3>
      <p className="text-gray-400 mt-1">
        Type quickly in the input below. You'll notice the input lags and feels "janky" because the expensive list rendering is blocking the main thread.
      </p>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type here to filter..."
        className="w-full p-2 mt-4 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <SlowList text={filterTerm} />
    </div>
  );
};

const ConcurrentDemo = () => {
  const [inputText, setInputText] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  // useTransition is the key to concurrent rendering here.
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // The input text updates immediately - this is an urgent update.
    setInputText(value);

    // We wrap the slow state update in startTransition.
    // React now knows this update is non-urgent and can be interrupted.
    startTransition(() => {
      setFilterTerm(value);
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-cyan-400">Concurrent Mode (Non-Blocking Render)</h3>
      <p className="text-gray-400 mt-1">
        Type quickly now. The input remains smooth and responsive. React prioritizes your typing over the list rendering.
      </p>
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type here to filter..."
        className="w-full p-2 mt-4 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      {/* The isPending flag from useTransition gives us a loading state for free. */}
      {isPending ? (
        <div className="text-center p-4 mt-4 text-cyan-400">Updating list...</div>
      ) : (
        <SlowList text={filterTerm} />
      )}
    </div>
  );
};


// --- Main App Component ---

export default function App() {
  const [mode, setMode] = useState('concurrent'); // Start with the better UX

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">React Rendering Demonstration</h1>
          <p className="text-gray-400 mt-2">Comparing Legacy (Blocking) vs. Concurrent (Non-Blocking) UI Updates</p>
        </header>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setMode('legacy')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${mode === 'legacy' ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Legacy Demo
          </button>
          <button
            onClick={() => setMode('concurrent')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${mode === 'concurrent' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Concurrent Demo
          </button>
        </div>

        <main className="bg-gray-800 p-6 rounded-xl shadow-2xl">
          {mode === 'legacy' ? <LegacyDemo /> : <ConcurrentDemo />}
        </main>

        <footer className="text-center mt-8 text-gray-500">
            <p>Built to demonstrate the benefits of async rendering in React 18+.</p>
        </footer>
      </div>
    </div>
  );
}
