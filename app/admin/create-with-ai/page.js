"use client";
import { useEffect, useState } from "react";
import { CreateEventAIForm } from "@/components/create-event-ai-form";
import { EventFormAI } from "@/components/create-event-form-AI";

const CreateEventPage = () => {
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleGenerateEvent = async (eventTitle) => {
        try {
            const response = await fetch("/api/admin/create-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: eventTitle }), // Send title in request body
            });

            if (!response.ok) throw new Error("Failed to fetch event details");

            const { data } = await response.json();
            setEventDetails(data); // Store fetched data in state
            setShowCreateEventForm(true);
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    };

    return (
        <div className="relative w-full h-screen">
            {!showCreateEventForm ? (
                <CreateEventAIForm onGenerate={handleGenerateEvent} />
            ) : (
                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Create New Event with AI</h1>
                        <p className="text-gray-500">
                            Fill in the details below to create a new event.
                        </p>
                    </div>
                    {eventDetails && <EventFormAI eventDetails={eventDetails} />}
                </div>
            )}
        </div>
    );
};

export default CreateEventPage;
