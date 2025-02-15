"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database, ref, get} from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

// async function fetchEvents() {
//     const eventsRef = ref(database, "events");
//     const snapshot = await get(eventsRef);
//     const events = snapshot.val();
//     return Object.values(events || []);
// }
const fetchEvents = async () => {
  const eventsRef = ref(database, "events");
  const auth = getAuth();
  const user = auth.currentUser;
  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const allEvents = snapshot.val();
      // Manually filter events for the current user
      const filteredEvents = Object.values(allEvents).filter(
        (event) => event.organizer?.uid === user.uid
      );
    //   console.log(filteredEvents);
      return filteredEvents;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true);
    // }, []);

    // useEffect(() => {
    //     if (!isClient) return;
        
    //     async function loadEvents() {
    //         const eventData = await fetchEvents();
    //         setEvents(eventData);
    //     }
    //     loadEvents();
    // }, [isClient]);
    useEffect(() => {
      setIsClient(true);

      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          fetchEvents(currentUser).then(setEvents).catch(console.error);
        }
      });

      return () => unsubscribe();
    }, []);

    const checklist = [
        "Fill profile",
        "bank details",
        "And lastly,Organize Your Event"
    ];

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Welcome Section */}
            <div className="p-6 space-y-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-400">
                    Welcome to EventKonnect Admin Dashboard
                </h1>

                {/* Checklist Card */}
                <Card className="bg-gray-900 border-purple-500">
                    <CardContent className="p-6">
                        <h2 className="text-xl text-purple-400 mb-4">Some checklist like</h2>
                        <ul className="space-y-2">
                            {checklist.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-300">
                                    <ChevronRight className="h-4 w-4 text-purple-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/admin/createEvent" className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            Create Event
                        </Button>
                    </Link>
                    <Link href="/admin/create-with-ai" className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            Create with AI
                        </Button>
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gray-900 border-purple-500">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <Calendar className="h-6 w-6 text-purple-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-300">Total Events</p>
                                    <p className="text-2xl font-bold text-white">{events.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Similar cards for other stats... */}
                </div>

                {/* Past Events Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-purple-400">Past events</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card key={event.id} className="bg-gray-900 border-purple-500">
                                <CardContent className="p-0">
                                    <div className="aspect-video relative">
                                        <img
                                            src={event.imageUrl || "/placeholder.svg"}
                                            alt={event.title}
                                            className="object-cover w-full h-full rounded-t-lg"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                        <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                                        <div className="mt-4 space-y-2 text-gray-300">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                                                {event.date}
                                                <Clock className="h-4 w-4 ml-4 mr-2 text-purple-400" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                                                {event.venue}
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-purple-400" />
                                                    {event.currentAttendees} attendees
                                                </div>
                                                <div className="flex items-center">
                                                    <Heart className="h-4 w-4 mr-2 text-purple-400" />
                                                    {event.likes} likes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}