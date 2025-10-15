import { useState, useEffect } from "react";
import { X, Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementBannerProps {
  id: string;
  text: string;
  icon: string;
  backgroundColor: string;
}

const iconMap = {
  info: Info,
  alert: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
};

const AnnouncementBanner = ({ id, text, icon, backgroundColor }: AnnouncementBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`announcement-dismissed-${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`announcement-dismissed-${id}`, 'true');
  };

  if (!isVisible) return null;

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Info;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 py-3 px-4 shadow-lg animate-fade-in"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <IconComponent className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-sm sm:text-base text-white font-medium truncate">{text}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-white hover:bg-white/20 h-8 w-8 p-0 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
