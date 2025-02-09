"use client"
import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import { events, userGroups } from "@/data/events"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight, Calendar, Users } from "lucide-react"

const categories = ["All", "Tech", "Business", "Marketing"]

export default function Home() {
  const scrollContainerRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState()

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-2xl py-6 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar with Calendar and Groups */}
          <aside className="space-y-6 w-full max-w-sm mx-auto md:mx-0">
            {/* Date Picker Header */}
            <div className="flex items-center justify-between bg-card p-3 rounded-lg shadow-md">
              <span className="text-sm font-medium">
                {selectedDate ? selectedDate.toDateString() : "Select Date"}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Pick Date
              </Button>
            </div>

            {/* Responsive Calendar */}
            <div className="rounded-lg bg-card p-4 shadow-md">
              <DayPicker
                showOutsideDays
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4" />, 
                  IconRight: () => <ChevronRight className="h-4 w-4" />, 
                }}
              />
            </div>

            {/* User Groups */}
            <div className="rounded-lg border border-purple-500/20 p-7">
              <h2 className="flex items-center font-semibold mb-4">
                <Users className="h-4 w-5 mr-2" />
                Your Groups
              </h2>
              {userGroups.length > 0 ? (
                <div className="space-y-4">
                  {userGroups.map((group) => (
                    <div key={group.id} className="flex items-center gap-3">
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="rounded-full w-10 h-10"
                      />
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {group.members} members
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No groups joined yet
                </p>
              )}
            </div>
          </aside>

          {/* Events Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="font-semibold text-xl text-center sm:text-left">
                🌟 Epic events coming your way! 🌟
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={scrollLeft}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={scrollRight}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            >
              {categories.map((category) => (
                <Button key={category} variant="outline" className="shrink-0">
                  {category}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}