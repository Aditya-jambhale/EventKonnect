'use client'

import { useRef, useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { EventCard } from '@/components/events-card'
import { Button } from '@/components/ui/button'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react'
import 'react-day-picker/dist/style.css'
import { database, ref,get } from '@/lib/firebase'

const categories = ['All', 'Tech', 'Business', 'Marketing']

export default function Home() {
  const scrollContainerRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [userGroups, setUserGroups] = useState([])
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch data from Firebase
  useEffect(() => {
    if (!isClient) return; // Only fetch data on client-side

    const fetchData = async () => {
      try {
        const eventsSnapshot = await get(ref(database, 'events'))
        const groupsSnapshot = await get(ref(database, 'userGroups'))

        if (eventsSnapshot.exists()) {
          setEvents(Object.values(eventsSnapshot.val()))
        }
        if (groupsSnapshot.exists()) {
          setUserGroups(Object.values(groupsSnapshot.val()))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [isClient])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // Return null or loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 lg:px-8">
          <div className="text-center text-gray-400">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Sidebar with Calendar and Groups */}
          <aside className="space-y-8">
            {/* Date Picker Header */}
            <div className="flex items-center justify-between bg-background p-4 rounded-lg shadow-md border border-gray-300">
              <span className="text-sm font-medium text-white">
                {selectedDate ? selectedDate.toDateString() : 'Select Date'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-white border-gray-400 hover:bg-gray-800"
              >
                <Calendar className="w-4 h-4" />
                Pick Date
              </Button>
            </div>

            {/* Calendar */}
            <div className="rounded-lg bg-background p-4 shadow-md border border-white">
              <DayPicker
                showOutsideDays
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day: "hover:bg-gray-800 rounded-md"
                }}
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4 text-white" />,
                  IconRight: () => <ChevronRight className="h-4 w-4 text-white" />,
                }}
              />
            </div>

            {/* User Groups */}
            <div className="rounded-lg border border-white p-6 bg-background">
              <h2 className="flex items-center font-semibold mb-6 text-white text-lg">
                <Users className="h-5 w-5 mr-2 text-white" />
                Your Groups
              </h2>
              {userGroups.length > 0 ? (
                <div className="space-y-6">
                  {userGroups.map((group) => (
                    <div 
                      key={group.id} 
                      className="flex items-center gap-4 hover:bg-gray-800 p-3 rounded-lg transition-colors"
                    >
                      <img
                        src={group.image || '/placeholder.svg'}
                        alt={group.name}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-white mb-1">{group.name}</h3>
                        <p className="text-sm text-gray-300">
                          {group.members} members
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No groups joined yet</p>
              )}
            </div>
          </aside>

          {/* Events Section */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="font-semibold text-2xl text-white">
                🌟 Epic events coming your way! 🌟
              </h2>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={scrollLeft} 
                  className="text-white border-gray-400 hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={scrollRight} 
                  className="text-white border-gray-400 hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-2 px-2"
            >
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant="outline" 
                  className="shrink-0 text-white border-gray-400 hover:bg-gray-800 px-6"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              ) : (
                <p className="text-center text-gray-400">Loading events...</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}