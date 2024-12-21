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

type Contact = {
    id: string;
    content: string;
    image: string;
    createdAt: string;
    sender: string;
};
interface Painting {
    id: string;
    image: string;
    link_image: string;
    name: string;
    size_width: number;
    size_height: number;
    picture_frame: boolean;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    customerName:string;
}
export default function ViewDetailCustomPainting() {
    const [painting, setPainting] = useState<Painting | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [note, setNote] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();

        if (!id) return;
        axios.get(`http://localhost:5000/api/admin/custompainting/${id}`)
            .then((response) => {
                // Lưu trữ chỉ phần tử đầu tiên của ProductDetail
                setPainting(response.data.data[0]);
                setLoading(false);
            })
            .catch((err) => {
                setError('Không thể tải thông tin yêu cầu');
                setLoading(false);
            });

    }, []);
    console.log(painting);
    // Fetch các phản hồi (contact)
    // axios.get(`http://localhost:5000/api/contact/custompainting/${id}`)
    //     .then((response) => {
    //         setContacts(response.data);
    //     })
    //     .catch((err) => {
    //         setError('Không thể tải các phản hồi');
    //     });
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSendResponse = () => {
        // if (!note) {
        //     setError('Vui lòng nhập nội dung phản hồi');
        //     return;
        // }

        // const formData = new FormData();
        // formData.append('note', note);
        // if (image) {
        //     formData.append('image', image);
        // }

        // axios.post(`http://localhost:5000/api/admin/contact/custompainting/${window.location.pathname.split('/').pop()}`, formData)
        //     .then((response) => {
        //         setContacts((prev) => [...prev, response.data]); // Thêm phản hồi mới vào danh sách
        //         setNote('');
        //         setImage(null);
        //     })
        //     .catch((err) => {
        //         setError('Không thể gửi phản hồi');
        //     });
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <Alert className="w-full mb-4">{error}</Alert>;

    return (
        <div className="p-5 bg-white shadow rounded-lg">

            <h1 className="text-2xl font-bold mb-4">Chi tiết yêu cầu đặt vẽ tranh </h1>
            <Card className="mb-4 p-4 border rounded-lg">
                
                <p><strong>Mã đơn:</strong> {painting?.id}</p>
                <p><strong>Tên:</strong> {painting?.name}</p>
                <p><strong>Tên khách hàng: </strong>{painting?.customerName} </p>
            </Card>

            {/* <h2 className="text-xl font-bold mt-5 mb-3">Phản hồi</h2> */}
            <div className="space-y-4">
                {contacts.map((contact) => (
                    <Card key={contact.id} className="border p-4 rounded-lg">
                        <p><strong>{contact.sender}:</strong> {contact.content}</p>
                        {contact.image && <Image src={contact.image} alt="Image" className="max-w-full mt-2" />}
                        <p className="text-sm text-gray-500"><em>{new Date(contact.createdAt).toLocaleString()}</em></p>
                    </Card>
                ))}
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-5">Gửi phản hồi</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Gửi phản hồi</DialogTitle>
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Nhập phản hồi của bạn"
                        className="w-full p-2 mt-2 border rounded-lg"
                    />
                    <Input
                        type="file"
                        onChange={handleImageUpload}
                        className="mt-3"
                    />
                    <Button onClick={handleSendResponse} className="mt-5">Gửi phản hồi</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
