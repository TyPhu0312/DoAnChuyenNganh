// import formidable from 'formidable';
// import fs from 'fs/promises';
// import path from 'path';
// import db from '@/models/CustomPainting'; // Import Sequelize models (đường dẫn cần đúng)

// const CustomPainting = db.CustomPainting;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const uploadDir = path.join(process.cwd(), '/public/images');
//     await fs.mkdir(uploadDir, { recursive: true });

//     const form = new formidable.IncomingForm();
//     form.uploadDir = uploadDir;
//     form.keepExtensions = true;

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Lỗi xử lý file.' });
//       }

//       const { name, size_width, size_height, picture_frame, note } = fields;
//       const imageFile = files.image;

//       try {
//         if (!imageFile) {
//           return res.status(400).json({ error: 'File ảnh là bắt buộc.' });
//         }

//         const newFileName = `${Date.now()}_${imageFile.originalFilename}`;
//         const filePath = path.join(uploadDir, newFileName);

//         // Di chuyển file vào thư mục upload
//         await fs.rename(imageFile.filepath, filePath);

//         // Lưu thông tin vào database
//         const newPainting = await CustomPainting.create({
//           image: `/images/${newFileName}`,
//           name,
//           size_width: parseInt(size_width, 10),
//           size_height: parseInt(size_height, 10),
//           picture_frame: picture_frame === 'true', // Chuyển giá trị từ string sang boolean
//           note,
//         });

//         res.status(200).json({ message: 'Tải lên thành công!', data: newPainting });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Không thể lưu dữ liệu vào cơ sở dữ liệu.' });
//       }
//     });
//   } else {
//     res.status(405).json({ error: 'Method không được hỗ trợ.' });
//   }
// }
