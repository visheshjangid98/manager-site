import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { getAnnouncement, type Announcement } from "@/lib/mongodb";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getAnnouncement().then(setAnnouncement).catch(console.error);
  }, []);

  const handleLogin = () => {
    if (password === "itsmanagerplugin") {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel!",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return <AdminPanel onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {announcement && announcement.enabled && (
        <AnnouncementBanner
          id={announcement.id}
          text={announcement.text}
          icon={announcement.icon}
          backgroundColor={announcement.backgroundColor}
        />
      )}
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80" style={{ marginTop: announcement && announcement.enabled ? '52px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-highlight-muted rounded-lg glow-primary" />
              <span className="text-xl font-bold text-foreground">Manager</span>
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/wiki" className="text-muted-foreground hover:text-primary transition-colors">
                Wiki
              </Link>
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-md p-6 sm:p-8 bg-card border-border animate-scale-in">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 mb-4 glow-primary">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Access</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Enter password to access the admin panel</p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-background border-border focus:border-primary text-sm sm:text-base"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary text-sm sm:text-base"
            >
              <Shield className="w-4 h-4 mr-2" />
              Access Admin Panel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
