"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { toast } from "sonner";
import { ArrowLeft, UserPlus } from "lucide-react";
import { getPoolsByIdFromApi } from "@/utils/api";
import { ExtraInformationPool } from "@/utils/types";

export default function AddCandidatePage({ params }: any) {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollId = params.pollId;

  const [poll, setPoll] = useState<ExtraInformationPool>();

  const getPools = async () => {
    const { poll } = await getPoolsByIdFromApi(pollId as string);
    console.log("poll Info", poll);

    if (poll.success === true) {
      setPoll(poll.data);
    }
  };

  useEffect(() => {
    getPools();
  }, [pollId]);

  if (!pollId) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card p-12 text-center">
          <CardContent>
            <h1 className="text-2xl font-bold text-slate-300 mb-4">
              Poll Not Found
            </h1>
            <p className="text-slate-400 mb-6">
              The poll you're trying to add a candidate to doesn't exist.
            </p>
            <Link href="/polls">
              <Button className="accent-gradient text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!candidateName.trim()) {
      toast.error("Please enter a candidate name");
      setIsSubmitting(false);
      return;
    }

    // Check if candidate already exists
    const existingCandidate = poll?.candidates.find(
      (c) => c.name.toLowerCase() === candidateName.trim().toLowerCase()
    );

    if (existingCandidate) {
      toast.error("A candidate with this name already exists");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Candidate added successfully!", {
      description: `${candidateName} has been added to the poll.`,
    });

    router.push(`/polls/${params.pollId}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/polls/${params.pollId}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Poll
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Add Candidate
        </h1>
        <p className="text-slate-400">Add a new candidate to "{poll?.name}"</p>
      </div>

      {poll && (
        <Card className="glass-card border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-200">{poll.name}</h3>
                <p className="text-sm text-slate-400">
                  {poll.candidates.length} existing candidates • 300 total votes
                </p>
              </div>
              <div className="text-sm text-slate-400">Poll #{poll.pollId}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
          <CardDescription>
            Enter the name of the candidate you want to add to this poll
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name *</Label>
              <Input
                id="candidateName"
                placeholder="e.g., Jupiter Exchange"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="focus-ring bg-slate-800/60 border-slate-700"
                required
              />
              <p className="text-sm text-slate-400">
                This name will appear in the voting options for all users.
              </p>
            </div>

            {poll && (
              <>
                {poll?.candidates?.length > 0 && (
                  <div className="space-y-2">
                    <Label>Existing Candidates</Label>
                    <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
                      {poll?.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-slate-300">
                            {candidate.name}
                          </span>
                          <span className="text-slate-400">
                            {candidate.votes} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href={`/polls/${params.pollId}`}>
                <Button
                  variant="outline"
                  className="bg-slate-800/60 border-slate-700"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="accent-gradient text-slate-900 min-w-[140px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Candidate
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
