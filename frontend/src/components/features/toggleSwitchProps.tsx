import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ToggleSwitchProps {
  label: string; 
  onToggle: (enabled: boolean) => void; 
}

export function ToggleSwitch({ label, onToggle }: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState<boolean>(true); 

 
  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    onToggle(checked); 
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="toggle-switch" 
        checked={isOn} 
        onCheckedChange={handleToggle} 
      />
      <Label htmlFor="toggle-switch">{label}</Label> 
    </div>
  );
}
