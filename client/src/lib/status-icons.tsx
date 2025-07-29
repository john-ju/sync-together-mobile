import { 
  Check, 
  X, 
  Briefcase, 
  Moon, 
  User, 
  Coffee,
  LucideIcon
} from "lucide-react";
import { getIconComponent } from "@/components/icon-picker";

const statusIconMap: Record<string, LucideIcon> = {
  free: Check,
  busy: X,
  meeting: Briefcase,
  sleeping: Moon,
  custom: User,
  coffee: Coffee,
  check: Check,
  times: X,
  briefcase: Briefcase,
  moon: Moon,
  user: User,
};

export function getStatusIcon(iconName: string): LucideIcon {
  // First check if it's a predefined status icon
  const predefinedIcon = statusIconMap[iconName];
  if (predefinedIcon) {
    return predefinedIcon;
  }
  
  // If not found, try to get it from the icon picker component library
  return getIconComponent(iconName);
}
