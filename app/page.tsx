"use client";

import { useState } from "react";
import {
  LayoutDashboard, Wallet, Users, Package, Headset,
  UserCog, ShieldCheck, ChartNoAxesCombined, Bot,
  Search, Bell, Plus, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Menu, X, ChevronDown, Sparkles,
  CreditCard, ShoppingCart, TrendingUp, Clock,
  CircleCheck, CircleAlert, CalendarDays, Settings,
  LogOut, HelpCircle, Zap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Finance", icon: Wallet },
  { name: "CRM", icon: Users },
  { name: "Inventory", icon: Package },
  { name: "Customer Support", icon: Headset },
  { name: "HR & Employee", icon: UserCog },
  { name: "Security", icon: ShieldCheck },
  { name: "Analytics", icon: ChartNoAxesCombined },
  { name: "AI Assistant", icon: Bot },
];

const transactions = [
  { name: "Stripe Payment", type: "Customer payment", date: "Oct 31, 2026", amount: "+$2,450.00", status: "Completed" },
  { name: "Office Supplies", type: "Business expense", date: "Oct 30, 2026", amount: "-$380.00", status: "Completed" },
  { name: "Client Subscription", type: "Recurring revenue", date: "Oct 29, 2026", amount: "+$890.00", status: "Completed" },
  { name: "Cloud Services", type: "Software expense", date: "Oct 28, 2026", amount: "-$149.00", status: "Pending" },
];

const activities = [
  { title: "New customer registered", detail: "Alex Morgan joined your CRM", time: "10 minutes ago", icon: Users },
  { title: "Payment received", detail: "$2,450 from Stripe", time: "35 minutes ago", icon: CreditCard },
  { title: "Inventory updated", detail: "12 products restocked", time: "1 hour ago", icon: Package },
  { title: "Support ticket resolved", detail: "Ticket #1048 completed", time: "2 hours ago", icon: CircleCheck },
];

const revenue = [35, 48, 40, 65, 52, 72, 58, 85, 66, 92, 76, 100];

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: "Total Revenue", value: "$84,254", change: "+12.8%", positive: true, icon: Wallet },
    { label: "Total Customers", value: "2,420", change: "+8.2%", positive: true, icon: Users },
    { label: "Total Orders", value: "1,842", change: "+5.4%", positive: true, icon: ShoppingCart },
    { label: "Net Profit", value: "$32,480", change: "-2.4%", positive: false, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>

        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Zap size={23} fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">OneFlow <span className="text-indigo-600">OS</span></h1>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">Business ecosystem</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={21} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const selected = active === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActive(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    selected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                  {item.name === "AI Assistant" && (
                    <span className={`ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                      selected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                    }`}>AI</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} />
              <span className="text-sm font-semibold">OneFlow AI</span>
            </div>
            <p className="mb-3 text-xs leading-5 text-indigo-100">
              Make smarter business decisions with your AI-powered workspace.
            </p>
            <button
              onClick={() => setActive("AI Assistant")}
              className="w-full rounded-lg bg-white py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
            >
              Explore AI Assistant
            </button>
          </div>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
            <Settings size={18} /> Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50">
            <HelpCircle size={18} /> Help Center
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="min-h-screen lg:ml-[260px]">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold">{active}</h2>
              <p className="hidden text-xs text-slate-400 sm:block">
                Welcome back! Here's what's happening with your business.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 sm:flex">
              <CalendarDays size={15} />
              Last 30 days
              <ChevronDown size={14} />
            </button>

            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                JD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold">John Davis</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
              <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-7 lg:p-9">

          {/* Welcome */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-slate-400">Saturday, October 31, 2026</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Business Overview <span className="inline-block">👋</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Here's your business performance at a glance.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              <Plus size={17} /> Create New
            </button>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon size={21} />
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreHorizontal size={21} />
                    </button>
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-400">{stat.label}</p>
                  <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                    <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${
                      stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}>
                      {stat.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">Compared to previous month</p>
                </div>
              );
            })}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">Revenue Overview</h3>
                  <p className="mt-1 text-xs text-slate-400">Track your business revenue performance</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
                  Monthly <ChevronDown size={13} />
                </button>
              </div>

              <div className="mt-7 flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">Total Revenue</p>
                  <h3 className="mt-1 text-3xl font-bold">$84,254.00</h3>
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight size={14} /> 12.8% from last month
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">
                  2026
                </span>
              </div>

              <div className="relative mt-7 flex h-44 items-end justify-between gap-2 border-b border-slate-100 pb-0">
                {[25, 50, 75, 100].map((v) => (
                  <div key={v} className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-100" style={{ bottom: `${v}%` }}>
                    <span className="absolute -top-4 right-0 text-[9px] text-slate-300">${v}k</span>
                  </div>
                ))}
                {revenue.map((height, i) => (
                  <div key={i} className="group relative z-10 flex h-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 group-hover:bg-indigo-700 ${
                        i === 11 ? "bg-indigo-600" : "bg-indigo-100"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>

            {/* Performance card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="font-bold">Business Performance</h3>
              <p className="mt-1 text-xs text-slate-400">Monthly performance breakdown</p>

              <div className="relative mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full"
                style={{ background: "conic-gradient(#4f46e5 0% 65%, #818cf8 65% 85%, #e0e7ff 85% 100%)" }}>
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold">85%</span>
                  <span className="text-[11px] text-slate-400">Performance</span>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {[
                  ["Revenue", "65%", "#4f46e5"],
                  ["Expenses", "20%", "#818cf8"],
                  ["Other", "15%", "#e0e7ff"],
                ].map(([name, percent, color]) => (
                  <div key={name} className="flex items-center justi
