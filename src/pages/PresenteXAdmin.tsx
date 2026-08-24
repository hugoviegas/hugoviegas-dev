import React, { useEffect, useState } from "react";
import { supabase, PresenteDay } from "@/features/presente-x/services/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const PresenteXAdmin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<PresenteDay[]>([]);

  // Edit State
  const [editingDay, setEditingDay] = useState<PresenteDay | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchDays();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchDays();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDays = async () => {
    const { data, error } = await supabase
      .from("presente_days")
      .select("*")
      .order("day_number");
    if (error) {
      toast.error("Failed to fetch days: " + error.message);
    } else if (data) {
      setDays(data as PresenteDay[]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Logged in!");
  };

  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    setLoading(true);
    const { error } = await supabase
      .from("presente_days")
      .update({
        title: editingDay.title,
        description: editingDay.description,
        video_url: editingDay.video_url,
        points_reward: editingDay.points_reward,
        unlock_date: editingDay.unlock_date,
      })
      .eq("id", editingDay.id);

    setLoading(false);
    if (error) {
      toast.error("Error saving: " + error.message);
    } else {
      toast.success("Day updated!");
      setIsDialogOpen(false);
      fetchDays();
    }
  };

  const initDays = async () => {
    setLoading(true);
    const newDays = Array.from({ length: 31 }, (_, i) => ({
      day_number: i + 1,
      title: `Dia ${i + 1}`,
      description: "",
      video_url: "",
      unlock_date: new Date(2026, 4, i + 1, 9, 0, 0).toISOString(), // May 2026
      points_reward: 100,
    }));

    const { error } = await supabase.from("presente_days").insert(newDays);
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Initialized May Calendar!");
      fetchDays();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in to manage Presente X content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Presente X Manager
            </h1>
            <p className="text-slate-500">
              Managing {days.length} days of content
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchDays()}>
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {days.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="mb-4 text-slate-600">
                No content found. Initialize the database for May?
              </p>
              <Button onClick={initDays} disabled={loading}>
                Initialize 31 Days
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((day) => (
              <Card key={day.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Day {day.day_number}
                    </CardTitle>
                    <span
                      className={
                        day.video_url
                          ? "text-green-500 text-xs font-mono"
                          : "text-gray-300 text-xs font-mono"
                      }
                    >
                      {day.video_url ? "HAS VIDEO" : "NO VIDEO"}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {day.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-slate-500 mb-4">
                    Unlock: {new Date(day.unlock_date).toLocaleDateString()}
                  </div>
                  <Dialog
                    open={isDialogOpen && editingDay?.id === day.id}
                    onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setEditingDay(day);
                      else setEditingDay(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Editing Day {day.day_number}</DialogTitle>
                      </DialogHeader>

                      {editingDay && (
                        <form
                          onSubmit={handleSaveDay}
                          className="space-y-4 py-4"
                        >
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={editingDay.title}
                              onChange={(e) =>
                                setEditingDay({
                                  ...editingDay,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Unlock Date (ISO)</Label>
                            <Input
                              value={editingDay.unlock_date}
                              onChange={(e) =>
                                setEditingDay({
                                  ...editingDay,
                                  unlock_date: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description / Message</Label>
                            <Textarea
                              className="h-24"
                              value={editingDay.description || ""}
                              onChange={(e) =>
                                setEditingDay({
                                  ...editingDay,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>YouTube URL</Label>
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              value={editingDay.video_url || ""}
                              onChange={(e) =>
                                setEditingDay({
                                  ...editingDay,
                                  video_url: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Points Reward</Label>
                            <Input
                              type="number"
                              value={editingDay.points_reward}
                              onChange={(e) =>
                                setEditingDay({
                                  ...editingDay,
                                  points_reward: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? (
                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PresenteXAdmin;
