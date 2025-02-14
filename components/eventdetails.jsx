"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const EventDetail = () => {
    const router = useRouter();
    const { id } = router.query; // Get event ID from URL
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const eventRef = doc(db, "events", id);
                const eventSnap = await getDoc(eventRef);
                if (eventSnap.exists()) {
                    setEvent(eventSnap.data());
                } else {
                    console.error("Event not found");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) {
        return <div className="text-center text-white">Loading event details...</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen py-10 px-4 md:px-10 lg:px-20">
            
            {/* Event Image */}
            <div className="w-full flex justify-center">
                <Image 
                    src={event.imageUrl} 
                    alt={event.name} 
                    width={800} 
                    height={400} 
                    className="rounded-lg shadow-lg object-cover w-full max-w-4xl"
                />
            </div>

            {/* Event Name & Basic Info */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h1 id="event-name" className="text-3xl md:text-4xl font-bold text-purple-500">{event.name}</h1>
                <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                    <span id="event-language" className="px-3 py-1 bg-gray-700 rounded-lg text-sm">{event.language}</span>
                    <span id="event-age" className="px-3 py-1 bg-gray-700 rounded-lg text-sm">16+</span>
                    <span id="event-duration" className="px-3 py-1 bg-gray-700 rounded-lg text-sm">{event.duration}</span>
                </div>
            </div>

            {/* Join Event Button */}
            <div className="mt-6 flex justify-center">
                <Button id="join-event-button" className="bg-purple-600 hover:bg-purple-700 transition px-6 py-2 text-lg shadow-lg">
                    Join Event
                </Button>
            </div>

            {/* Date, Location & Price */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div id="event-date" className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
                    <FaCalendarAlt className="text-purple-400 text-2xl mx-auto mb-2" />
                    <p className="text-lg font-semibold">{event.date}</p>
                </div>
                <div id="event-location" className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
                    <FaMapMarkerAlt className="text-purple-400 text-2xl mx-auto mb-2" />
                    <p className="text-lg font-semibold">{event.location}</p>
                </div>
                <div id="event-price" className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
                    <FaDollarSign className="text-purple-400 text-2xl mx-auto mb-2" />
                    <p className="text-lg font-semibold">{event.price}</p>
                </div>
            </div>

            {/* Artist / Event Holder Details */}
            <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
                <div className="flex items-center gap-4">
                    <FaUser className="text-purple-400 text-2xl" />
                    <div>
                        <h3 id="event-host-name" className="text-xl font-semibold">{event.hostName}</h3>
                        <p id="event-host-details" className="text-gray-300">{event.hostDetails}</p>
                    </div>
                </div>
            </div>

            {/* Event Description */}
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
                <h3 className="text-xl font-bold text-purple-500">About Event</h3>
                <p id="event-description" className="mt-2 text-gray-300">{event.description}</p>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
                <h3 className="text-xl font-bold text-purple-500">Terms & Conditions</h3>
                <ul id="event-terms" className="mt-2 text-gray-300 list-disc list-inside">
                    {event.terms.map((term, index) => (
                        <li key={index} className="mt-1">{term}</li>
                    ))}
                </ul>
            </div>

            {/* Join Event Button Again */}
            <div className="mt-10 flex justify-center">
                <Button id="join-event-button-bottom" className="bg-purple-600 hover:bg-purple-700 transition px-6 py-2 text-lg shadow-lg">
                    Join Event
                </Button>
            </div>
        </div>
    );
};

export default EventDetail;