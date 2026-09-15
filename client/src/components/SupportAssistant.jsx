import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  ShieldCheck
} from "lucide-react";

export default function SupportAssistant({ activeOrder, allOrders }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am Quickbite's AI Concierge. Ask me anything about our restaurant menus, our signature Hyderabadi Dum Biryani, Continental steaks and seafood, allergen options, delivery times, or order tracking!",
      workflowActivity: [
        { step: 1, title: "Receive question", description: "Assistant initialized and ready." },
        { step: 2, title: "Look up order/policy", description: "Quickbite kitchen menus & store guidelines loaded." },
        { step: 3, title: "Generate answer", description: "Context grounded with culinary knowledge & kitchen guidelines." },
        { step: 4, title: "Respond", description: "Welcome greeting delivered." }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(activeOrder ? activeOrder.id : (allOrders[0]?.id || ""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(messages[0].workflowActivity);
  const [workflowExpanded, setWorkflowExpanded] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeOrder) {
      setSelectedOrderId(activeOrder.id);
    }
  }, [activeOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    "Tell me about the Hyderabadi Dum Biryani",
    "What Continental steaks & grills do you offer?",
    "Where is my active order right now?",
    "What dietary & allergen options do you offer?",
    "What is your refund policy if food is cold?"
  ];

  const handleSendMessage = async (promptText) => {
    const query = (promptText || input).trim();
    if (!query || isProcessing) return;

    // Add user message
    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    const initialWorkflow = [
      { step: 1, title: "Receive question", description: `Input captured: "${query.slice(0, 45)}..."` },
      { step: 2, title: "Look up order/policy", description: `Searching policies and Order #${selectedOrderId || "general"} context...` },
      { step: 3, title: "Generate answer", description: "Invoking Gemini 3.6 Flash on Quickbite backend..." },
      { step: 4, title: "Respond", description: "Awaiting response synthesis..." }
    ];
    setActiveWorkflow(initialWorkflow);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          orderId: selectedOrderId || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      
      const assistantMsg = {
        role: "assistant",
        content: data.response,
        workflowActivity: data.workflowActivity || [
          { step: 1, title: "Receive question", description: "Parsed customer query." },
          { step: 2, title: "Look up order/policy", description: "Retrieved kitchen guidelines and order state." },
          { step: 3, title: "Generate answer", description: "Synthesized policy response." },
          { step: 4, title: "Respond", description: "Presented tailored answer to customer." }
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveWorkflow(assistantMsg.workflowActivity);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the Quickbite support service. Please try again.",
          workflowActivity: [
            { step: 1, title: "Receive question", description: "Captured query." },
            { step: 2, title: "Look up order/policy", description: "Backend connection issue." },
            { step: 3, title: "Generate answer", description: "Failed." },
            { step: 4, title: "Respond", description: "Delivered connection alert." }
          ]
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Info */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-serif-display">
                Quickbite AI Culinary Concierge
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-500/30">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">
              Real-time answers for dishes, allergens, cooking styles, orders & store policies
            </p>
          </div>
        </div>

        {/* Order Selector Context */}
        <div className="flex items-center gap-2 text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800">
          <span className="font-semibold text-stone-400">Order Context:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-stone-900 border border-stone-700 font-bold text-white text-xs py-1 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">None (General Inquiry)</option>
            {allOrders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                #{ord.id} ({ord.restaurantName}) - {ord.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Left Chat, Right Workflow Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Chat Window (7 Cols) */}
        <div className="lg:col-span-7 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl flex flex-col h-[650px] overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-950">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 items-start ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.role === "user"
                      ? "bg-stone-800 text-orange-400 border border-stone-700"
                      : "bg-orange-950 border border-orange-500/30 text-orange-400"
                  }`}
                >
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    m.role === "user"
                      ? "bg-orange-600 text-white rounded-tr-none shadow-md font-medium"
                      : "bg-stone-900 text-stone-200 border border-stone-800 rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.role === "assistant" && m.workflowActivity && (
                    <button
                      onClick={() => {
                        setActiveWorkflow(m.workflowActivity);
                        setWorkflowExpanded(true);
                      }}
                      className="mt-2.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer pt-1 border-t border-stone-800"
                    >
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      <span>View Reasoning Workflow</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3 items-center text-xs text-stone-400 py-2">
                <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-orange-400 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                </div>
                <span className="font-semibold text-stone-400">Quickbite AI is formulating answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2 bg-stone-900 border-t border-stone-800 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
              Ideas:
            </span>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                disabled={isProcessing}
                onClick={() => handleSendMessage(qp)}
                className="text-[11px] font-medium bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-700 px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer disabled:opacity-50"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-stone-900 border-t border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                id="support-chat-input"
                type="text"
                placeholder="Ask about Hyderabadi Dum Biryani, steaks, order status..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 placeholder:text-stone-500"
              />
              <button
                id="support-send-btn"
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Workflow Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Support Workflow Activity</span>
              </h3>
              <p className="text-xs text-stone-400">
                Receive question → Look up order/policy → Generate answer → Respond
              </p>
            </div>
            <button
              onClick={() => setWorkflowExpanded(!workflowExpanded)}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
            >
              {workflowExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {workflowExpanded && (
            <div className="space-y-4">
              {activeWorkflow?.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    step.step === 4
                      ? "bg-emerald-950/40 border-emerald-700/60 text-white"
                      : "bg-stone-950 border-stone-800 text-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        step.step === 4
                          ? "bg-emerald-600 text-white"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      {step.step}
                    </div>
                    <div className="font-bold text-xs uppercase tracking-wider text-white">
                      {step.title}
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 pl-10 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              ))}

              {/* Factual Context Box */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-300 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-orange-400">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Backend AI Grounding</span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-400">
                  Questions are processed securely through Quickbite’s Express backend via Gemini 3.6 Flash. Kitchen specifications, culinary guidelines, and customer order records are used to synthesize precise responses.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
