import db from '@/models/CustomPainting';

const CustomPainting = db.CustomPainting;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const paintings = await CustomPainting.findAll();
      res.status(200).json(paintings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Không thể lấy dữ liệu.' });
    }
  } else {
    res.status(405).json({ error: 'Method không được hỗ trợ.' });
  }
}
