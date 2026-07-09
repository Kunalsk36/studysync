import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Timer,
  Target,
  BarChart3,
  Bell,
  Trophy,
  Sparkles,
  User,
  Settings,
} from "lucide-react";

/**
 * Shared across Sidebar + mobile drawer (03-AppFlow.md §9 Global Navigation Components).
 */
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Pomodoro", href: "/pomodoro", icon: Timer },
  { label: "Study Goals", href: "/goals", icon: Target },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
];

export const USER_MENU_ITEMS = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];
