"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Clock, BookOpen, Star, Trophy, CheckCircle2, ListTodo, Plus, Trash2, Calendar, PieChart as PieChartIcon, RotateCcw, Zap, Target, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface StudySession {
  duration_minutes: number;
  mode: string;
  created_at: string;
}

interface StudyPlan {
  id: string;
  subjects: string;
  plan_content: string;
  start_time?: string;
  created_at: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function DashboardSection() {
  const [sessionCount, setSessionCount] = useState(0);
  const [focusHours, setFocusHours] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [newTask, setNewTask] = useState("");
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) return;

    const { data: sessionData } = await supabase
      .from('study_sessions')
      .select('duration_minutes, mode, created_at')
      .order('created_at', { ascending: true });

    if (sessionData) {
      const sessions = sessionData as StudySession[];
      setSessionCount(sessions.length);
      const totalMins = sessions.reduce((acc, s) => acc + (s.mode === 'focus' ? s.duration_minutes : 0), 0);
      setFocusHours(totalMins / 60);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        return {
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          focus: 0,
          fullDate: dateStr
        };
      });

      sessions.forEach(s => {
        const dateStr = new Date(s.created_at).toISOString().split('T')[0];
        const day = last7Days.find(d => d.fullDate === dateStr);
        if (day && s.mode === 'focus') {
          day.focus += s.duration_minutes;
        }
      });
      setChartData(last7Days);

      const focusMins = sessions.filter(s => s.mode === 'focus').reduce((acc, s) => acc + s.duration_minutes, 0);
      const breakMins = sessions.filter(s => s.mode === 'break').reduce((acc, s) => acc + s.duration_minutes, 0);
      
      if (focusMins > 0 || breakMins > 0) {
        setDistributionData([
          { name: 'Focus', value: focusMins },
          { name: 'Break', value: breakMins }
        ]);
      } else {
        setDistributionData([]);
      }
    }

    const { data: taskData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (taskData) setTasks(taskData);

    const { data: planData } = await supabase
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    if (planData) setPlans(planData);
  }

  async function addTask() {
    if (!newTask.trim() || !supabase) return;
    const { data } = await supabase
      .from('tasks')
      .insert([{ text: newTask }])
      .select()
      .single();
    
    if (data) {
      setTasks([data, ...tasks]);
      setNewTask("");
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    if (!supabase) return;
    await supabase.from('tasks').update({ completed: !completed }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
  }

  async function deleteTask(id: string) {
    if (!supabase) return;
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  }

  const stats = [
    { label: "Deep Focus", value: `${focusHours.toFixed(1)}h`, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Flow States", value: sessionCount, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Conquered", value: tasks.filter(t => t.completed).length, icon: Target, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Strategies", value: plans.length, icon: Star, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full max-w-7xl mx-auto p-6 md:p-10 space-y-10 overflow-y-auto pb-24 custom-scrollbar"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-display font-black tracking-tightest bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent"
          >
            Night Owl Command
          </motion.h1>
          <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
            <span className="w-8 h-[2px] bg-primary/30" />
            Your productivity matrix, synchronized in real-time.
          </p>
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="glass glass-hover h-12 px-6 rounded-2xl border-white/5 font-display font-bold uppercase tracking-widest text-xs gap-3"
        >
          <RotateCcw className="w-4 h-4" />
          Synchronize
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
          >
            <Card className="glass glass-hover border-none group overflow-hidden relative h-40">
              <div className={`absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-25 transition-all duration-700 group-hover:scale-125 ${stat.color}`}>
                <stat.icon size={120} />
              </div>
              <CardContent className="h-full flex flex-col justify-between pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-display font-black tracking-tighter">{stat.value}</p>
                  <div className="h-1 w-12 bg-primary/30 rounded-full group-hover:w-full transition-all duration-700" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 glass border-none overflow-hidden group">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display font-black flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Velocity Metrics
                </CardTitle>
                <CardDescription className="font-bold text-muted-foreground/60">Focus intensity across the last cycle.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-6 pr-4">
            {mounted && chartData.some(d => d.focus > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="white" opacity={0.05} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: "oklch(var(--muted-foreground))", textAnchor: 'middle' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ stroke: 'oklch(var(--primary))', strokeWidth: 1, strokeDasharray: '10 10' }}
                    contentStyle={{ 
                      backgroundColor: "oklch(var(--card) / 0.95)", 
                      border: "1px solid oklch(var(--border))",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 800,
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="oklch(var(--primary))" 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorFocus)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center relative z-10">
                    <Clock className="w-10 h-10 text-primary opacity-60" />
                  </div>
                </div>
                <span className="font-display font-black uppercase tracking-widest text-xs opacity-40">Awaiting Data Streams...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 glass border-none overflow-hidden group">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-black flex items-center gap-3">
              <PieChartIcon className="w-6 h-6 text-accent" />
              Equilibrium
            </CardTitle>
            <CardDescription className="font-bold text-muted-foreground/60">The balance of work and recovery.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-2">
            {mounted && distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? "oklch(var(--primary))" : "oklch(var(--accent))"} 
                        className="hover:opacity-80 transition-all duration-500 cursor-pointer drop-shadow-2xl"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "oklch(var(--card) / 0.95)", 
                      border: "none",
                      borderRadius: "16px",
                      fontSize: "10px",
                      fontWeight: 900,
                      backdropFilter: "blur(20px)"
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-6">
                <PieChartIcon className="w-16 h-16 text-accent opacity-20 animate-pulse" />
                <span className="font-display font-black uppercase tracking-widest text-xs opacity-40 text-center">No equilibrium mapped yet.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-none overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-black flex items-center gap-3">
              <ListTodo className="w-6 h-6 text-accent" />
              Mission Log
            </CardTitle>
            <CardDescription className="font-bold text-muted-foreground/60">Current objectives in the field.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input 
                placeholder="Initialize new objective..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="bg-white/5 border-white/5 h-14 rounded-2xl focus-visible:ring-accent font-bold text-sm px-6"
              />
              <Button onClick={addTask} size="icon" className="shrink-0 bg-accent hover:bg-accent/80 h-14 w-14 rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                <Plus className="w-6 h-6 text-accent-foreground" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {tasks.length > 0 ? tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
                  >
                    <button 
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
                        task.completed ? 'bg-accent border-accent rotate-12 shadow-lg shadow-accent/40' : 'border-white/20 hover:border-accent/50'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-accent-foreground" />}
                    </button>
                    <span className={`flex-1 font-bold text-sm tracking-tight transition-all duration-500 ${
                      task.completed ? 'text-muted-foreground/40 line-through' : 'text-foreground'
                    }`}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )) : (
                  <div className="text-center py-16">
                    <p className="font-display font-black text-xs uppercase tracking-[0.5em] text-muted-foreground/20">All missions accomplished.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass border-none overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50" />
            <CardHeader>
              <CardTitle className="text-2xl font-display font-black flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Target Milestone
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground/60">Weekly threshold: 20 Focus Hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Operational Level</span>
                <span className="text-2xl font-display font-black tracking-tighter">{focusHours.toFixed(1)} <span className="text-xs text-muted-foreground">/ 20.0h</span></span>
              </div>
              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (focusHours/20)*100)}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-primary via-violet-500 to-accent rounded-full relative shadow-[0_0_30px_rgba(oklch(var(--primary))/0.5)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:40px_40px] animate-[progress-stripe_2s_linear_infinite]" />
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground/60 font-black italic text-center uppercase tracking-widest">
                {focusHours >= 20 
                  ? "Peak performance achieved. You are the night. 🦉" 
                  : `${(20 - focusHours).toFixed(1)} hours remaining to reach optimal state.`}
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-none overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-black flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Strategic Directives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.length > 0 ? (
                  plans.map((plan, i) => (
                    <motion.div 
                      key={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 hover:bg-white/10 transition-all group/plan"
                    >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[9px] uppercase tracking-[0.3em] text-primary-foreground bg-primary px-3 py-1 rounded-lg">
                              {plan.subjects}
                            </span>
                            {plan.start_time && (
                              <span className="font-black text-[9px] uppercase tracking-[0.3em] text-accent-foreground bg-accent px-3 py-1 rounded-lg flex items-center gap-1">
                                <Clock className="w-2 h-2" /> {plan.start_time}
                              </span>
                            )}
                          </div>
                          <span suppressHydrationWarning className="text-[10px] text-muted-foreground/60 font-black">{new Date(plan.created_at).toLocaleDateString()}</span>
                        </div>

                      <p className="text-xs text-muted-foreground/80 font-bold leading-relaxed line-clamp-2">
                        {plan.plan_content}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-20">
                    <BookOpen size={40} className="mx-auto mb-4" />
                    <p className="font-display font-black text-[10px] uppercase tracking-[0.4em]">No directives issued.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
