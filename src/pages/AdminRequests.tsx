import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockTimetableChangeRequests, getUserById } from "@/data/mockData";
import { Calendar, Clock, MessageSquare } from "lucide-react";

const AdminRequests = () => {
    const formatDateTime = (dateTime: string) => {
        return (
            new Date(dateTime).toLocaleDateString() +
            " " +
            new Date(dateTime).toLocaleTimeString()
        );
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "pending":
                return "default";
            case "approved":
                return "default";
            case "rejected":
                return "destructive";
            default:
                return "default";
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Timetable Change Requests
                </h1>
                <p className="text-xl text-gray-600">
                    Review and manage student timetable change requests
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Change Requests</CardTitle>
                    <CardDescription>
                        Students request changes to their existing timetables
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Generated Timetable</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Date/Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTimetableChangeRequests.map((request) => {
                                const user = getUserById(request.userId);
                                const timetable = JSON.parse(
                                    request.generatedTimetable
                                );

                                return (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">
                                            {user?.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                {timetable
                                                    .slice(0, 2)
                                                    .map(
                                                        (
                                                            item: any,
                                                            index: number
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="text-sm text-gray-600"
                                                            >
                                                                {item.subject} (
                                                                {item.section})
                                                                - {item.day}{" "}
                                                                {item.time}
                                                            </div>
                                                        )
                                                    )}
                                                {timetable.length > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{timetable.length - 2}{" "}
                                                        more classes
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {request.message ? (
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm truncate max-w-[200px]">
                                                        {request.message}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    No message
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">
                                                    {formatDateTime(
                                                        request.dateTime
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusVariant(
                                                    request.status
                                                )}
                                                className="capitalize"
                                            >
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {request.status ===
                                                    "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 border-green-600"
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-600"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminRequests;
