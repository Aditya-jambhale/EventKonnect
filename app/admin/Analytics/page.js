"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MapPin, Eye } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { database, ref, get } from "@/lib/firebase";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on the client using useEffect
  useEffect(() => {
    async function fetchData() {
      const eventsRef = ref(database, "events");
      const snapshot = await get(eventsRef);

      let data = [];
      if (snapshot.exists()) {
        const events = snapshot.val();
        data = Object.keys(events).map((key) => ({
          id: key,
          ...events[key],
        }));
        console.log("Fetched events:", data);
      }
      setEventData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Overall event statistics */}
      <EventStats data={eventData} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart data={eventData} />
        <AttendeeChart data={eventData} />
        <EventTypeChart data={eventData} />
        <PricingAnalysisChart data={eventData} />
        <LikesViewsComparisonChart data={eventData} />
      </div>
    </div>
  );
}

export function EventStats({ data = [] }) {
  const stats = data.reduce(
    (acc, event) => ({
      totalAttendees: acc.totalAttendees + (event.currentAttendees || 0),
      totalLikes: acc.totalLikes + (event.likes || 0),
      uniqueCities: [...acc.uniqueCities, event.city?.toLowerCase?.() || ""],
      totalEvents: acc.totalEvents + 1,
      totalViews: acc.totalViews + (event.views || 0),
    }),
    {
      totalAttendees: 0,
      totalLikes: 0,
      uniqueCities: [],
      totalEvents: 0,
      totalViews: 0,
    }
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAttendees}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Unique Cities</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Set(stats.uniqueCities.filter(Boolean)).size}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CategoryChart({ data = [] }) {
  const categoryData = data.reduce((acc, event) => {
    if (event.category) {
      const category =
        event.category.charAt(0).toUpperCase() + event.category.slice(1);
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} events`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendeeChart({ data = [] }) {
  const sortedData = [...data]
    .sort((a, b) => (b.currentAttendees || 0) - (a.currentAttendees || 0))
    .slice(0, 5);

  const chartData = sortedData.map((event) => ({
    name: event.title
      ? event.title.length > 20
        ? event.title.substring(0, 20) + "..."
        : event.title
      : "Unknown",
    attendees: event.currentAttendees || 0,
    maxAttendees: event.maxAttendees || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Events by Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="attendees"
                name="Current Attendees"
                fill="#8884d8"
              />
              <Bar
                dataKey="maxAttendees"
                name="Maximum Capacity"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventTypeChart({ data = [] }) {
  const eventTypeData = data.reduce((acc, event) => {
    if (event.eventType) {
      const eventType =
        event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1);
      acc[eventType] = (acc[eventType] || 0) + 1;
    } else if (event.venueType) {
      const venueType =
        event.venueType.charAt(0).toUpperCase() + event.venueType.slice(1);
      acc[venueType] = (acc[venueType] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(eventTypeData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} events`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function PricingAnalysisChart({ data = [] }) {
  const freeEvents = data.filter(
    (event) => event.isFreeEvent || event.price === "0"
  ).length;
  const paidEvents = data.length - freeEvents;

  const chartData = [
    { name: "Free Events", value: freeEvents },
    { name: "Paid Events", value: paidEvents },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Pricing Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#FF5722" />
              </Pie>
              <Tooltip formatter={(value) => [`${value} events`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function LikesViewsComparisonChart({ data = [] }) {
  const sortedData = [...data]
    .sort(
      (a, b) =>
        (b.likes || 0) + (b.views || 0) - ((a.likes || 0) + (a.views || 0))
    )
    .slice(0, 5);

  const chartData = sortedData.map((event) => ({
    name: event.title
      ? event.title.length > 15
        ? event.title.substring(0, 15) + "..."
        : event.title
      : "Unknown",
    likes: event.likes || 0,
    views: event.views || 0,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 5 Events: Likes vs Views</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="Likes" fill="#FF6384" />
              <Bar dataKey="views" name="Views" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
