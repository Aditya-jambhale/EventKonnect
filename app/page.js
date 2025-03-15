'use client'

import { useRef, useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { EventCard } from '@/components/events-card'
import { Button } from '@/components/ui/button'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react'
import 'react-day-picker/dist/style.css'
import { database, ref, get } from '@/lib/firebase'
import Image from 'next/image'

const categories = ['All', 'Tech', 'Cultural & Entertainment', 'Business', 'Sports', 'Community']

const GroupImage = ({ src, alt }) => {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
        <Users className="w-6 h-6 text-white" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setImageError(true)}
      sizes="(max-width: 48px) 100vw, 48px"
    />
  )
}

export default function Home() {
  const scrollContainerRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [userGroups, setUserGroups] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Fetch events & groups from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsSnapshot = await get(ref(database, 'events'))
        const groupsSnapshot = await get(ref(database, 'userGroups'))

        if (eventsSnapshot.exists()) {
          setEvents(Object.values(eventsSnapshot.val()))
        }
        if (groupsSnapshot.exists()) {
          const groupsData = Object.values(groupsSnapshot.val())
          setUserGroups(groupsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })

  // Filter events based on category
  const filteredEvents = selectedCategory === 'All' ? events : events.filter(event => event.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
    <Header/>
      <main className="container mx-auto py-8 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Date Picker */}
            <div className="flex items-center justify-between bg-background p-4 rounded-lg shadow-md border border-gray-300 transition-all duration-300 hover:shadow-lg hover:border-purple-500">
              <span className="text-sm font-medium text-white">
                {selectedDate ? selectedDate.toDateString() : 'Select Date'}
              </span>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-gray-400 hover:bg-purple-700 transition">
                <Calendar className="w-4 h-4" />
                Pick Date
              </Button>
            </div>

            {/* Calendar */}
            <div className="rounded-lg bg-background p-4 shadow-md border border-white transition-all duration-300  hover:shadow-lg hover:border-purple-500">
              <DayPicker
                showOutsideDays
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                classNames={{
                  day_selected: "bg-purple-600 text-white",
                  day_today: "bg-purple-500 text-white",
                  day: "hover:bg-purple-700 hover:text-purple-800 rounded-md transition-all"
                }}
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4 text-white" />,
                  IconRight: () => <ChevronRight className="h-4 w-4 text-white" />
                }}
              />
            </div>

            {/* Your Groups Section */}
            <div className="rounded-lg border border-white p-6 bg-background transition-all duration-300 hover:shadow-lg hover:border-purple-500">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-500" />
                <h2 className="font-semibold text-white text-lg">Your Groups</h2>
              </div>
              <div className="space-y-4">
                {userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <div key={group.id} className="flex items-center gap-3 hover:bg-purple-700 p-2 rounded-lg transition-all cursor-pointer">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <GroupImage src={group.image} alt={group.name} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-medium truncate">{group.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {group.members.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No groups joined yet</p>
                )}
              </div>
            </div>
          </aside>

          {/* Events Section */}
          <section className="space-y-8">
            {/* Categories */}
            <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-2 px-2">
              {categories.map(category => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="shrink-0 text-white bg-gray-900 border-white hover:bg-purple-700 transition-all px-6"
                >
                  {category}
                </Button>
              ))}
            </div>


            {/* Events Grid */}
            <div className="flex justify-center items-center min-h-[300px]">
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      <EventCard {...event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl">📅😔</span>
                  <p className="text-white text-lg md:text-xl font-semibold mt-4">
                    Oops! No events scheduled at the moment.
                  </p>
                  <p className="text-gray-400 text-sm md:text-base">
                    Check back later for exciting updates! 🚀
                  </p>
                </div>
              )}
            </div>

          </section>
        </div>
      </main>
    </div>
  )
}