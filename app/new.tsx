"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  DollarSign,
  X,
} from "lucide-react";

type Tab = "Finance" | "CRM" | "Inventory";
type Transaction = {
  id: number;
  title: string;
  type: "Income" | "Expense";
  amount: number;
  date: string;
  category: string;
};
type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  value: number;
  stage: string;
};
type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
};

const stages = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const initialTransactions: Transaction[] = [
  { id: 1, title: "Website Development", type: "Income", amount: 2500, date: "2026-10-28", category: "Sales" },
  { id: 2, title: "Office Supplies", type: "Expense", amount: 350, date: "2026-10-27", category: "Operations" },
  { id: 3, title: "Monthly Subscription", type: "Income", amount: 1200, date: "2026-10-26", category: "Subscription" },
  { id: 4, title: "Marketing Campaign", type: "Expense", amount: 600, date: "2026-10-25", category: "Marketing" },
];

const initialLeads: Lead[] = [
  { id: 1, name: "Alex Morgan", company: "Vertex Labs", email: "alex@example.com", value: 5000, stage: "Qualified" },
  { id: 2, name: "Sarah Chen", company: "Nova Tech", email: "sarah@example.com", value: 3200, stage: "Proposal" },
  { id: 3, name: "James Wilson", company: "Cloudify", email: "james@example.com", value: 1800, stage: "New Lead" },
];

const initialProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", sku: "WH-001", price: 89, stock: 24, minStock: 10 },
  { id: 2, name: "Smart Watch", sku: "SW-002", price: 149, stock: 6, minStock: 10 },
  { id: 3, name: "USB-C Hub", sku: "UH-003", price: 39, stock: 42, minStock: 8 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function OneFlowOSNew() {
  const [activeTab, setActiveTab] = useState<Tab>("Finance");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [leads, setLeads] = useState(initialLeads);
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    title: "",
    type: "Income" as "Income" | "Expense",
    amount: "",
    category: "",
  });

  const [leadForm, setLeadForm] = useState({
    name: "",
    company: "",
    email: "",
    value: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    minStock: "10",
  });

  // Finance calculations
  const totalIncome = useMemo(
    () => transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () => transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const netProfit = totalIncome - totalExpenses;

  // CRM calculations
  const pipelineValue = leads
    .filter(l => !["Won", "Lost"].includes(l.stage))
    .reduce((sum, l) => sum + l.value, 0);

  const wonValue = leads
    .filter(l => l.stage === "Won")
    .reduce((sum, l) => sum + l.value, 0);

  // Inventory calculations
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const filteredTransactions = transactions.filter(t =>
    `${t.title} ${t.category} ${t.type}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLeads = leads.filter(l =>
    `${l.name} ${l.company} ${l.email} ${l.stage}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())
  );

  function addTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amount = Number(transactionForm.amount);
    if (!transactionForm.title.trim() || !transactionForm.category.trim() || amount <= 0) return;

    setTransactions(prev => [
      {
        id: Date.now(),
        title: transactionForm.title.trim(),
        type: transactionForm.type,
        amount,
        date: new Date().toISOString().slice(0, 10),
        category: transactionForm.category.trim(),
      },
      ...prev,
    ]);

    setTransactionForm({ title: "", type: "Income", amount: "", category: "" });
    setShowTransactionForm(false);
  }

  function addLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = Number(leadForm.value);
    if (!leadForm.name.trim() || !leadForm.company.trim() || value < 0) return;

    setLeads(prev => [
      {
        id: Date.now(),
        name: leadForm.name.trim(),
        company: leadForm.company.trim(),
        email: leadForm.email.trim(),
        value,
        stage: "New Lead",
      },
      ...prev,
    ]);

    setLeadForm({ name: "", company: "", email: "", value: "" });
    setShowLeadForm(false);
  }

  function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    const minStock = Number(productForm.minStock);

    if (
      !productForm.name.trim() ||
      !productForm.sku.trim() ||
      price < 0 ||
      stock < 0 ||
      minStock < 0
    ) return;

    const skuExists = products.some(
      p => p.sku.toLowerCase() === productForm.sku.trim().toLowerCase()
    );

    if (skuExists) {
      alert("This SKU already exists. Please use a unique SKU.");
      return;
    }

    setProducts(prev => [
      {
        id: Date.now(),
        name: productForm.name.trim(),
        sku: productForm.sku.trim(),
        price,
        stock,
        minStock,
      },
      ...prev,
    ]);

    setProductForm({ name: "", sku: "", price: "", stock: "", minStock: "10" });
    setShowProductForm(false);
  }

  function updateLeadStage(id: number, stage: string) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
  }

  function updateStock(id: number, amount: number) {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
      )
    );
  }

  function deleteTransaction(id: number) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function deleteLead(id: number) {
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  function deleteProduct(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  const tabs: { name: Tab; icon: typeof Wallet }[] = [
    { name: "Finance", icon: Wallet },
    { name: "CRM", icon: Users },
    { name: "Inventory", icon: Package },
  ];

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <div className="mx-auto max-w-[1500px] p-4 md:p-8">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <TrendingUp size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight">OneFlow OS</span>
            </div>
            <p className="text-sm text-slate-400">
              Business operations and management
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-slate-300">Workspace active</span>
          </div>
        </header>

        {/* Navigation */}
        <nav className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActiveTab(name);
                setSearch("");
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition ${
                activeTab === name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
        </nav>

        {/* Page title and search */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{activeTab} Management</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your business {activeTab.toLowerCase()} in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
            <Search size={17} className="text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-500 sm:w-52"
            />
          </div>
        </div>

        {/* ================= FINANCE ================= */}
        {activeTab === "Finance" && (
          <section>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total Income" value={money(totalIncome)} icon={<TrendingUp />} color="emerald" />
              <MetricCard title="Total Expenses" value={money(totalExpenses)} icon={<TrendingDown />} color="rose" />
              <MetricCard title="Net Profit" value={money(netProfit)} icon={<DollarSign />} color="blue" />
              <MetricCard title="Transactions" value={String(transactions.length)} icon={<Wallet />} color="violet" />
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Transactions</h2>
                <p className="text-sm text-slate-400">Track your income and expenses.</p>
              </div>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500"
              >
                <Plus size={17} /> Add Transaction
              </button>
            </div>

            {showTransactionForm && (
              <Modal title="Add transaction" onClose={() => setShowTransactionForm(false)}>
                <form onSubmit={addTransaction} className="grid gap-3">
                  <input required placeholder="Transaction title" value={transactionForm.title}
                    onChange={e => setTransactionForm({ ...transactionForm, title: e.target.value })} className="field" />
                  <select value={transactionForm.type}
                    onChange={e => setTransactionForm({ ...transactionForm, type: e.target.value as "Income" | "Expense" })} className="field">
                    <option>Income</option>
                    <option>Expense</option>
                  </select>
                  <input required type="number" min="0.01" step="0.01" placeholder="Amount ($)" value={transactionForm.amount}
                    onChange={e => setTransactionForm({ ...transactionForm, amount: e.target.value })} className="field" />
                  <input required placeholder="Category" value={transactionForm.category}
                    onChange={e => setTransactionForm({ ...transactionForm, category: e.target.value })} className="field" />
                  <button className="rounded-xl bg-blue-600 p-3 font-semibold hover:bg-blue-500">Save transaction</button>
                </form>
              </Modal>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                    <tr>
                      <th className="p-4">Transaction</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/40">
                        <td className="p-4 font-medium">{t.title}</td>
                        <td className="p-4 text-slate-400">{t.category}</td>
                        <td className="p-4 text-slate-400">{t.date}</td>
                        <td className="p-4">
                          <span className={`rounded-full px-3 py-1 text-xs ${t.type === "Income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`p-4 font-semibold ${t.type === "Income" ? "text-emerald-400" : "text-rose-400"}`}>
                          {t.type === "Income" ? "+" : "-"}{money(t.amount)}
                        </td>
                        <td className="p-4">
                          <button onClick={() => deleteTransaction(t.id)} aria-label="Delete transaction" className="text-slate-500 hover:text-rose-400">
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTransactions.length === 0 && <EmptyState text="No transactions found." />}
              </div>
            </div>
          </section>
        )}

        {/* ================= CRM ================= */}
        {activeTab === "CRM" && (
          <section>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total Leads" value={String(leads.length)} icon={<Users />} color="blue" />
              <MetricCard title="Pipeline Value" value={money(pipelineValue)} icon={<TrendingUp />} color="violet" />
              <MetricCard title="Won Deals" value={money(wonValue)} icon={<DollarSign />} color="emerald" />
              <MetricCard title="Active Stages" value={String(leads.filter(l => !["Won", "Lost"].includes(l.stage)).length)} icon={<ArrowUpRight />} color="amber" />
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Sales Pipeline</h2>
                <p className="text-sm text-slate-400">Manage leads and move deals through your sales process.</p>
              </div>
              <button onClick={() => setShowLeadForm(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500">
                <Plus size={17} /> Add Lead
              </button>
            </div>

            {showLeadForm && (
              <Modal title="Create new lead" onClose={() => setShowLeadForm(false)}>
                <form onSubmit={addLead} className="grid gap-3">
                  <input required placeholder="Contact name" value={leadForm.name}
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className="field" />
                  <input required placeholder="Company name" value={leadForm.company}
                    onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} className="field" />
                  <input type="email" placeholder="Email address" value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} className="field" />
                  <input required type="number" min="0" placeholder="Deal value ($)" value={leadForm.value}
                    onChange={e => setLeadForm({ ...leadForm, value: e.target.value })} className="field" />
                  <button className="rounded-xl bg-blue-600 p-3 font-semibold hover:bg-blue-500">Create lead</button>
                </form>
              </Modal>
            )}

            <div className="grid gap-4 xl:grid-cols-2">
              {stages.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.stage === stage);
                const stageValue = stageLeads.reduce((sum, l) => sum + l.value, 0);

                return (
                  <div key={stage} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{stage}</h3>
                        <p className="text-xs text-slate-500">{stageLeads.length} deals</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-400">{money(stageValue)}</span>
                    </div>

                    <div className="grid gap-3">
                      {stageLeads.map(lead => (
                        <div key={lead.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{lead.name}</h4>
                              <p className="mt-1 text-sm text-slate-400">{lead.company}</p>
                              <p className="mt-1 text-xs text-slate-500">{lead.email || "No email provided"}</p>
                            </div>
                            <button onClick={() => deleteLead(lead.id)} aria-label="Delete lead" className="text-slate-500 hover:text-rose-400">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="font-semibold text-emerald-400">{money(lead.value)}</span>
                            <select value={lead.stage} onChange={e => updateLeadStage(lead.id, e.target.value)}
                              className="max-w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs outline-none focus:border-blue-500">
                              {stages.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <p className="rounded-xl border border-dashed border-slate-800 p-5 text-center text-sm text-slate-500">No deals in this stage.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= INVENTORY ================= */}
        {activeTab === "Inventory" && (
          <section>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total Products" value={String(products.length)} icon={<Package />} color="blue" />
              <MetricCard title="Total Units" value={String(totalStock)} icon={<Wallet />} color="violet" />
              <MetricCard title="Inventory Value" value={money(inventoryValue)} icon={<DollarSign />} color="emerald" />
              <MetricCard title="Low Stock Alerts" value={String(lowStockProducts.length)} icon={<AlertTriangle />} color="amber" />
            </div>

            {lowStockProducts.length > 0 && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-400" size={20} />
                <div>
                  <h3 className="font-semibold text-amber-300">Low stock alert</h3>
                  <p className="mt-1 text-sm text-amber-200/70">
                    {lowStockProducts.map(p => p.name).join(", ")} {lowStockProducts.length === 1 ? "needs" : "need"} restocking.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Product Management</h2>
                <p className="text-sm text-slate-400">Track products, prices and stock levels.</p>
              </div>
              <button onClick={() => setShowProductForm(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500">
                <Plus size={17} /> Add Product
              </button>
            </div>

            {showProductForm && (
              <Modal title="Add new product" onClose={() => setShowProductForm(false)}>
                <form onSubmit={addProduct} className="grid gap-3">
                  <input required placeholder="Product name" value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="field" />
                  <input required placeholder="Unique SKU" value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })} className="field" />
                  <input required type="number" min="0" step="0.01" placeholder="Unit price ($)" value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="field" />
                  <input required type="number" min="0" step="1" placeholder="Initial stock" value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="field" />
                  <input required type="number" min="0" step="1" placeholder="Low stock threshold" value={productForm.minStock}
                    onChange={e => setProductForm({ ...productForm, minStock: e.target.value })} className="field" />
                  <button className="rounded-xl bg-blue-600 p-3 font-semibold hover:bg-blue-500">Add product</button>
                </form>
              </Modal>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Unit Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => {
                      const isLow = product.stock <= product.minStock;

                      return (
                        <tr key={product.id} className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/40">
                          <td className="p-4 font-medium">{product.name}</td>
                          <td className="p-4 text-slate-400">{product.sku}</td>
                          <td className="p-4">{money(product.price)}</td>
                          <td className="p-4 font-semibold">{product.stock}</td>
                          <td className="p-4">
                            <span className={`rounded-full px-3 py-1 text-xs ${isLow ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                              {isLow ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateStock(product.id, -1)} disabled={product.stock === 0}
                                className="rounded-md border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-30">−</button>
                              <button onClick={() => updateStock(product.id, 1)}
                                className="rounded-md border border-slate-700 px-2 py-1 hover:bg-slate-800">+</button>
                              <button onClick={() => deleteProduct(product.id)} aria-label="Delete product" className="ml-1 text-slate-500 hover:text-rose-400">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <EmptyState text="No products found." />}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          OneFlow OS · Business Management Workspace
        </footer>
      </div>

      <style jsx global>{`
        .field {
          width: 100%;
          border: 1px solid #334155;
          border-radius: 10px;
          background: #0f172a;
          padding: 12px;
          color: white;
          outline: none;
        }
        .field:focus {
          border-color: #3b82f6;
        }
        .field::placeholder {
          color: #64748b;
        }
        .field option {
          background: #0f172a;
        }
      `}</style>
    </main>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "emerald" | "rose" | "blue" | "violet" | "amber";
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    rose: "bg-rose-500/10 text-rose-400",
    blue: "bg-blue-500/10 text-blue-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`rounded-xl p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight">{value}</h3>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111827] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="p-8 text-center text-sm text-slate-500">{text}</p>;
}
