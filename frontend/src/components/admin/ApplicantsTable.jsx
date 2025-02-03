import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '../ui/dialog';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const navigate = useNavigate();
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [dialogOpen, setDialogOpen] = useState({});
    const [tokens, setTokens] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleViewClick = (applicantId) => {
        setDialogOpen(prev => ({ ...prev, [applicantId]: true }));
    };

    const handleBuyTokens = (applicantId) => {
        setTokens(prev => ({ ...prev, [applicantId]: true }));
        toast.success("Tokens purchased successfully!");
    };

    const filteredApplicants = applicants?.applications?.filter(item =>
        item?.applicant?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.applicant?.profile?.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item?.applicant?.addressdetails?.city?.toLowerCase().includes(searchQuery.toLowerCase())||
        item?.applicant?.addressdetails?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.applicant?.addressdetails?.district?.toLowerCase().includes(searchQuery.toLowerCase())
        
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search by location or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApplicants?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{tokens[item._id] ? item?.applicant?.email : "Hidden"}</TableCell>
                            <TableCell>{tokens[item._id] ? item?.applicant?.phoneNumber : "Hidden"}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => handleViewClick(item._id)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                            <Eye className='w-4' />
                                            <span>View</span>
                                        </div>
                                        {shortlistingStatus.map((status, index) => (
                                            <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                            
                            <Dialog open={dialogOpen[item._id] || false} onOpenChange={(open) => setDialogOpen(prev => ({ ...prev, [item._id]: open }))}>
                                <DialogContent>
                                    <DialogHeader>
                                        {tokens[item._id] ? "Applicant Details" : "Buy Tokens to View Details"}
                                    </DialogHeader>
                                    {tokens[item._id] ? (
                                        <div>
                                            <p><strong>Email:</strong> {item?.applicant?.email}</p>
                                            <p><strong>Phone:</strong> {item?.applicant?.phoneNumber}</p>
                                        </div>
                                    ) : (
                                        <p>You need to purchase tokens to view this applicant's details.</p>
                                    )}
                                    <DialogFooter>
                                        {!tokens[item._id] && <Button onClick={() => handleBuyTokens(item._id)}>Buy Tokens</Button>}
                                        <Button variant="outline" onClick={() => setDialogOpen(prev => ({ ...prev, [item._id]: false }))}>Close</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
