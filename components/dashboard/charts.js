"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { database, ref, get } from "../../../lib/firebase";
import { Sparkles } from "lucide-react";
import {
  EventStats,
  AttendeeChart,
  CategoryChart,
  EventTypeChart,
  PricingAnalysisChart,
  LikesViewsComparisonChart,
} from "@/components/dashboard/charts";

export default function Dashboard() {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventData = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsRef = ref(database, "events");
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const events = snapshot.val();
        const eventArray = Object.keys(events).map((key) => ({
          id: key,
          ...events[key],
        }));
        setEventData(eventArray);
      } else {
        setError("No events data found");
      }
    } catch (err) {
      setError("Failed to fetch event data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl w-full">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-in slide-in-from-top duration-1000">
            Experience the Magic of Events! ✨
          </h1>
          <p className="text-xl text-muted-foreground animate-in slide-in-from-bottom duration-1000">
            Transform your event data into stunning insights 🎭 Discover trends,
            track success, and elevate your events! 🚀
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <Button
            onClick={fetchEventData}
            disabled={loading}
            className="group bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 text-white px-8 py-6 rounded-lg text-lg font-semibold flex items-center gap-3 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
          >
            {loading ? (
              <>
                <div className="animate-spin">🎪</div>
                Loading Magic...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                Reveal Event Insights! 🎯
              </>
            )}
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-950/50 text-red-400 border-red-800 animate-in fade-in-50">
            {error}
          </Card>
        )}

        {eventData && (
          <>
            <div className="mb-6 animate-in fade-in-50 duration-500">
              <EventStats data={eventData} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-500 mb-6">
              <CategoryChart data={eventData} />
              <EventTypeChart data={eventData} />
              <PricingAnalysisChart data={eventData} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-700">
              <AttendeeChart data={eventData} />
              <LikesViewsComparisonChart
                data={eventData}
                className="md:col-span-2 lg:col-span-2"
              />
            </div>
          </>
        )}

        {!eventData && !error && (
          <div className="text-center text-muted-foreground animate-pulse">
            <p className="text-lg">
              🎪 Click the button above to discover amazing event insights! 🎪
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
