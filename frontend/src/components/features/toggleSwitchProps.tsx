import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Định nghĩa kiểu cho props
interface ToggleSwitchProps {
  label: string; // Label của toggle
  onToggle: (enabled: boolean) => void; // Hàm callback khi toggle thay đổi trạng thái
}

export function ToggleSwitch({ label, onToggle }: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState<boolean>(true); // Trạng thái của toggle (true = bật, false = tắt)

  // Hàm xử lý khi toggle thay đổi
  const handleToggle = (checked: boolean) => {
    setIsOn(checked); // Cập nhật trạng thái toggle
    onToggle(checked); // Gọi hàm callback để truyền trạng thái về component cha
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="toggle-switch" // ID cho switch
        checked={isOn} // Trạng thái của switch
        onCheckedChange={handleToggle} // Gọi handleToggle khi trạng thái thay đổi
      />
      <Label htmlFor="toggle-switch">{label}</Label> {/* Gắn label cho switch */}
    </div>
  );
}
