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
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TimetableChangeRequest } from "@/types/api";

const AdminRequests = () => {
    const [requests, setRequests] = useState<TimetableChangeRequest[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get("/timetable-change-requests");
                setRequests(res.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };
        fetchRequests();
    }, []);

    const handleRequestUpdate = async (id: number, status: string) => {
        try {
            await api.put(`/timetable-change-requests/${id}`, { status });
            setRequests(
                requests.map((r) => (r.id === id ? { ...r, status } : r))
            );
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

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
                                <TableHead>Message</TableHead>
                                <TableHead>Date/Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">
                                        {request.user.name}
                                    </TableCell>
                                    <TableCell>{request.message}</TableCell>
                                    <TableCell>
                                        {formatDateTime(request.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(request.status)}
                                        >
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {request.status === "pending" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() =>
                                                        handleRequestUpdate(
                                                            request.id,
                                                            "approved"
                                                        )
                                                    }
                                                    size="sm"
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleRequestUpdate(
                                                            request.id,
                                                            "rejected"
                                                        )
                                                    }
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminRequests;
