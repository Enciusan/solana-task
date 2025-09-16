"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Settings, Moon, Sun, Globe, Key, Database } from "lucide-react";
import { VotingIDL } from "../../../anchor/src/voting-exports";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [cluster, setCluster] = useState("localnet");
  const programId = VotingIDL.address;

  // Load theme preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDarkMode(saved === "dark");
    }
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
    document.documentElement.classList.toggle("dark", checked);
    toast.success(`Switched to ${checked ? "dark" : "light"} mode`);
  };

  const handleClusterChange = (value: string) => {
    setCluster(value);
    toast.success(`Switched to ${value} cluster`);
  };

  const copyProgramId = () => {
    navigator.clipboard.writeText(programId);
    toast.success("Program ID copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2 flex items-center space-x-3">
          <Settings className="w-8 h-8 text-[rgb(var(--accent))]" />
          <span>Settings</span>
        </h1>
        <p className="text-slate-400">
          Configure your voting preferences and application settings
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {darkMode ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-slate-200">
                Dark Mode
              </Label>
              <p className="text-sm text-slate-400 mt-1">
                Use dark theme for better viewing experience
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Network</span>
          </CardTitle>
          <CardDescription>
            Configure Solana network connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Solana Cluster</Label>
            <Select value={cluster} onValueChange={handleClusterChange}>
              <SelectTrigger className="bg-slate-800/60 border-slate-700 focus:ring-[rgb(var(--accent))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem
                  className="text-slate-400"
                  value="localnet"
                  disabled
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <span>Localnet</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-400">
              Select the Solana network to connect to for voting operations
            </p>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Current Status
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-400">
                    Connected to {cluster}
                  </span>
                </div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Connected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Smart Contract</span>
          </CardTitle>
          <CardDescription>
            Information about the deployed voting program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Program ID</Label>
            <div className="flex space-x-2">
              <Input
                value={programId}
                readOnly
                className="font-mono text-sm bg-slate-800/60 border-slate-700"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyProgramId}
                className="bg-slate-800/60 border-slate-700 hover:text-slate-400"
              >
                <Key className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              This is the address of the deployed voting smart contract
            </p>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Program Version</p>
                <p className="text-slate-200 font-medium">v0.31.1</p>
              </div>
              <div>
                <p className="text-slate-400">Last Updated</p>
                <p className="text-slate-200 font-medium">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
