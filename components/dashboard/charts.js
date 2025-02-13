import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, MapPin, Heart } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function EventStats({ data }) {
    const stats = Object.values(data).reduce((acc, event) => {
        return {
            totalAttendees: acc.totalAttendees + event.attendees,
            totalLikes: acc.totalLikes + event.likes,
            uniqueCities: [...acc.uniqueCities, event.city.toLowerCase()],
            totalEvents: acc.totalEvents + 1
        };
    }, {
        totalAttendees: 0,
        totalLikes: 0,
        uniqueCities: [],
        totalEvents: 0
    });

    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAttendees}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cities</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{new Set(stats.uniqueCities).size}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLikes}</div>
                </CardContent>
            </Card>
        </div>
    );
}

export function CategoryChart({ data }) {
    const categoryData = Object.values(data).reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Event Categories</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function AttendeeChart({ data }) {
    const chartData = Object.values(data).map(event => ({
        name: event.title.substring(0, 20) + "...",
        attendees: event.attendees
    }));

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Attendees by Event</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="attendees" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function PriceChart({ data }) {
    const chartData = Object.values(data).map(event => ({
        price: parseInt(event.price.replace('₹', '').replace(',', '')),
        attendees: event.attendees,
        name: event.title
    }));

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Price vs Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="price" name="Price (₹)" />
                            <YAxis type="number" dataKey="attendees" name="Attendees" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Events" data={chartData} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function LikesChart({ data, className }) {
    const chartData = Object.values(data)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(event => ({
            date: event.date,
            likes: event.likes,
            name: event.title
        }));

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Likes Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="likes" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
