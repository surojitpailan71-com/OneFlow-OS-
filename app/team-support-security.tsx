"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Users,
  Headset,
  ShieldCheck,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  Activity,
  Lock,
  UserCog,
  CalendarCheck,
  DollarSign,
} from "lucide-react";

type Tab = "Employees" | "Customer Support" | "Security";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  salary: number;
  attendance: "Present" | "Absent" | "On Leave";
  paid: boolean;
};

type Ticket = {
  id: number;
  subject: string;
  customer: string;
  email: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  messages: { sender: string; text: string; time: string }[];
};

type ActivityLog = {
  id: number;
  user: string;
  action: string;
  time: string;
};

const roles = ["Admin", "Manager", "HR", "Support Agent", "Employee"];

const initialEmployees: Employee[] = [
  { id: 1, name: "Alex Morgan", email: "alex@example.com", role: "Admin", salary: 5000, attendance: "Present", paid: true },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "Manager", salary: 4200, attendance: "Present", paid: false },
  { id: 3, name: "James Wilson", email: "james@example.com", role: "Support Agent", salary: 3000, attendance: "On Leave", paid: false },
  { id: 4, name: "Emma Davis", email: "emma@example.com", role: "HR", salary: 3500, attendance: "Absent", paid: true },
];

const initialTickets: Ticket[] = [
  {
    id: 1001,
    subject: "Unable to access my account",
    customer: "John Smith",
    email: "john@example.com",
    priority: "High",
    status: "Open",
    messages: [
      { sender: "Customer", text: "I cannot log into my account. Please help.", time: "09:30 AM" },
      { sender: "Support", text: "We are checking the issue.", time: "09:45 AM" },
    ],
  },
  {
    id: 1002,
    subject: "Payment confirmation",
    customer: "Olivia Brown",
    email: "olivia@example.com",
    priority: "Medium",
    status: "In Progress",
    messages: [
      { sender: "Customer", text: "I made a payment but haven't received confirmation.", time: "10:15 AM" },
    ],
  },
  {
    id: 1003,
    subject: "Product information",
    customer: "Daniel Lee",
    email: "daniel@example.com",
    priority: "Low",
    status: "Resolved",
    messages: [
      { sender: "Customer", text: "Can you provide more details about this product?", time: "Yesterday" },
      { sender: "Support", text: "Here are the product details.", time: "Yesterday" },
    ],
  },
];

const initialLogs: ActivityLog[] = [
  { id: 1, user: "Alex Morgan", action: "Logged into the workspace", time: "10:30 AM" },
  { id: 2, user: "Sarah Chen", action: "Updated employee role", time: "10:15 AM" },
  { id: 3, user: "James Wilson", action: "Updated support ticket", time: "09:45 AM" },
  { id: 4, user: "Emma Davis", action: "Viewed payroll records", time: "09:20 AM" },
];

const defaultPermissions: Record<string, Record<string, boolean>> = {
  Admin: {
    "View Dashboard": true,
    "Manage Employees": true,
    "Manage Payroll": true,
    "Manage Support": true,
    "View Security Logs": true,
    "Manage Permissions": true,
  },
  Manager: {
    "View Dashboard": true,
    "Manage Employees": true,
    "Manage Payroll": false,
    "Manage Support": true,
    "View Security Logs": true,
    "Manage Permissions": false,
  },
  HR: {
    "View Dashboard": true,
    "Manage Employees": true,
    "Manage Payroll": true,
    "Manage Support": false,
    "View Security Logs": false,
    "Manage Permissions": false,
  },
  "Support Agent": {
    "View Dashboard": true,
    "Manage Employees": false,
    "Manage Payroll": false,
    "Manage Support": true,
    "View Security Logs": false,
    "Manage Permissions": false,
  },
  Employee: {
    "View Dashboard": true,
    "Manage Employees": false,
    "Manage Payroll": false,
    "Manage Support": false,
    "View Security Logs": false,
    "Manage Permissions": false,
  },
};

const permissionNames = [
  "View Dashboard",
  "Manage Employees",
  "Manage Payroll",
  "Manage Support",
  "View Security Logs",
  "Manage Permissions",
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

function currentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeamSupportSecurity() {
  const [activeTab, setActiveTab] = useState<Tab>("Employees");
  const [search, setSearch] = useState("");

  const [employees, setEmployees] = useState(initialEmployees);
  const [tickets, setTickets] = useState(initialTickets);
  const [logs, setLogs] = useState(initialLogs);

  const [permissions, setPermissions] = useState(defaultPermissions);

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    role: "Employee",
    salary: "",
  });

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    customer: "",
    email: "",
    priority: "Medium" as Ticket["priority"],
  });

  const [selectedRole, setSelectedRole] = useState("Admin");

  // Employee calculations
  const presentCount = employees.filter(e => e.attendance === "Present").length;
  const absentCount = employees.filter(e => e.attendance === "Absent").length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const paidPayroll = employees.filter(e => e.paid).reduce((sum, e) => sum + e.salary, 0);
  const pendingPayroll = totalPayroll - paidPayroll;

  // Support calculations
  const openTickets = tickets.filter(t => t.status === "Open").length;
  const progressTickets = tickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  const filteredEmployees = useMemo(
    () => employees.filter(e =>
      `${e.name} ${e.email} ${e.role}`.toLowerCase().includes(search.toLowerCase())
    ),
    [employees, search]
  );

  const filteredTickets = useMemo(
    () => tickets.filter(t =>
      `${t.subject} ${t.customer} ${t.email} ${t.status}`.toLowerCase().includes(search.toLowerCase())
    ),
    [tickets, search]
  );

  const filteredLogs = useMemo(
    () => logs.filter(l =>
      `${l.user} ${l.action}`.toLowerCase().includes(search.toLowerCase())
    ),
    [logs, search]
  );

  function addLog(user: string, action: string) {
    setLogs(prev => [
      {
        id: Date.now() + Math.random(),
        user,
        action,
        time: currentTime(),
      },
      ...prev,
    ]);
  }

  // Employee management
  function addEmployee(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const salary = Number(employeeForm.salary);

    if (
      !employeeForm.name.trim() ||
      !employeeForm.email.trim() ||
      !Number.isFinite(salary) ||
      salary < 0
    ) return;

    if (employees.some(emp => emp.email.toLowerCase() === employeeForm.email.trim().toLowerCase())) {
      alert("An employee with this email already exists.");
      return;
    }

    setEmployees(prev => [
      {
        id: Date.now(),
        name: employeeForm.name.trim(),
        email: employeeForm.email.trim(),
        role: employeeForm.role,
        salary,
        attendance: "Present",
        paid: false,
      },
      ...prev,
    ]);

    addLog("Admin", `Added employee: ${employeeForm.name}`);
    setEmployeeForm({ name: "", email: "", role: "Employee", salary: "" });
    setShowEmployeeForm(false);
  }

  function updateEmployeeRole(id: number, role: string) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev => prev.map(e => e.id === id ? { ...e, role } : e));
    addLog("Admin", `Changed ${employee.name}'s role to ${role}`);
  }

  function updateAttendance(id: number, attendance: Employee["attendance"]) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev => prev.map(e => e.id === id ? { ...e, attendance } : e));
    addLog("Admin", `Updated attendance for ${employee.name}`);
  }

  function togglePayroll(id: number) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev =>
      prev.map(e => e.id === id ? { ...e, paid: !e.paid } : e)
    );

    addLog("Admin", `${employee.paid ? "Marked payroll pending for" : "Marked payroll paid for"} ${employee.name}`);
  }

  function deleteEmployee(id: number) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    setEmployees(prev => prev.filter(e => e.id !== id));
    addLog("Admin", `Removed employee: ${employee.name}`);
  }

  // Customer support
  function addTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!ticketForm.subject.trim() || !ticketForm.customer.trim() || !ticketForm.email.trim()) return;

    const ticket: Ticket = {
      id: Date.now(),
      subject: ticketForm.subject.trim(),
      customer: ticketForm.customer.trim(),
      email: ticketForm.email.trim(),
      priority: ticketForm.priority,
      status: "Open",
      messages: [],
    };

    setTickets(prev => [ticket, ...prev]);
    addLog("Support Agent", `Created ticket: ${ticket.subject}`);
    setTicketForm({ subject: "", customer: "", email: "", priority: "Medium" });
    setShowTicketForm(false);
  }

  function updateTicketStatus(id: number, status: Ticket["status"]) {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addLog("Support Agent", `Changed ticket #${id} to ${status}`);
  }

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedTicket || !chatMessage.trim()) return;

    const message = {
      sender: "Support",
      text: chatMessage.trim(),
      time: currentTime(),
    };

    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicket
          ? { ...t, messages: [...t.messages, message] }
          : t
      )
    );

    addLog("Support Agent", `Sent a reply to ticket #${selectedTicket}`);
    setChatMessage("");
  }

  function deleteTicket(id: number) {
    setTickets(prev => prev.filter(t => t.id !== id));
    if (selectedTicket === id) setSelectedTicket(null);
    addLog("Support Agent", `Deleted ticket #${id}`);
  }

  // Security and permissions
  function togglePermission(role: string, permission: string) {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));

    addLog("Admin", `Updated ${permission} permission for ${role}`);
  }

  const tabs: { name: Tab; icon: typeof Users }[] = [
    { name: "Employees", icon: Users },
    { name: "Customer Support", icon: Headset },
    { name: "Security", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <div className="mx-auto max-w-[1500px] p-4 md:p-8">

        {/* HEADER */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-xl bg-blue-600 p-2">
                <ShieldCheck size={22} />
              </div>
              <span className="text-xl font-bold">OneFlow OS</span>
            </div>
            <p className="text-sm text-slate-400">
              Team, support and security management
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-slate-300">Workspace active</span>
          </div>
        </header>

        {/* NAVIGATION */}
        <nav className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActiveTab(name);
                setSearch("");
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === name
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
        </nav>

        {/* TITLE + SEARCH */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{activeTab}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your {activeTab.toLowerCase()} operations.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
            <Search size={17} className="text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-500 sm:w-52"
            />
          </div>
        </div>

        {/* ================================== */}
        {/* EMPLOYEE MANAGEMENT */}
        {/* ================================== */}
        {activeTab === "Employees" && (
          <section>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric title="Total Employees" value={String(employees.length)} icon={<Users />} color="blue" />
              <Metric title="Present Today" value={String(presentCount)} icon={<CalendarCheck />} color="emerald" />
              <Metric title="Absent Today" value={String(absentCount)} icon={<Clock />} color="amber" />
              <Metric title="Total Payroll" value={money(totalPayroll)} icon={<DollarSign />} color="violet" />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Paid Payroll</p>
                <h3 className="mt-3 text-2xl font-bold text-emerald-400">{money(paidPayroll)}</h3>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Pending Payroll</p>
                <h3 className="mt-3 text-2xl font-bold text-amber-400">{money(pendingPayroll)}</h3>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Staff Directory</h2>
                <p className="text-sm text-slate-400">Manage employee details, roles and attendance.</p>
              </div>
              <button onClick={() => setShowEmployeeForm(true)} className="primary-btn">
                <Plus size={17} /> Add Employee
              </button>
            </div>

            {showEmployeeForm && (
              <Modal title="Add new employee" onClose={() => setShowEmployeeForm(false)}>
                <form onSubmit={addEmployee} className="grid gap-3">
                  <input required placeholder="Full name" value={employeeForm.name}
                    onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} className="field" />
                  <input required type="email" placeholder="Email address" value={employeeForm.email}
                    onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} className="field" />
                  <select value={employeeForm.role}
                    onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })} className="field">
                    {roles.map(role => <option key={role}>{role}</option>)}
                  </select>
                  <input required type="number" min="0" step="0.01" placeholder="Monthly salary ($)" value={employeeForm.salary}
                    onChange={e => setEmployeeForm({ ...employeeForm, salary: e.target.value })} className="field" />
                  <button className="primary-btn justify-center">Create Employee</button>
                </form>
              </Modal>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-slate-400">
                    <tr>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Monthly Salary</th>
                      <th className="p-4">Payroll</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id} className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/40">
                        <td className="p-4">
                          <p className="font-semibold">{emp.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{emp.email}</p>
                        </td>
                        <td className="p-4">
                          <select value={emp.role} onChange={e => updateEmployeeRole(emp.id, e.target.value)} className="small-select">
                            {roles.map(role => <option key={role}>{role}</option>)}
                          </select>
                        </td>
                        <td className="p-4">
                          <select value={emp.attendance} onChange={e => updateAttendance(emp.id, e.target.value as Employee["attendance"])} className="small-select">
                            <option>Present</option>
                            <option>Absent</option>
                            <option>On Leave</option>
                          </select>
                        </td>
                        <td className="p-4 font-medium">{money(emp.salary)}</td>
                        <td className="p-4">
                          <button onClick={() => togglePayroll(emp.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${emp.paid ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {emp.paid ? "Paid" : "Mark as Paid"}
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => deleteEmployee(emp.id)} aria-label="Delete employee" className="text-slate-500 hover:text-rose-400">
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmployees.length === 0 && <Empty text="No employees found." />}
              </div>
            </div>
          </section>
        )}

        {/* =========================
