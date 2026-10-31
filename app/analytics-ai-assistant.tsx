
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Download,
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

type Tab = "analytics" | "assistant";
type Period = "7 days" | "30 days" | "90 days" | "12 months";

const revenueData: Record<Period, number[]> = {
  "7 days": [420, 580, 490, 720, 650, 850, 980],
  "30 days": [380, 520, 460, 680, 590, 760, 830, 710, 920, 880, 1050, 970],
  "90 days": [320, 410, 390, 540, 480, 620, 590, 730, 680, 850, 920, 1080],
  "12 months": [320, 420, 390, 510, 470, 620, 580, 710, 680, 820, 910, 1080],
};

const growthData: Record<Period, number[]> = {
  "7 days": [35, 42, 39, 55, 61, 68, 78],
  "30 days": [20, 28, 25, 36, 40, 44, 52, 48, 58, 63, 69, 78],
  "90 days": [12, 18, 25, 29, 36, 42, 48, 53, 59, 65, 72, 80],
  "12 months": [10, 15, 22, 27, 32, 38, 45, 50, 56, 63, 71, 80],
};

const revenueLabels: Record<Period, string[]> = {
  "7 days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30 days": ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19", "21", "23"],
  "90 days": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "12 months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const initialMessages = [
  {
    role: "assistant",
    text: "Hello! I'm your OneFlow AI business assistant. I can help you understand business performance, summarize reports, and plan daily tasks. What would you like to know?",
  },
];

function formatCurrency(value: number) {
  return "$" + value.toLocaleString("en-US");
}

function LineChart({
  data,
  labels,
  color,
}: {
  data: number[];
  labels: string[];
  color: string;
}) {
  const width = 680;
  const height = 230;
  const padding = 24;
  const max = Math.max(...data) * 1.15;
  const min = 0;

  const points = data
    .map((value, index) => {
      const x =
        padding +
        (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / (max - min)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const first = points.split(" ")[0];
  const last = points.split(" ").at(-1);
  const areaPoints = `${first} ${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Business performance line chart"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line / 3) * (height - padding * 2);
          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="currentColor"
              opacity="0.09"
              strokeDasharray="4 5"
            />
          );
        })}

        <polygon points={areaPoints} fill={color} opacity="0.10" />

        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((value, index) => {
          const x =
            padding +
            (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
          const y =
            height -
            padding -
            (value / max) * (height - padding * 2);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3.5"
              fill={color}
              stroke="white"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      <div className="mt-2 flex justify-between gap-2 px-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className="text-[10px] text-gray-500 sm:text-xs"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151923]">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} />
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10">
          <ArrowUpRight size={13} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {value}
      </h3>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default function AnalyticsAIAssistant() {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [period, setPeriod] = useState<Period>("12 months");
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const revenue = revenueData[period];
  const growth = growthData[period];

  const totalRevenue = useMemo(
    () => revenue.reduce((sum, value) => sum + value, 0),
    [revenue]
  );

  const suggestions = [
    "Summarize my business performance",
    "How can I improve my revenue?",
    "Give me a daily business task plan",
    "Explain my customer growth",
  ];

  function generateReply(question: string) {
    const q = question.toLowerCase();

    if (q.includes("revenue") || q.includes("sales")) {
      return `Your selected analytics period shows a sample revenue total of ${formatCurrency(totalRevenue)}. Review your best-performing products, customer demand, and expenses before making business decisions.`;
    }

    if (q.includes("growth") || q.includes("customer") || q.includes("user")) {
      return "Your sample user-growth chart shows an upward trend. To understand the real reason, compare new customers, returning customers, marketing activity, and customer retention.";
    }

    if (q.includes("task") || q.includes("daily") || q.includes("plan")) {
      return "Here is a suggested daily plan:\n\n1. Review new customer enquiries.\n2. Follow up with pending leads.\n3. Check sales and expenses.\n4. Review low-stock products.\n5. Prepare a short end-of-day performance report.";
    }

    if (q.includes("report") || q.includes("summarize") || q.includes("performance")) {
      return `Business performance overview:\n\n• Sample revenue total: ${formatCurrency(totalRevenue)}\n• Customer growth: the sample chart shows an upward trend.\n• Recommended focus: customer retention, expense control, and sales follow-ups.\n\nNote: These are demo figures, not connected to your actual business records.`;
    }

    return "I can help with revenue analysis, customer growth, business reports, and daily task planning. Try asking about one of these topics. This demo assistant uses sample responses; connect an AI API to enable real AI answers.";
  }

  function sendMessage(text = input) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);
    setInput("");
    setLoading(true);

    // Demo response. Replace this with a secure backend AI API call.
    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: generateReply(question) },
      ]);
      setLoading(false);
    }, 700);
  }

  function exportReport() {
    const report = [
      "ONEFLOW OS - BUSINESS PERFORMANCE REPORT",
      `Period: ${period}`,
      `Sample revenue total: ${formatCurrency(totalRevenue)}`,
      `Sample user growth value: ${growth[growth.length - 1]}`,
      "",
      "Revenue data:",
      ...revenue.map((value, index) => `${revenueLabels[period][index]}: ${value}`),
      "",
      "Note: This report uses demonstration data.",
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oneflow-business-report.txt";
    link.click();
    URL.revokeObjectURL(url);
    setReportReady(true);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900 dark:bg-[#0b0e14] dark:text-white">
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              <Activity size={16} />
              BUSINESS INTELLIGENCE
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Insights & Intelligence
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Understand your business and make smarter decisions.
            </p>
          </div>

          <button
            onClick={exportReport}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#151923] dark:hover:bg-white/5"
          >
            <Download size={17} />
            Export report
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-7 flex w-fit gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-[#151923]">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 size={17} />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "assistant"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Sparkles size={17} />
            AI Assistant
          </button>
        </div>

        {activeTab === "analytics" ? (
          <div className="space-y-6">
            {/* Period selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Business overview</h2>
                <p className="text-sm text-gray-500">
                  Key performance indicators
                </p>
              </div>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as Period)}
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm font-medium outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-[#151923]"
                >
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>12 months</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                change="+12.8%"
                icon={CircleDollarSign}
                color="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                description="Sample period revenue"
              />
              <MetricCard
                title="Total Users"
                value="8,549"
                change="+8.4%"
                icon={Users}
                color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                description="Sample user count"
              />
              <MetricCard
                title="Conversion Rate"
                value="4.86%"
                change="+2.1%"
                icon={TrendingUp}
                color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                description="Sample conversion metric"
              />
              <MetricCard
                title="Business Activity"
                value="86.5%"
                change="+5.6%"
                icon={Activity}
                color="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                description="Sample activity score"
              />
            </div>

            {/* Charts */}
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151923]">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">Revenue overview</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Revenue trend for {period}
                    </p>
                  </div>
                  <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <CircleDollarSign size={19} />
                  </span>
                </div>
                <div className="mb-3 text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <LineChart
                  data={revenue}
                  labels={revenueLabels[period]}
                  color="#6366f1"
                />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151923]">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">User growth</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Customer growth trend for {period}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Users size={19} />
                  </span>
                </div>
                <div className="mb-3 text-2xl font-bold">
                  {growth[growth.length - 1]}%
                </div>
                <LineChart
                  data={growth}
                  labels={revenueLabels[period]}
                  color="#10b981"
                />
              </div>
            </div>

            {/* Business report */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151923]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Business performance report</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    A quick summary of your business indicators
                  </p>
                </div>
                <BarChart3 className="text-indigo-500" size={22} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="text-xs text-gray-500">Revenue trend</p>
                  <p className="mt-2 flex items-center gap-1 font-semibold text-emerald-600">
                    <ArrowUpRight size={17} /> Growing
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="text-xs text-gray-500">Customer growth</p>
                  <p className="mt-2 flex items-center gap-1 font-semibold text-emerald-600">
                    <ArrowUpRight size={17} /> Positive
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                  <p className="text-xs text-gray-500">Business focus</p>
                  <p className="mt-2 flex items-center gap-1 font-semibold text-amber-600">
                    <Activity size={17} /> Retention
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  <Sparkles size={17} />
                  Insight
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Your demonstration dashboard shows positive revenue and user
                  growth trends. Track expenses and customer retention alongside
                  revenue to understand actual business performance.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("assistant")}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Ask AI to analyze this report
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_280px]">
            {/* Chat area */}
            <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#151923]">
              <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                    <Bot size={21} />
                  </div>
                  <div>
                    <h3 className="font-bold">OneFlow AI</h3>
                    <p className="text-xs text-emerald-600">
                      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                      Demo assistant available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMessages(initialMessages)}
                  title="Clear conversation"
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="h-fit rounded-lg bg-indigo-600 p-2 text-white">
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "rounded-br-sm bg-indigo-600 text-white"
                          : "rounded-bl-sm bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Bot size={17} />
                    AI is preparing a response...
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 p-4 dark:border-white/10">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 focus-within:border-indigo-500 dark:border-white/10 dark:bg-[#0e121a]">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    placeholder="Ask about your business..."
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={17} />
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-gray-400">
                  Demo AI responses. Verify important business decisions.
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#151923]">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-500" />
                  <h3 className="font-bold">Quick prompts</h3>
                </div>

                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-100 p-3 text-left text-sm text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                    >
                      <span className="flex items-center justify-between gap-2">
                        {suggestion}
                        <MessageSquare size={15} className="shrink-0" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                  <Bot size={19} />
                  AI capabilities
                </div>
                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-emerald-500" />
                    Business question answering
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-emerald-500" />
                    Report summarization
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-emerald-500" />
                    Daily task suggestions
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="shrink-0 text-emerald-500" />
                    Performance insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {reportReady && (
          <p className="mt-4 text-center text-xs text-emerald-600">
            Report export started.
          </p>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          OneFlow OS · Analytics & AI Intelligence
        </p>
      </div>
    </div>
  );
}
