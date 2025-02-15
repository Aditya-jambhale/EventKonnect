"use client";

import { Heart, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EventCard({
  id,
  title,
  description,
  imageUrl,
  date,
  time,
  likes,
  venue,
  price,
  currentAttendees,
  maxAttendees,
}) {
  const router = useRouter();

  // Function to handle card click
  const handleCardClick = (eventId) => {
    router.push(`/events/${id}`);
  };

  return (
    <Card
      className="overflow-hidden border-purple-500/20 transition-all hover:border-purple-500/40 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto cursor-pointer"
      onClick={() => handleCardClick()}
    >
      <div className="aspect-video relative">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-sm text-white">{price}</div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="truncate w-full overflow-hidden">{venue}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4 mr-1" />
          <span>{currentAttendees} attending</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{maxAttendees} Total Spots</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {time}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-purple-500 mt-2 sm:mt-0">
          <Heart className="h-5 w-5" />
          <span className="ml-1">{likes}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
