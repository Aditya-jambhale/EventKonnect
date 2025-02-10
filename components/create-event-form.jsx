"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { database, ref, push, set } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "./ui/toast";

const formSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    image: z.string().url(),
    date: z.date(),
    time: z.string(),
    category: z.string(),
    city: z.string(),
    venue: z.string(),
    price: z.string(),
});

export function CreateEventForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            image: "",
            time: "",
            category: "",
            city: "",
            venue: "",
            price: "",
        },
    });

    async function onSubmit(values) {
        try {
            setLoading(true);
            const eventsRef = ref(database, "events");
            const newEventRef = push(eventsRef);

            const eventData = {
                ...values,
                id: Date.now(),
                date: format(values.date, "MMM dd"),
                likes: 0,
                attendees: 0,
            };

            await set(newEventRef, eventData);

            Toast({
                title: "Event created!",
                description: "Your event has been successfully created.",
            });

            router.push("/dashboard/events");
            router.refresh();
        } catch (error) {
            Toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder="AI & Machine Learning Summit 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Join leading experts in AI and ML for a day of insights and networking"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
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
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="9:00 AM" {...field} />
                                        <Clock className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tech" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mumbai" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Venue</FormLabel>
                                <FormControl>
                                    <Input placeholder="World Trade Centre, Mumbai" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="₹2999" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Event"}
                </Button>
            </form>
        </Form>
    );
}
