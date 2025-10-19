"use client";

import type React from "react";
import * as Phoenix from "phoenix";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  MousePointer2,
  Mail,
  User,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";

interface Cursor {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  color: string;
}

interface ClickEffect {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface TypingUser {
  name: string;
  color: string;
}

interface Activity {
  id: string;
  text: string;
  timestamp: Date;
  type: "join" | "leave";
}

interface OnlineUser {
  name: string;
  color: string;
  status: "active" | "idle" | "typing";
  lastActivity: Date;
}

interface MessagePayload {
  user: string;
  body: string;
}

const MOCK_USERS = [
  { name: "Alex", color: "#8B5CF6" },
  { name: "Sarah", color: "#EC4899" },
  { name: "Mike", color: "#3B82F6" },
  { name: "Emma", color: "#10B981" },
];

const { Socket, Presence } = Phoenix;

export default function LobbyChat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loginInput, setLoginInput] = useState("");
  const [loginType, setLoginType] = useState<"username" | "email">("username");

  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const channelRef = useRef<any>(null);
  const hasJoinedRef = useRef(false);

  const presence = useRef<Presence | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#8B5CF6");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(
        MOCK_USERS.map((user, index) => ({
          id: user.name,
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
          name: user.name,
          color: user.color,
        })),
      );

      setCursors([]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasJoinedRef.current) return;
    if (!username) return;
    hasJoinedRef.current = true;

    let savedUserId = localStorage.getItem("user_id");
    if (!savedUserId) {
      savedUserId = crypto.randomUUID();
      localStorage.setItem("user_id", savedUserId);
    }

    const socket = new Socket("ws://localhost:4000/socket");
    socket.connect();

    const channel = socket.channel("chat:lobby", { user: username || "Anon" });

    channel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined successfully", resp);
      })
      .receive("error", (resp) => {
        console.error("Unable to join", resp);
      });

    // 🧩 Presence nesnesini burada oluştur
    const pres = new Presence(channel);
    presence.current = pres;

    // 🔄 Sync olunca kullanıcı listesini güncelle
    presence.current?.onSync(() => {
      const list =
        presence.current?.list((user, { metas }) => {
          const latestMeta = metas[metas.length - 1];
          return {
            name: user,
            color: "#3B82F6",
            status: "active",
            lastActivity: new Date(latestMeta?.online_at || Date.now()),
          };
        }) || [];

      const unique = Object.values(
        list.reduce(
          (acc, user) => {
            acc[user.name] = user;
            return acc;
          },
          {} as Record<string, OnlineUser>,
        ),
      );

      console.log("✅ Unique Online users:", unique);

      console.log("Online users:", list);
      setOnlineUsers(list);
    });

    // 💬 Mesaj event'i
    channel.on("new_msg", (payload: MessagePayload) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: payload.user,
        text: payload.body,
        timestamp: new Date(),
        color: "#3B82F6",
      };

      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    });

    socketRef.current = socket;
    channelRef.current = channel;

    if (isLoggedIn) {
      const joinActivity: Activity = {
        id: Date.now().toString(),
        text: `${username} joined the lobby`,
        timestamp: new Date(),
        type: "join",
      };
      setActivities((prev) => [...prev, joinActivity]);

      setTimeout(() => {
        setActivities((prev) => prev.filter((a) => a.id !== joinActivity.id));
      }, 5000);
    }

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, [username, isLoggedIn]);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    // kanalı temizle
    if (channelRef.current) {
      channelRef.current.leave();
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // state sıfırlama
    setIsLoggedIn(false);
    setUsername("");
    setOnlineUsers([]);
    setMessages([]);
    setActivities([]);

    // presence ve join flag sıfırlama
    presence.current = null;
    hasJoinedRef.current = false;

    console.log("👋 Left the lobby");
  };

  const handleClick = (e: React.MouseEvent) => {
    const color = "#8B5CF6";
    const newEffect = {
      id: Date.now().toString(),
      x: e.clientX,
      y: e.clientY,
      color,
    };
    setClickEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setClickEffects((prev) =>
        prev.filter((effect) => effect.id !== newEffect.id),
      );
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: username,
      text: inputValue,
      timestamp: new Date(),
      color: "#F59E0B",
    };

    channelRef.current?.push("new_msg", {
      user: username,
      body: inputValue,
    });

    //setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;

    setUsername(loginInput);
    setIsLoggedIn(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card/90 backdrop-blur-sm border-2 animate-in fade-in zoom-in-95">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue mb-2">
              Realtime Server Playground
            </h1>
            <p className="text-muted-foreground">Join the interactive lobby</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex gap-2 p-1 bg-secondary rounded-lg">
              <Button
                type="button"
                variant={loginType === "username" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginType("username")}
              >
                <User className="w-4 h-4 mr-2" />
                Username
              </Button>
              <Button
                type="button"
                variant={loginType === "email" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginType("email")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                {loginType === "username" ? "Username" : "Email Address"}
              </label>
              <Input
                type={loginType === "email" ? "email" : "text"}
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder={
                  loginType === "username"
                    ? "Enter your username..."
                    : "example@email.com"
                }
                className="bg-background"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Join Lobby
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              {onlineUsers.length} users in playground
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted relative overflow-hidden"
      onClick={handleClick}
    >
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none transition-all duration-2000 ease-out z-50"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <MousePointer2
            className="w-6 h-6 drop-shadow-lg"
            style={{ color: cursor.color }}
            fill={cursor.color}
          />
          <span
            className="absolute top-6 left-2 text-xs font-medium px-2 py-1 rounded-full shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: cursor.color,
              color: "white",
            }}
          >
            {cursor.name}
          </span>
        </div>
      ))}

      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full ripple"
            style={{ borderColor: effect.color, opacity: 0.8 }}
          />
          <div
            className="absolute inset-0 w-12 h-12 rounded-full"
            style={{ backgroundColor: effect.color, opacity: 0.3 }}
          />
        </div>
      ))}

      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {activities.map((activity) => (
          <Card
            key={activity.id}
            className="p-3 bg-card/95 backdrop-blur-sm border-2 animate-in slide-in-from-right-5 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              {activity.type === "join" ? (
                <LogIn className="w-4 h-4 text-green-500" />
              ) : (
                <LogOut className="w-4 h-4 text-red-500" />
              )}
              <p className="text-sm font-medium">{activity.text}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 h-screen flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-blue mb-2">
              Realtime Server Playground
            </h1>
            <p className="text-muted-foreground mt-1">
              {`Welcome ${username},`} 
              <span className="font-semibold text-accent">{username}</span> •{" "}
              {onlineUsers.length} users in playground
            </p>
          </div>
          <div className="flex gap-2">
        
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave Lobby
            </Button>
          </div>
        </div>

     

        <div className="flex-1 grid md:grid-cols-[1fr_300px] gap-6">
          <Card className="flex flex-col bg-card/80 backdrop-blur-sm border-2 overflow-hidden h-[800px]">
            <div className="p-4 border-b bg-secondary/50">
              <h2 className="font-semibold text-card-foreground">Messages</h2>
            </div>
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="group flex gap-3 animate-in fade-in slide-in-from-bottom-2"
                >
                  <Avatar
                    className="w-10 h-10 border-2"
                    style={{ borderColor: message.color }}
                  >
                    <AvatarFallback
                      style={{ backgroundColor: message.color, color: "white" }}
                    >
                      {message.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-card-foreground">
                        {message.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-card-foreground mt-1">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-secondary/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 bg-background"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0"
                  disabled={!inputValue}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-2 p-4 hidden md:block">
            <h2 className="font-semibold text-card-foreground mb-4">
              Online Users ({onlineUsers.length})
            </h2>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar
                      className="w-10 h-10 border-2"
                      style={{ borderColor: user.color }}
                    >
                      <AvatarFallback
                        style={{ backgroundColor: user.color, color: "white" }}
                      >
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card"
                      style={{
                        backgroundColor:
                          user.status === "active"
                            ? "#10B981"
                            : user.status === "idle"
                              ? "#F59E0B"
                              : user.color,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-card-foreground">
                      {user.name}
                    </span>

                    {username === user.name && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        you
                      </Badge>
                    )}

                    {user.status === "typing" && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        typing...
                      </Badge>
                    )}
                    {user.status === "idle" && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        away
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
