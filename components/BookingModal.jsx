import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { database, ref, update, get, auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import PaymentForm from "./PaymentForm";

export default function BookingModal({ event, isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const { toast } = useToast();

    const handleBooking = async (isPaid = false) => {
        if (!auth.currentUser) return;

        setIsLoading(true);
        try {
            const eventRef = ref(database, `events/${event.id}`);
            const userRef = ref(database, `users/${auth.currentUser.uid}`);
            
            // Fetch event and user data
            const [eventSnapshot, userSnapshot] = await Promise.all([get(eventRef), get(userRef)]);
            const eventData = eventSnapshot.val();
            const userData = userSnapshot.val() || {};

            // Check if user is already registered
            if (eventData.attendees && eventData.attendees[auth.currentUser.uid]) {
                toast({
                    variant: "destructive",
                    title: "Already Registered",
                    description: "You have already registered for this event.",
                });
                setIsLoading(false);
                return;
            }

            // Check if spots are available
            if (eventData.currentAttendees >= eventData.maxAttendees) {
                toast({
                    variant: "destructive",
                    title: "Event Full",
                    description: "No spots left for this event.",
                });
                setIsLoading(false);
                return;
            }

            // Update event and user data
            const updates = {};
            updates[`events/${event.id}/currentAttendees`] = eventData.currentAttendees + 1;
            updates[`events/${event.id}/attendees/${auth.currentUser.uid}`] = true;

            // Update user's booked events
            const bookedEvents = userData.bookedEvents ? [...userData.bookedEvents, event.id] : [event.id];
            updates[`users/${auth.currentUser.uid}/bookedEvents`] = bookedEvents;

            await update(ref(database), updates);

            toast({
                title: "Success!",
                description: isPaid
                    ? "Payment successful and you're registered for the event."
                    : "You're registered for the event.",
            });
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to register. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Your Spot</DialogTitle>
                </DialogHeader>

                {showPayment ? (
                    <PaymentForm
                        amount={parseInt(event.price)}
                        onSuccess={() => handleBooking(true)}
                        onCancel={() => setShowPayment(false)}
                    />
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">Event Details</h3>
                            <p className="text-sm text-muted-foreground">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                                Available spots: {Math.max(0, event.maxAttendees - event.currentAttendees)}
                            </p>
                            <p className="text-lg font-semibold">
                                {event.isFreeEvent ? "Free Entry" : `Price: ₹${event.price}`}
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={event.isFreeEvent ? () => handleBooking(false) : () => setShowPayment(true)}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {event.isFreeEvent ? "Confirm Registration" : "Proceed to Payment"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
