import EventForm from "@/components/create-event-form-manual"

export default function CreateEventPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Create New Event</h1>
                <p className="text-gray-500">Fill in the details below to create a new event.</p>
            </div>
            <EventForm />
        </div>
    )
}
