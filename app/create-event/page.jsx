"use client"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function CreateEventLanding() {
    const [mounted, setMounted] = useState(false)

    // Ensures the component is only rendered on the client-side
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null // Prevents hydration mismatch

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container px-4 py-12">
                {/* Title Section */}
                <div className="text-center space-y-2 mb-12">
                    <h1 className="text-4xl font-bold ">
                        🎉 Now Events Creation Got More Easier! 🚀
                    </h1>
                    <p className="text-white">
                        Explore our new feature to create an event with AI 🤖
                    </p>
                </div>

                {/* Event Creation Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Create Event Manually */}
                    <div className="p-6 md:p-8 rounded-xl border border-purple-500/20  bg-background">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <h2 className="text-2xl font-semibold text-white">📝 Create Event Manually</h2>
                            <Button
                                variant="outline"
                                className="border-purple-500 text-white hover:bg-purple-500/20 transition-all"
                                onClick={() => window.open("/admin", "_blank")}
                            >
                                ➕ Create Event
                            </Button>
                        </div>
                    </div>

                    {/* Create Event With AI */}
                    <div className="p-6 md:p-8 rounded-xl border border-purple-500/20 bg-background">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <h2 className="text-2xl font-semibold text-white">🤖 Create Event With AI</h2>
                            <Button
                                variant="outline"
                                className="border-purple-500 text-white hover:bg-purple-500/20 transition-all"
                                onClick={() => window.open("/admin", "_blank")}
                            >
                                🚀 Create Event
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
