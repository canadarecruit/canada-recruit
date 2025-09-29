// src/components/FaviconIcon.tsx
import { Globe } from "lucide-react";

const FaviconIcon = () => {
  return (
    <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <Globe className="h-20 w-20 text-primary-foreground" />
    </div>
  );
};

export default FaviconIcon;
