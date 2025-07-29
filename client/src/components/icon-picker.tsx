import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Coffee, 
  Briefcase, 
  Moon, 
  Heart, 
  Smile,
  Zap,
  Star,
  Music,
  Book,
  Car,
  Plane,
  Home,
  Phone,
  MessageCircle,
  Camera,
  Gamepad2,
  Headphones,
  Laptop,
  Clock,
  MapPin,
  Gift,
  Utensils,
  Dumbbell,
  TreePine,
  Sun,
  CloudRain,
  Flame,
  Snowflake,
  Umbrella,
  type LucideIcon
} from "lucide-react";

interface IconOption {
  name: string;
  icon: LucideIcon;
  value: string;
}

const iconOptions: IconOption[] = [
  { name: "User", icon: User, value: "user" },
  { name: "Coffee", icon: Coffee, value: "coffee" },
  { name: "Briefcase", icon: Briefcase, value: "briefcase" },
  { name: "Moon", icon: Moon, value: "moon" },
  { name: "Heart", icon: Heart, value: "heart" },
  { name: "Smile", icon: Smile, value: "smile" },
  { name: "Zap", icon: Zap, value: "zap" },
  { name: "Star", icon: Star, value: "star" },
  { name: "Music", icon: Music, value: "music" },
  { name: "Book", icon: Book, value: "book" },
  { name: "Car", icon: Car, value: "car" },
  { name: "Plane", icon: Plane, value: "plane" },
  { name: "Home", icon: Home, value: "home" },
  { name: "Phone", icon: Phone, value: "phone" },
  { name: "Message", icon: MessageCircle, value: "message-circle" },
  { name: "Camera", icon: Camera, value: "camera" },
  { name: "Gaming", icon: Gamepad2, value: "gamepad-2" },
  { name: "Headphones", icon: Headphones, value: "headphones" },
  { name: "Laptop", icon: Laptop, value: "laptop" },
  { name: "Clock", icon: Clock, value: "clock" },
  { name: "Location", icon: MapPin, value: "map-pin" },
  { name: "Gift", icon: Gift, value: "gift" },
  { name: "Food", icon: Utensils, value: "utensils" },
  { name: "Exercise", icon: Dumbbell, value: "dumbbell" },
  { name: "Nature", icon: TreePine, value: "tree-pine" },
  { name: "Sun", icon: Sun, value: "sun" },
  { name: "Rain", icon: CloudRain, value: "cloud-rain" },
  { name: "Fire", icon: Flame, value: "flame" },
  { name: "Snow", icon: Snowflake, value: "snowflake" },
  { name: "Umbrella", icon: Umbrella, value: "umbrella" },
];

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

export default function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedIconOption = iconOptions.find(option => option.value === selectedIcon) || iconOptions[0];
  const SelectedIconComponent = selectedIconOption.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start h-10 px-3"
        >
          <SelectedIconComponent className="h-4 w-4 mr-2" />
          {selectedIconOption.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">Choose an icon</h4>
        </div>
        <ScrollArea className="h-64">
          <div className="grid grid-cols-5 gap-1 p-3">
            {iconOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = option.value === selectedIcon;
              
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    onIconSelect(option.value);
                    setOpen(false);
                  }}
                  title={option.name}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Export function to get icon component by value for use in other components
export function getIconComponent(iconValue: string): LucideIcon {
  const iconOption = iconOptions.find(option => option.value === iconValue);
  return iconOption ? iconOption.icon : User;
}