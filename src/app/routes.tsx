import { createBrowserRouter, Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { ProfileSetup } from "./screens/ProfileSetup";
import { AppLayout } from "./components/AppLayout";
import { Home } from "./screens/Home";
import { Tasks } from "./screens/Tasks";
import { MyTasks } from "./screens/MyTasks";
import { TaskDetail } from "./screens/TaskDetail";
import { TaskCompletion } from "./screens/TaskCompletion";
import { CreateTask } from "./screens/CreateTask";
import { EditTask } from "./screens/EditTask";
import { Leaderboard } from "./screens/Leaderboard";
import { Profile } from "./screens/Profile";
import { Notifications } from "./screens/Notifications";
import { Wallet } from "./screens/Wallet";
import { Community } from "./screens/Community";
import { Messages } from "./screens/Messages";
import { ChatDetail } from "./screens/ChatDetail";
import { Settings } from "./screens/Settings";
import { Verification } from "./screens/Verification";
import { Rewards } from "./screens/Rewards";
import { Referral } from "./screens/Referral";
import { Appeals } from "./screens/Appeals";
import { AdminDashboard } from "./screens/AdminDashboard";

const Root = () => {
  return (
    <div className="font-sans text-slate-900 bg-[#F8FAF8] min-h-screen flex flex-col w-full relative overflow-hidden">
      {/* Blurred Campus Illustration Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.70] pointer-events-none scale-[1.05]"
      />
      {/* Subtle grid pattern to provide structure for backdrop blur glassmorphism */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#0F172A 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="flex-1 flex flex-col w-full mx-auto relative overflow-hidden z-10 lg:max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Splash },
      { path: "onboarding", Component: Onboarding },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "profile-setup", Component: ProfileSetup },
      {
        path: "app",
        Component: AppLayout,
        children: [
          { index: true, Component: Home },
          { path: "home", Component: Home },
          { path: "tasks", Component: Tasks },
          { path: "create", Component: CreateTask },
          { path: "leaderboard", Component: Leaderboard },
          { path: "profile", Component: Profile },
          { path: "community", Component: Community },
          { path: "my-tasks", Component: MyTasks },
        ],
      },
      { path: "app/tasks/:id", Component: TaskDetail },
      { path: "app/tasks/:id/edit", Component: EditTask },
      { path: "app/tasks/:id/complete", Component: TaskCompletion },
      { path: "app/notifications", Component: Notifications },
      { path: "app/wallet", Component: Wallet },
      { path: "app/messages", Component: Messages },
      { path: "app/messages/:id", Component: ChatDetail },
      { path: "app/settings", Component: Settings },
      { path: "app/verification", Component: Verification },
      { path: "app/rewards", Component: Rewards },
      { path: "app/referral", Component: Referral },
      { path: "app/appeals", Component: Appeals },
      { path: "app/admin", Component: AdminDashboard },
      { path: "*", Component: Home },
    ],
  },
]);

