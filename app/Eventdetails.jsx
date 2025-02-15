"use client";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { database, ref, onValue, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { X, CalendarDays, Clock, MapPin, Users, Heart, User, Ticket } from "lucide-react";
import BookingModal from "./BookingModal";
import { useToast } from "@/hooks/use-toast";

export default function EventDetails() {
    const params = useParams();
    const [, setLocation] = useLocation();
    const [event, setEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const eventId = params?.id;
        if (!eventId) return;

        const eventRef = ref(database, `events/${id}`);
        const unsubscribe = onValue(eventRef, (snapshot) => {
            if (snapshot.exists()) {
                setEvent({ id: eventId, ...snapshot.val() });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Event not found",
                });
                setLocation("/");
            }
        });

        return () => unsubscribe();
    }, [params?.id, setLocation, toast]);

    const handleBooking = () => {
        if (!auth.currentUser) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "Please sign in to book tickets",
            });
            return;
        }
        setIsModalOpen(true);
    };

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isFullyBooked = event.currentAttendees >= event.maxAttendees;

    return (
        <div className="relative min-h-screen bg-background">
            <button
                onClick={() => setLocation("/")}
                className="fixed top-6 right-6 p-3 rounded-full bg-black/80 text-white hover:bg-black/90 shadow-lg backdrop-blur-sm transition-all z-50"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[60vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{
                        backgroundImage: `url(${event.imageUrl})`,
                        filter: "brightness(0.9)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="absolute bottom-8 left-6 right-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium text-white">
                                {event.isFreeEvent ? "Free Event" : "Paid Event"}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="prose prose-lg">
                            <h2 className="text-2xl font-semibold mb-6">About the Event</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 rounded-xl bg-card border shadow-lg">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <CalendarDays className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Clock className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">
                                        {event.venue}, {event.city}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Users className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">
                                        {event.currentAttendees}/{event.maxAttendees} spots filled
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Heart className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">{event.likes} likes</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <User className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-lg">
                                        Organized by {event.organizerName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-xl bg-card border shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl font-semibold">Ticket Price</span>
                                <span className="text-3xl font-bold">
                                    {event.isFreeEvent ? "Free" : `₹${event.price}`}
                                </span>
                            </div>
                            <Button
                                className="w-full h-14 text-lg font-medium shadow-lg"
                                onClick={handleBooking}
                                disabled={isFullyBooked}
                                variant={isFullyBooked ? "secondary" : "default"}
                            >
                                <Ticket className="w-6 h-6 mr-2" />
                                {isFullyBooked ? "Sold Out" : "Reserve Your Spot"}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <BookingModal
                    event={event}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
