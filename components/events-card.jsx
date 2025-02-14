"use client";
import { Heart, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EventCard({ id, title, description, image, date, time, likes, venue, price, attendees }) {
    return (
        <Card className="overflow-hidden border border-purple-500/30 shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-xl">
            <Link href={`/event/${id}`} className="block">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                    <img
                        src={image || "/placeholder.svg"}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
                        {price}
                    </div>
                </div>
            </Link>
            <CardContent className="p-5">
                <h3 className="font-semibold text-xl text-white mb-2 truncate">{title}</h3>
                <p className="text-sm text-blue-500 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>
                <div className="flex items-center text-sm text-white mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="truncate w-full">{venue}</span>
                </div>
                <div className="flex items-center text-sm text-white">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span>{attendees} attending</span>
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-white">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        {date}
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {time}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 hover:scale-110"
                >
                    <Heart className="h-5 w-5" />
                    <span className="ml-1 text-base">{likes}</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
