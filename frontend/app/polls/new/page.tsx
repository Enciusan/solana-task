"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createPoll } from "@/utils/functions";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import { toast } from "sonner";
import * as anchor from "@coral-xyz/anchor";

interface PollFormData {
  name: string;
  description: string;
  startDate: Date;
  startTime: string;
  endDate: Date | null;
  endTime: string;
}

export default function CreatePollPage() {
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [formData, setFormData] = useState<PollFormData>({
    name: "",
    description: "",
    startDate: new Date(),
    startTime: "",
    endDate: null,
    endTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    const isEndTime = e.target.name === "endTime";

    if (isEndTime) {
      // Handle end time change
      setFormData({ ...formData, endTime: time });

      if (formData.endDate) {
        const [hours, minutes] = time
          .split(":")
          .map((str) => parseInt(str, 10));
        const newEndDate = new Date(formData.endDate.getTime());
        newEndDate.setHours(hours);
        newEndDate.setMinutes(minutes);
        setFormData((prev) => ({ ...prev, endDate: newEndDate }));
      }
    } else {
      // Handle start time change
      setFormData({ ...formData, startTime: time });

      if (formData.startDate) {
        const [hours, minutes] = time
          .split(":")
          .map((str) => parseInt(str, 10));
        const newStartDate = new Date(formData.startDate.getTime());
        newStartDate.setHours(hours);
        newStartDate.setMinutes(minutes);
        setFormData((prev) => ({ ...prev, startDate: newStartDate }));
      }
    }
  };

  const handleDaySelect = (date: Date | undefined, isEndDate = false) => {
    if (!date) return;

    if (isEndDate) {
      // Handle end date selection
      if (!formData.endTime) {
        // If no end time is set, use current time
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        setFormData((prev) => ({
          ...prev,
          endTime: timeString,
          endDate: date,
        }));
      } else {
        // Apply the existing end time to the new date
        const [hours, minutes] = formData.endTime
          .split(":")
          .map((str) => parseInt(str, 10));
        const newEndDate = new Date(date.getTime());
        newEndDate.setHours(hours);
        newEndDate.setMinutes(minutes);
        setFormData((prev) => ({ ...prev, endDate: newEndDate }));
      }
    } else {
      // Handle start date selection
      if (!formData.startTime) {
        // If no start time is set, use current time
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        setFormData((prev) => ({
          ...prev,
          startTime: timeString,
          startDate: date,
        }));
      } else {
        // Apply the existing start time to the new date
        const [hours, minutes] = formData.startTime
          .split(":")
          .map((str) => parseInt(str, 10));
        const newStartDate = new Date(date.getTime());
        newStartDate.setHours(hours);
        newStartDate.setMinutes(minutes);
        setFormData((prev) => ({ ...prev, startDate: newStartDate }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Please enter a poll title");
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a poll description");
      setIsSubmitting(false);
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select start and end dates");
      setIsSubmitting(false);
      return;
    }

    if (formData.endDate <= formData.startDate) {
      toast.error("End date must be after start date");
      setIsSubmitting(false);
      return;
    }

    if (!publicKey || !wallet) return;
    console.log(formData);
    await createPoll(
      {
        id: 2,
        name: formData.name,
        description: formData.description,
        startTime: new anchor.BN(
          Math.floor(new Date(formData.startDate).getTime() / 1000)
        ),
        endTime: new anchor.BN(
          Math.floor(new Date(formData.endDate).getTime() / 1000)
        ),
      },
      publicKey,
      wallet,
      sendTransaction
    );

    toast.success("Poll created successfully!", {
      description: "Your poll is now live and ready for voting.",
    });

    router.push("/polls");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/polls">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Create New Poll
        </h1>
        <p className="text-slate-400">
          Set up a new voting poll for your community to participate in
        </p>
      </div>

      {/* Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>
            Configure the basic information and timing for your poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Poll Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Best DeFi Protocol 2024"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="focus-ring bg-slate-800/60 border-slate-700"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about what this poll is for..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="focus-ring bg-slate-800/60 border-slate-700 min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date & Time *</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    placeholder="Select start date"
                    value={
                      formData.startDate
                        ? format(formData.startDate, "yyyy-MM-dd") +
                          " " +
                          (formData.startTime || "")
                        : ""
                    }
                    readOnly
                    className="focus-ring bg-slate-800/60 border-slate-700"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-slate-900/70 backdrop-blur-2xl">
                  <div className="flex items-center gap-2 px-5">
                    <p>Select time</p>
                    <Input
                      type="time"
                      name="startTime"
                      className="bg-slate-800/60 rounded-lg w-24"
                      value={formData.startTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDaySelect(date, false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date & Time *</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    placeholder="Select end date"
                    value={
                      formData.endDate
                        ? format(formData.endDate, "yyyy-MM-dd") +
                          " " +
                          (formData.endTime || "")
                        : ""
                    }
                    readOnly
                    className="focus-ring bg-slate-800/60 border-slate-700"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-slate-900/70 backdrop-blur-2xl">
                  <div className="flex items-center gap-2 px-5">
                    <p>Select time</p>
                    <Input
                      type="time"
                      name="endTime"
                      className="bg-slate-800/60 rounded-lg w-24"
                      value={formData.endTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleDaySelect(date, true)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/polls">
                <Button
                  variant="outline"
                  className="bg-slate-800/60 border-slate-700"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="accent-gradient text-slate-900 min-w-[120px]"
                // disabled={isSubmitting}
              >
                {/* {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <> */}
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
                {/* </> */}
                {/* )} */}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
