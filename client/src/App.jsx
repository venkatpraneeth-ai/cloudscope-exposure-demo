import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const askQuestion = async (text) => {
    const query = text || input;
    if (!query) return;

    setMessages([...messages, { role: 'user', content: query }]);
    setInput("");
    
    // Workflow Visualization Steps
    setCurrentStep(1); // Receive
    setTimeout(() => setCurrentStep(2), 600); // Search
    setTimeout(() => setCurrentStep(3), 1200); // Generate

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query })
    });
    const data = await res.json();
    
    setCurrentStep(4); // Respond
    setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">CLOUDSCOPE <span className="text-white">SUPPORT</span></h1>
        <button onClick={() => setIsAdmin(!isAdmin)} className="text-slate-400 hover:text-white transition">
          {isAdmin ? "Back to Chat" : "Admin Login"}
        </button>
      </header>

      {!isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chat Panel */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[600px]">
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-4 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-800'}`}>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <div className="flex gap-2">
                <input 
                  className="bg-slate-800 border-none rounded-lg flex-1 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ask about shipping, returns..."
                  value={input} onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={() => askQuestion()} className="bg-blue-600 px-6 py-3 rounded-lg font-bold">Send</button>
              </div>
            </div>
          </div>

          {/* Workflow Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-400">AI Reasoning Path</h2>
            {[
              { id: 1, label: "Receive Question", desc: "Input captured and sanitized." },
              { id: 2, label: "Search Articles", desc: "Querying local support database." },
              { id: 3, label: "Generate Answer", desc: "Gemini AI synthesizing response." },
              { id: 4, label: "Respond", desc: "Final answer sent to customer." }
            ].map((step) => (
              <div key={step.id} className={`p-6 rounded-xl border-2 transition-all duration-500 ${
                currentStep === step.id ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-slate-800 bg-slate-900'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.id ? 'bg-blue-500' : 'bg-slate-800'
                  }`}>{step.id}</div>
                  <div>
                    <div className="font-bold">{step.label}</div>
                    <div className="text-sm text-slate-400">{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AdminPortal />
      )}
    </div>
  );
}

function AdminPortal() {
  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6">Administrator Access</h2>
      <input type="password" placeholder="Enter Admin Password" title="Hint: admin123"
        className="w-full bg-slate-800 p-4 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500" />
      <button className="w-full bg-blue-600 py-4 rounded-lg font-bold">Login to Cloudscope</button>
    </div>
  );
}

export default App;