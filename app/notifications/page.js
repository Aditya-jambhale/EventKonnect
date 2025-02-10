import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

const notifications = [
    {
        id: 1,
        title: "New Event Added",
        message: "AI & Machine Learning Summit 2024 has been added to your calendar",
        time: "2 hours ago",
    },
    {
        id: 2,
        title: "Price Drop Alert",
        message: "Prices for Web3 Developer Conference have been reduced",
        time: "5 hours ago",
    },
    {
        id: 3,
        title: "Event Reminder",
        message: "StartUp Networking Mixer starts in 24 hours",
        time: "1 day ago",
    },
];

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container max-w-screen-md py-6">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Notifications
                </h1>
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <Card key={notification.id}>
                            <CardContent className="p-4">
                                <h2 className="font-semibold mb-2">{notification.title}</h2>
                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
