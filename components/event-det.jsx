'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { database, ref, get } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react' // Import the cross icon

export default function EventDetails({event}) {
  const { id } = useParams()
//   const [event, setEvent] = useState(null)
  const router = useRouter()

  

  if (!event) {
    return <div>Loading...</div>
  }

  // Function to handle closing the event details page
  const handleClose = () => {
    router.push('/') // Navigate back to the home page
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 lg:px-8">
        {/* Cross Button at the top right */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Event Details Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <Image
                src={event.image}
                alt={event.title}
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-xl font-semibold mb-2">{event.subtitle}</h2>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="mb-4">
                <p className="text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-500">Time: {event.time}</p>
                <p className="text-gray-500">Location: {event.location}</p>
                <p className="text-gray-500">Price: {event.price}</p>
              </div>
              <div className="flex gap-4">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Attend Event
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-100">
                  Save for later
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Attendees</h3>
            <div className="flex gap-4">
              {event.attendees?.map((attendee, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={attendee.avatar}
                    alt={attendee.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="text-gray-700">{attendee.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}