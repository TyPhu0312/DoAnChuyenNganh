import React from "react";
import { AiOutlinePaperClip } from "react-icons/ai"; // Giả sử bạn dùng react-icons cho biểu tượng
import { Input } from "@/components/ui/input"; // Hoặc đường dẫn tương ứng nếu bạn đang dùng thư viện khác
import { Button } from "@/components/ui/button"; // Cũng như với Button
interface InputChatProps {
  note: string;
  handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNoteChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmitContact: () => void;
}
const InputChat: React.FC<InputChatProps> = ({
  note,
  handleFileChange,
  handleNoteChange,
  handleSubmitContact,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-black text-white py-2 px-4 rounded-md"
      >
        <AiOutlinePaperClip size={20} />
      </label>
      <Input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="w-[20%] hidden"
        id="file-upload"
      />
      <Input
        type="text"
        className="flex-1"
        name="note"
        placeholder="Nhập ghi chú"
        value={note}
        onChange={handleNoteChange}
      />
      <Button onClick={handleSubmitContact}>Gửi</Button>
    </div>
  );
};
export default InputChat;