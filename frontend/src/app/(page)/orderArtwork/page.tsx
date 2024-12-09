import React from 'react'
import UploadForm from '@/components/features/UploadForm';
import Footer from '@/components/features/footer';

export default function CustomPainting() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <UploadForm />
      <Footer/>
    </div>
  )
}
