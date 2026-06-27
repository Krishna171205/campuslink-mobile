import React, { createContext, useContext, useState, useEffect } from "react";

export interface AppNotification {
  id: number;
  text: string;
  time: string;
  type: string;
  unread: boolean;
}


export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  college: string;
  major: string;
  year: string;
  skills: string[];
  interests: string[];
  avatar: string;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  cernBalance: number;
  inrSpent: number;
  inrEarned: number;
  reputation: number;
  tasksCompletedCount: number;
  role: "user" | "admin" | "moderator";
  referralCode: string;
  friendsSignedUp: number;
  friendsVerified: number;
  cernFromReferrals: number;
  referralCap: number;
  hasCompletedProfile: boolean;
  rollNumber?: string;
  regNumber?: string;
  idDocUrl?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  rewardAmount: number;
  currency: "CERN" | "INR";
  deadline: string;
  location: string;
  contact?: string;
  status: "OPEN" | "CLAIMED" | "SUBMITTED" | "COMPLETED" | "FLAGGED" | "EXPIRED";
  posterName: string;
  posterAvatar: string;
  posterCollege?: string;
  helperName: string | null;
  helperAvatar: string | null;
  applicants: { name: string; avatar: string; rating: number }[];
  submission?: {
    comment: string;
    files: string[];
    link?: string;
    submittedAt: string;
  };
  review?: {
    rating: number;
    comment: string;
    flagged: boolean;
    reviewedAt: string;
  };
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface RewardItem {
  id: number;
  title: string;
  cost: number;
  category: "Entertainment" | "Food" | "Shopping" | "Education";
  image: string;
  vouchersLeft: number;
  expiryDate: string;
}

export interface Transaction {
  id: number;
  title: string;
  desc: string;
  amount: number; // positive or negative
  type: "EARNED" | "SPENT" | "BONUS" | "PENALTY" | "RETURN" | "ADMIN_GRANT";
  date: string;
}

export interface RatingAppeal {
  id: number;
  taskTitle: string;
  originalRating: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface AppContextType {
  user: UserProfile;
  tasks: Task[];
  chatRooms: ChatRoom[];
  notifications: AppNotification[];
  rewards: RewardItem[];
  transactions: Transaction[];
  appeals: RatingAppeal[];
  bonusPopup: { show: boolean; variant: "awarded" | "rejected" } | null;
  setBonusPopup: (val: { show: boolean; variant: "awarded" | "rejected" } | null) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setAppeals: React.Dispatch<React.SetStateAction<RatingAppeal[]>>;
  
  // Actions
  changeUserRole: (role: "user" | "admin" | "moderator") => void;
  submitVerification: (college: string, roll: string, reg: string, docName: string) => void;
  applyToTask: (taskId: number) => void;
  selectHelper: (taskId: number, helperName: string) => void;
  submitTaskWork: (taskId: number, comment: string, files: string[], link?: string) => void;
  reviewTask: (taskId: number, rating: number, comment: string) => void;
  resolveFlag: (taskId: number, resolution: "pay" | "refund" | "split", splitPercent?: number) => void;
  mintReserveCern: (amount: number) => void;
  adjustUserBalance: (amount: number, reason: string) => void;
  redeemReward: (rewardId: number) => boolean;
  submitAppeal: (taskId: number, reason: string) => void;
  sendChatMessage: (roomId: string, text: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Default Mock User Info
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("cl_user");
    return saved ? JSON.parse(saved) : {
      name: "Alex R.",
      email: "alex.r@dtu.ac.in",
      bio: "Creative developer passionate about building intuitive web experiences. Designing products that scale.",
      college: "DTU",
      major: "Computer Science",
      year: "4th Year",
      skills: ["React", "UI/UX", "Python", "Figma"],
      interests: ["Hackathons", "Tech Development", "Photography"],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      verificationStatus: "UNVERIFIED",
      cernBalance: 340,
      inrSpent: 2505,
      inrEarned: 1425,
      reputation: 4850,
      tasksCompletedCount: 12,
      role: "user",
      referralCode: "CAMPUS-A7K3",
      friendsSignedUp: 12,
      friendsVerified: 5,
      cernFromReferrals: 125,
      referralCap: 50,
      hasCompletedProfile: true
    };
  });

  // Mock Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("cl_tasks");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Design Landing Page for College Startup",
        description: "Need a professional landing page in Figma for our upcoming project. Clean aesthetics, modern gradients, and full mockup designs are required.",
        category: "Design",
        skillsRequired: ["Figma", "UI/UX", "Prototyping"],
        rewardAmount: 500,
        currency: "INR",
        deadline: "2026-06-25",
        location: "Remote",
        contact: "9876543210",
        status: "OPEN",
        posterName: "Sarah M.",
        posterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        posterCollege: "DTU",
        helperName: null,
        helperAvatar: null,
        applicants: [
          { name: "John Doe", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80", rating: 4.5 },
          { name: "Emily L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", rating: 4.8 }
        ]
      },
      {
        id: 2,
        title: "Fix React/Tailwind Frontend Bugs",
        description: "Looking for an experienced React developer to help resolve alignment errors, active state routing bugs, and responsiveness problems in our repository.",
        category: "Development",
        skillsRequired: ["React", "TailwindCSS", "CSS"],
        rewardAmount: 80,
        currency: "CERN",
        deadline: "2026-06-20",
        location: "Remote",
        status: "CLAIMED",
        posterName: "David K.",
        posterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        posterCollege: "IITD",
        helperName: "Alex R.",
        helperAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        applicants: [
          { name: "Alex R.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", rating: 4.8 }
        ]
      },
      {
        id: 3,
        title: "Calculus 101 Midterm Tutoring",
        description: "Need someone who scored A+ in Calculus last semester to explain derivatives, integration methods, and sample midterm problems over Zoom.",
        category: "Tutoring",
        skillsRequired: ["Mathematics", "Teaching"],
        rewardAmount: 150,
        currency: "INR",
        deadline: "2026-06-18",
        location: "Campus Library",
        status: "COMPLETED",
        posterName: "Emily L.",
        posterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        posterCollege: "DTU",
        helperName: "Jessica T.",
        helperAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        applicants: [],
        review: {
          rating: 5,
          comment: "Super helpful, explained everything perfectly!",
          flagged: false,
          reviewedAt: "2026-06-12"
        }
      },
      {
        id: 4,
        title: "Translate English Project Report to Hindi",
        description: "We require local translation for a 15-page sociology research paper on rural education models. Accuracy and context preservation are key.",
        category: "Writing",
        skillsRequired: ["Hindi", "Translation", "Writing"],
        rewardAmount: 40,
        currency: "CERN",
        deadline: "2026-06-19",
        location: "On-Campus",
        status: "OPEN",
        posterName: "Sarah M.",
        posterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        posterCollege: "DTU",
        helperName: null,
        helperAvatar: null,
        applicants: []
      },
      {
        id: 5,
        title: "Conduct Dining Hall Food Survey",
        description: "Gather feedback from at least 40 students regarding dietary options and quality in hostel dining halls. Fill survey answers in Google Sheets.",
        category: "Research",
        skillsRequired: ["Data Collection", "Excel"],
        rewardAmount: 50,
        currency: "CERN",
        deadline: "2026-06-15",
        location: "DTU Hostel",
        status: "SUBMITTED",
        posterName: "David K.",
        posterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        posterCollege: "IITD",
        helperName: "Alex R.",
        helperAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        applicants: [
          { name: "Alex R.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", rating: 4.8 }
        ],
        submission: {
          comment: "I interviewed 42 students from hostels 1 and 2. The Google Sheet contains names, roll numbers, and answers.",
          files: ["survey_responses.xlsx"],
          link: "https://docs.google.com/spreadsheets/d/mock-survey",
          submittedAt: "2026-06-14"
        }
      }
    ];
  });

  // Mock Conversations / Chats
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem("cl_chats");
    return saved ? JSON.parse(saved) : [
      {
        id: "room_sarah",
        name: "Sarah M.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        lastMessage: "Hey, can you start working on the layout first?",
        timestamp: "2:30 PM",
        unreadCount: 2,
        online: true,
        messages: [
          { id: 1, text: "Hey! I saw you applied to the task.", sender: "them", timestamp: "2:15 PM" },
          { id: 2, text: "Yes, I can build it using React and Tailwind CSS.", sender: "me", timestamp: "2:20 PM" },
          { id: 3, text: "Awesome. I want a sleek modern card look.", sender: "them", timestamp: "2:25 PM" },
          { id: 4, text: "Hey, can you start working on the layout first?", sender: "them", timestamp: "2:30 PM" }
        ]
      },
      {
        id: "room_david",
        name: "David K.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        lastMessage: "The survey files look good! Reviewing it shortly.",
        timestamp: "Yesterday",
        unreadCount: 0,
        online: false,
        messages: [
          { id: 1, text: "Hello Alex, do you have any updates on the survey?", sender: "them", timestamp: "Yesterday" },
          { id: 2, text: "Yes, just submitted the excel sheet via the task submission tab.", sender: "me", timestamp: "Yesterday" },
          { id: 3, text: "The survey files look good! Reviewing it shortly.", sender: "them", timestamp: "Yesterday" }
        ]
      }
    ];
  });

  // Notifications List
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("cl_notifications");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "👋 Verify your college ID to earn CERN bonuses and unlock the token economy!", time: "2h ago", type: "Verification", unread: true },
      { id: 2, text: "🎉 Welcome to CampusLink! Complete your profile setup.", time: "1d ago", type: "System", unread: false }
    ];
  });

  // Rewards Items
  const [rewards] = useState<RewardItem[]>([
    { id: 1, title: "Netflix Premium Voucher (1 Month)", cost: 200, category: "Entertainment", image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=300&q=80", vouchersLeft: 3, expiryDate: "Jul 15, 2026" },
    { id: 2, title: "Starbucks Coffee Coupon (INR 250)", cost: 50, category: "Food", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80", vouchersLeft: 8, expiryDate: "Aug 01, 2026" },
    { id: 3, title: "Amazon Gift Voucher (INR 500)", cost: 100, category: "Shopping", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=300&q=80", vouchersLeft: 12, expiryDate: "Jun 30, 2026" },
    { id: 4, title: "Figma Pro Plan Subscription", cost: 300, category: "Education", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80", vouchersLeft: 5, expiryDate: "Sep 10, 2026" }
  ]);

  // Transaction Ledger
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("cl_transactions");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Referral Signup Reward", desc: "For verifying friend Sarah", amount: 25, type: "BONUS", date: "Jun 10, 2026 • 2:30 PM" },
      { id: 2, title: "Task Reward Received", desc: "Completed Logo Review task", amount: 50, type: "EARNED", date: "Jun 08, 2026 • 4:15 PM" },
      { id: 3, title: "Voucher Purchase", desc: "Redeemed Starbucks Coupon", amount: -50, type: "SPENT", date: "Jun 05, 2026 • 12:00 PM" },
      { id: 4, title: "Task Creation Deposit", desc: "Posted Translate paper task", amount: -40, type: "SPENT", date: "Jun 02, 2026 • 9:30 AM" }
    ];
  });

  // Rating Appeals
  const [appeals, setAppeals] = useState<RatingAppeal[]>(() => {
    const saved = localStorage.getItem("cl_appeals");
    return saved ? JSON.parse(saved) : [
      { id: 1, taskTitle: "Calculus tutoring session", originalRating: 2, reason: "The user selected 2 stars by accident and wanted to select 5.", status: "APPROVED" }
    ];
  });

  // Bonus Popup notification state
  const [bonusPopup, setBonusPopup] = useState<{ show: boolean; variant: "awarded" | "rejected" } | null>(null);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem("cl_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cl_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("cl_chats", JSON.stringify(chatRooms));
  }, [chatRooms]);

  useEffect(() => {
    localStorage.setItem("cl_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("cl_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("cl_appeals", JSON.stringify(appeals));
  }, [appeals]);

  // Actions implementations
  const changeUserRole = (role: "user" | "admin" | "moderator") => {
    setUser(prev => ({ ...prev, role }));
  };

  const submitVerification = (college: string, roll: string, reg: string, docName: string) => {
    setUser(prev => ({
      ...prev,
      verificationStatus: "PENDING",
      college,
      rollNumber: roll,
      regNumber: reg,
      idDocUrl: docName
    }));
    
    // Auto add notification
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `⏳ Verification request submitted for ${college}. Estimated review time: 24h.`,
        time: "Just now",
        type: "Verification",
        unread: true
      },
      ...prev
    ]);
  };

  const applyToTask = (taskId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: "CLAIMED",
          helperName: user.name,
          helperAvatar: user.avatar,
          applicants: [...t.applicants, { name: user.name, avatar: user.avatar, rating: 4.8 }]
        };
      }
      return t;
    }));

    // Notify user
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `✅ You successfully applied for the task: "${tasks.find(t => t.id === taskId)?.title}"`,
        time: "Just now",
        type: "Task selected",
        unread: true
      },
      ...prev
    ]);
  };

  const selectHelper = (taskId: number, helperName: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const selected = t.applicants.find(a => a.name === helperName);
        return {
          ...t,
          status: "CLAIMED",
          helperName,
          helperAvatar: selected?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        };
      }
      return t;
    }));

    // Trigger notification if the active user was selected
    if (helperName === user.name) {
      setNotifications(prev => [
        {
          id: Date.now(),
          text: `🎉 You were selected to work on: "${tasks.find(t => t.id === taskId)?.title}"!`,
          time: "Just now",
          type: "Task selected",
          unread: true
        },
        ...prev
      ]);
    }
  };

  const submitTaskWork = (taskId: number, comment: string, files: string[], link?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: "SUBMITTED",
          submission: {
            comment,
            files,
            link,
            submittedAt: new Date().toLocaleDateString()
          }
        };
      }
      return t;
    }));

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `📤 Work submitted for task: "${tasks.find(t => t.id === taskId)?.title}". Awaiting review.`,
        time: "Just now",
        type: "Task submitted",
        unread: true
      },
      ...prev
    ]);
  };

  const reviewTask = (taskId: number, rating: number, comment: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isLowRating = rating <= 2;
    const finalStatus = isLowRating ? "FLAGGED" : "COMPLETED";

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: finalStatus,
          review: {
            rating,
            comment,
            flagged: isLowRating,
            reviewedAt: new Date().toLocaleDateString()
          }
        };
      }
      return t;
    }));

    if (isLowRating) {
      // Flagged: payment is held
      setNotifications(prev => [
        {
          id: Date.now(),
          text: `⚠️ Task "${task.title}" has been flagged due to a low rating (${rating}★). Admin review is pending.`,
          time: "Just now",
          type: "CERN penalty",
          unread: true
        },
        ...prev
      ]);
    } else {
      // Successful: Release payments
      if (task.currency === "CERN") {
        const amount = task.rewardAmount;
        // Doer gets payment + 2% bonus (calculated on amount)
        const bonus = Math.max(1, Math.round(amount * 0.02));
        
        if (task.helperName === user.name) {
          // Active user was the helper
          setUser(prev => ({
            ...prev,
            cernBalance: prev.cernBalance + amount + bonus,
            reputation: prev.reputation + 50,
            tasksCompletedCount: prev.tasksCompletedCount + 1
          }));
          setTransactions(prev => [
            { id: Date.now(), title: "Task Earnings", desc: task.title, amount: amount, type: "EARNED", date: "Just now" },
            { id: Date.now() + 1, title: "Task Completion Bonus", desc: "2% Speed Bonus", amount: bonus, type: "BONUS", date: "Just now" },
            ...prev
          ]);
          setBonusPopup({ show: true, variant: "awarded" });
        } else if (task.posterName === user.name) {
          // Active user was the poster (tokens already deducted on post)
          setUser(prev => ({
            ...prev,
            reputation: prev.reputation + 20
          }));
        }
      } else {
        // INR task completed
        const amount = task.rewardAmount;
        if (task.helperName === user.name) {
          const received = Math.round(amount * 0.95); // 5% doer fee deducted
          setUser(prev => ({
            ...prev,
            inrEarned: prev.inrEarned + received,
            reputation: prev.reputation + 80,
            tasksCompletedCount: prev.tasksCompletedCount + 1
          }));
          setBonusPopup({ show: true, variant: "awarded" });
        }
      }

      setNotifications(prev => [
        {
          id: Date.now(),
          text: `🎉 Task "${task.title}" completed successfully! Helper received payment.`,
          time: "Just now",
          type: "Task completed",
          unread: true
        },
        ...prev
      ]);
    }
  };

  const resolveFlag = (taskId: number, resolution: "pay" | "refund" | "split", splitPercent: number = 50) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: "COMPLETED" };
      }
      return t;
    }));

    const amount = task.rewardAmount;

    // Apply currency adjustments
    if (task.currency === "CERN") {
      if (resolution === "pay") {
        // Pay helper in full
        if (task.helperName === user.name) {
          setUser(prev => ({ ...prev, cernBalance: prev.cernBalance + amount }));
          setTransactions(prev => [{ id: Date.now(), title: "Dispute Released (Paid)", desc: task.title, amount, type: "EARNED", date: "Just now" }, ...prev]);
        }
      } else if (resolution === "refund") {
        // Refund poster
        if (task.posterName === user.name) {
          setUser(prev => ({ ...prev, cernBalance: prev.cernBalance + amount }));
          setTransactions(prev => [{ id: Date.now(), title: "Dispute Refunded", desc: task.title, amount, type: "RETURN", date: "Just now" }, ...prev]);
        }
      } else if (resolution === "split") {
        // Split payment
        const helperShare = Math.round(amount * (splitPercent / 100));
        const posterShare = amount - helperShare;
        
        if (task.helperName === user.name) {
          setUser(prev => ({ ...prev, cernBalance: prev.cernBalance + helperShare }));
          setTransactions(prev => [{ id: Date.now(), title: "Dispute Split (Share)", desc: task.title, amount: helperShare, type: "EARNED", date: "Just now" }, ...prev]);
        } else if (task.posterName === user.name) {
          setUser(prev => ({ ...prev, cernBalance: prev.cernBalance + posterShare }));
          setTransactions(prev => [{ id: Date.now(), title: "Dispute Split Refund", desc: task.title, amount: posterShare, type: "RETURN", date: "Just now" }, ...prev]);
        }
      }
    } else {
      // INR task resolution logic
      if (resolution === "pay") {
        if (task.helperName === user.name) {
          const received = Math.round(amount * 0.95);
          setUser(prev => ({ ...prev, inrEarned: prev.inrEarned + received }));
        }
      } else if (resolution === "refund") {
        if (task.posterName === user.name) {
          setUser(prev => ({ ...prev, inrSpent: Math.max(0, prev.inrSpent - amount) }));
        }
      } else if (resolution === "split") {
        const helperShare = Math.round(amount * 0.95 * (splitPercent / 100));
        const posterRefund = Math.round(amount * ((100 - splitPercent) / 100));
        if (task.helperName === user.name) {
          setUser(prev => ({ ...prev, inrEarned: prev.inrEarned + helperShare }));
        } else if (task.posterName === user.name) {
          setUser(prev => ({ ...prev, inrSpent: Math.max(0, prev.inrSpent - posterRefund) }));
        }
      }
    }

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `⚖️ Dispute resolved for "${task.title}" by Admin. Status: ${resolution.toUpperCase()}`,
        time: "Just now",
        type: "Verification",
        unread: true
      },
      ...prev
    ]);
  };

  const mintReserveCern = (amount: number) => {
    // Simulated token operations
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `🪙 Admin successfully minted ${amount} $CERN to reserve wallet.`,
        time: "Just now",
        type: "System",
        unread: true
      },
      ...prev
    ]);
  };

  const adjustUserBalance = (amount: number, reason: string) => {
    setUser(prev => ({
      ...prev,
      cernBalance: Math.max(0, prev.cernBalance + amount)
    }));

    setTransactions(prev => [
      {
        id: Date.now(),
        title: amount > 0 ? "Admin Token Grant" : "Admin Token Penalty",
        desc: reason,
        amount,
        type: amount > 0 ? "ADMIN_GRANT" : "PENALTY",
        date: "Just now"
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `🪙 Your balance was adjusted by Admin: ${amount > 0 ? "+" : ""}${amount} $CERN. Reason: ${reason}`,
        time: "Just now",
        type: amount > 0 ? "CERN credit" : "CERN penalty",
        unread: true
      },
      ...prev
    ]);
  };

  const redeemReward = (rewardId: number): boolean => {
    const item = rewards.find(r => r.id === rewardId);
    if (!item) return false;

    if (user.verificationStatus !== "VERIFIED") {
      alert("Verification Required: You must verify your college to redeem rewards.");
      return false;
    }

    if (user.cernBalance < item.cost) {
      alert("Insufficient Balance: You need more $CERN tokens.");
      return false;
    }

    // Deduct CERN and record transaction
    setUser(prev => ({
      ...prev,
      cernBalance: prev.cernBalance - item.cost
    }));

    setTransactions(prev => [
      {
        id: Date.now(),
        title: "Reward Redeemed",
        desc: item.title,
        amount: -item.cost,
        type: "SPENT",
        date: "Just now"
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `🎟️ Successfully redeemed "${item.title}". Voucher details sent to your registered email!`,
        time: "Just now",
        type: "Verification",
        unread: true
      },
      ...prev
    ]);

    return true;
  };

  const submitAppeal = (taskId: number, reason: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setAppeals(prev => [
      {
        id: Date.now(),
        taskTitle: task.title,
        originalRating: task.review?.rating || 1,
        reason,
        status: "PENDING"
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `⚖️ Rating appeal submitted for "${task.title}". Admin will review your comments.`,
        time: "Just now",
        type: "System",
        unread: true
      },
      ...prev
    ]);
  };

  const sendChatMessage = (roomId: string, text: string) => {
    setChatRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const updatedMsgs = [
          ...room.messages,
          { id: Date.now(), text, sender: "me" as const, timestamp: "Just now" }
        ];
        return {
          ...room,
          lastMessage: text,
          timestamp: "Just now",
          messages: updatedMsgs
        };
      }
      return room;
    }));

    // Auto-respond simulation after 2 seconds to make the app feel interactive!
    setTimeout(() => {
      setChatRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          const autoReplies = [
            "Sounds good! Let me review this.",
            "I'm on it. Will submit before the deadline.",
            "Got it! Let me know if you need anything else.",
            "Awesome work! Thanks for the prompt submission."
          ];
          const textReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const updatedMsgs = [
            ...room.messages,
            { id: Date.now() + 1, text: textReply, sender: "them" as const, timestamp: "Just now" }
          ];

          // Trigger a notification
          setNotifications(old => [
            {
              id: Date.now() + 2,
              text: `💬 Message from ${room.name}: "${textReply}"`,
              time: "Just now",
              type: "Chat message",
              unread: true
            },
            ...old
          ]);

          return {
            ...room,
            lastMessage: textReply,
            timestamp: "Just now",
            unreadCount: room.unreadCount + 1,
            messages: updatedMsgs
          };
        }
        return room;
      }));
    }, 2000);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <AppContext.Provider value={{
      user,
      tasks,
      chatRooms,
      notifications,
      rewards,
      transactions,
      appeals,
      bonusPopup,
      setBonusPopup,
      setUser,
      setTasks,
      setChatRooms,
      setNotifications,
      setTransactions,
      setAppeals,
      changeUserRole,
      submitVerification,
      applyToTask,
      selectHelper,
      submitTaskWork,
      reviewTask,
      resolveFlag,
      mintReserveCern,
      adjustUserBalance,
      redeemReward,
      submitAppeal,
      sendChatMessage,
      markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
