"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { Alert } from '@/components/ui/alert';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import InputChat from '@/components/features/inputChat';

type Contact = {
    id: string;
    content: string;
    image: string;
    createAt: string;
    sender_name: string;
    note: string;

};
interface Painting {
    id: string;
    image: string;
    status: 'Đang xử lý' | 'Hoàn thành' | 'Đã huỷ' | 'Chờ xử lý';
    name: string;
    size_width: number;
    size_height: number;
    picture_frame: boolean;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    userName: string;
}
export default function ViewDetailCustomPainting() {
    const [painting, setPainting] = useState<Painting | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [note, setNote] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
    const [takeUserId, setTakeUserId] = useState("");
    const [takecustompainting, setTakeCustompainting] = useState("");
    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        if (!id) return;
        axios.get(`http://localhost:5000/api/admin/custompainting/${id}`)
            .then((response) => {
                const paintingData = response.data.data[0];
                setPainting(paintingData);
                setSelectedPainting(paintingData);
                setTakeUserId(paintingData.userId);  // Gán giá trị userId
                // fetchUserInfo(paintingData.userId);
                setTakeCustompainting(paintingData.id);  // Gán giá trị customPaintingId
                setLoading(false);
            })
            .catch((err) => {
                setError('Không thể tải thông tin yêu cầu');
                setLoading(false);
            });
    }, []);
    const fetchContacts = async (userId: string, custompaintingId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/contact/${userId}/${custompaintingId}`);
            console.log(response.data); // Kiểm tra dữ liệu trả về
            const contactsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            console.log(contactsData); // Kiểm tra dữ liệu đã được chuẩn hóa thành mảng chưa
            setContacts(contactsData);  // Lưu vào state
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setContacts([]); // Set mảng rỗng nếu có lỗi
        }
    };
    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}`);
            console.log(response.data.data);
            setUserInfo(response.data.data[0]); // Đảm bảo response.data.data chứa thông tin người dùng
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };
    useEffect(() => {
        if (!painting) return;
        fetchContacts(painting.userId, painting.id);
        fetchUserInfo(painting.userId);
    }, [painting]);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNote(event.target.value);
    };
    const handleSubmitContact = async () => {
        if (!note) {
            alert("Note không được để trống");
            return;
        }
        let senderName = "";
        console.log(userInfo);
        if (userInfo) {
            // Nếu userInfo có và là customer, lưu tên customer
            if (userInfo.roleName === "customer") {
                senderName = `${userInfo.firstname} ${userInfo.lastname}`;
                console.log(senderName);
            } else {
                // Nếu không, mặc định là admin
                senderName = "Admin";
            }
        } else {
            senderName = "Admin"; // Nếu không có thông tin user, mặc định là admin
        }

        const formData = new FormData();
        if (file) {
            formData.append("image", file); // Thêm file ảnh nếu có
        }
        formData.append("note", note); // Thêm note
        formData.append("userId", takeUserId); // Lấy userId từ state
        formData.append("customPaintingId", takecustompainting); // Lấy customPaintingId từ state
        formData.append("sender_name", senderName); // Thêm sender_name vào formData

        try {
            const response = await fetch("http://localhost:5000/api/admin/contact/create", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                alert("Contact created successfully!");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error creating contact:", error);
            alert("Đã xảy ra lỗi khi tạo contact");
        }
    };
    const getStatusInVietnamese = (status: string) => {
        switch (status) {
            case 'processing':
                return 'Đang xử lý';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã huỷ';
            case 'pending':
                return 'Chờ xử lý';
            default:
                return status; // Nếu không có trạng thái phù hợp, giữ nguyên
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing':
                return 'bg-yellow-500'; // Màu vàng
            case 'completed':
                return 'bg-green-500'; // Màu xanh lá
            case 'cancelled':
                return 'bg-red-500'; // Màu đỏ
            case 'pending':
                return 'bg-blue-500'; // Màu xanh dương
            default:
                return 'bg-gray-500'; // Màu xám
        }
    };
    if (loading) return <p>Đang tải...</p>;
    if (error) return <Alert className="w-full mb-4">{error}</Alert>;

    return (
        <div className="p-5 bg-white shadow rounded-lg mt-36">

            <h1 className="text-2xl font-bold mb-4">Chi tiết yêu cầu đặt vẽ tranh </h1>
            <Card className="mb-4 p-4 border rounded-lg">

                <p><strong>Mã đơn:</strong> {painting?.id}</p>
                <p><strong>Tên:</strong> {painting?.name}</p>
                <p><strong>Tên khách hàng: </strong>{painting?.userName} </p>
            </Card>

            <h2 className="text-xl font-bold mt-5 mb-3">Phản hồi</h2>
            <div className="space-y-4">
                {selectedPainting && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-1 rounded-xl">

                            <div className="space-y-4">
                                <p><strong>Thông tin tranh</strong></p>
                                <p><strong>Name:</strong> {selectedPainting.name}</p>
                                <p><strong>Size:</strong> {selectedPainting.size_width} x {selectedPainting.size_height} cm</p>
                                <p><strong>Picture Frame:</strong> {selectedPainting.picture_frame || "No frame"}</p>
                                <p><strong>Note:</strong> {selectedPainting.note || "No notes"}</p>
                                <p><strong>Trạng thái đơn:</strong>
                                    <span className={`text-white px-3 py-1 rounded-full ${getStatusColor(selectedPainting.status)}`}>
                                        {getStatusInVietnamese(selectedPainting.status)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <ScrollArea className="h-[200px]  md:h-[500px] w-[100%] rounded-md border">
                    <div className="p-4 space-y-4">
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <div key={contact.id} className="p-4 bg-gray-100 rounded-md shadow">
                                    <p className={`font-bold text-[10px] ${contact.sender_name === 'Admin' ? 'text-red-500' : 'text-blue-500'}`}>{contact.sender_name}</p>
                                    <p><strong>Note:</strong> {contact.note}</p>
                                    <p><strong>Date:</strong> {new Date(contact.createAt).toLocaleString()}</p>
                                    {contact.image && (
                                        <Image
                                            src={`/images/${contact.image}`}
                                            alt="Contact Image"
                                            width={100}
                                            height={100}
                                            className="rounded-md mt-5"
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No contacts found</p>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <InputChat
                note={note}
                handleFileChange={handleFileChange}
                handleNoteChange={handleNoteChange}
                handleSubmitContact={handleSubmitContact}
            />
        </div>
    );
}
