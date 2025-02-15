"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth"; 
import { database, ref, push, set } from "@/lib/firebase";
import { CalendarIcon, Clock, MapPin, Globe } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    imageUrl: z.string().url("Please enter a valid URL"),
    category: z.string().min(1, "Please select a category"),
    eventType: z.string().min(1, "Please select event type"),
    date: z.date({ required_error: "Please select a date" }),
    time: z.string().min(1, "Please enter a time"),
    maxAttendees: z.string().min(1, "Please enter maximum attendees"),
    venueType: z.enum(["physical", "online"]),
    venue: z.string().optional(),
    city: z.string().optional(),
    platform: z.string().optional(),
    meetingLink: z.string().url().optional(),
    isFreeEvent: z.boolean(),
    price: z.string().optional()
    // organizerName: z.string().min(2, "Please enter organizer name"),
    // organizerContact: z.string().min(10, "Please enter a valid contact number")
});

export default function EventForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            imageUrl: "",
            category: "",
            eventType: "",
            time: "",
            maxAttendees: "",
            venueType: "physical",
            isFreeEvent: false
            // organizerName: "",
            // organizerContact: ""
        }
    });
    const venueType = form.watch("venueType");
    const isFreeEvent = form.watch("isFreeEvent");

    async function onSubmit(values) {
        try {
            setLoading(true);

            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
             throw new Error("User is not authenticated.");
            }

            const eventsRef = ref(database, "events");
            const newEventRef = push(eventsRef);


            const eventData = {
                id: newEventRef.key,
                title: values.title,
                description: values.description,
                imageUrl: values.imageUrl,
                category: values.category,
                eventType: values.eventType,
                date: format(values.date, "yyyy-MM-dd"),
                time: values.time,
                maxAttendees: parseInt(values.maxAttendees),
                venueType: values.venueType,
                ...(values.venueType === "physical" ? { venue: values.venue, city: values.city } : { platform: values.platform, meetingLink: values.meetingLink }),
                isFreeEvent: values.isFreeEvent,
                price: values.isFreeEvent ? "0" : values.price,
                organizer: {uid: user.uid,
                            name: user.displayName,
                            email: user.email
                            },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: "active",
                currentAttendees: 0,
                likes: 0,
                views: 0
            };
            console.log({uid: user.uid,name: user.displayName,email:user.email});
            await set(newEventRef, eventData);
            toast.success("🎉 Event created successfully!");
            form.reset();
            router.refresh();
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("❌ Failed to create event. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <h2 className="text-2xl font-bold">📋 Event Details</h2>

                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Title ✨</FormLabel>
                            <FormControl>
                                <Input placeholder="Tech Conference 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description 📝</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter event description..." className="min-h-[120px]" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Image URL 🖼️</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter image URL..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="eventType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Type 🎯</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="conference">Conference</SelectItem>
                                            <SelectItem value="workshop">Workshop</SelectItem>
                                            <SelectItem value="seminar">Seminar</SelectItem>
                                            <SelectItem value="networking">Networking</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category 📊</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date 📅</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn("w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PPP") :
                                                        <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time ⏰</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="maxAttendees"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Attendees 👥</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="100"
                                        min="1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Venue Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">📍 Venue Details</h2>

                        <FormField
                            control={form.control}
                            name="venueType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Venue Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="physical" id="physical" />
                                                <Label htmlFor="physical">
                                                    Physical <MapPin className="inline h-4 w-4 ml-1" />
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="online" id="online" />
                                                <Label htmlFor="online">
                                                    Online <Globe className="inline h-4 w-4 ml-1" />
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {venueType === "physical" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Venue Name 🏢</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Convention Center" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City 🌆</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mumbai" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="platform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Platform 💻</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Zoom" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="meetingLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meeting Link 🔗</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://zoom.us/j/123456789"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Previous code remains same until Pricing Section */}

                    {/* Pricing Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">💰 Pricing</h2>

                        <FormField
                            control={form.control}
                            name="isFreeEvent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Free Event 🎟️</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Toggle if this is a free event
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {!isFreeEvent && (
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ticket Price 💵</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="₹2999"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    {/* Organizer Details Section */}
                    {/* <div className="space-y-6">
                        <h2 className="text-2xl font-bold">👤 Organizer Details</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="organizerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name 📝</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organizerContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number 📱</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="+91 9876543210"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div> */}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                Creating Event... ⏳
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Create Event 🎉
                            </span>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}