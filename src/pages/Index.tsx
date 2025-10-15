import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download, Server, Users, Shield, Send, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { getAnnouncement, type Announcement } from "@/lib/mongodb";

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className="animate-counter-up">{count.toLocaleString()}</span>;
};

const Index = () => {
  const { toast } = useToast();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAnnouncement().then(setAnnouncement).catch(console.error);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
    setEmail("");
    setMessage("");
  };

  const stats = [
    { 
      icon: Download, 
      label: "Total Downloads", 
      value: 15420, 
      color: "from-primary/20 to-primary/5",
      description: "Active downloads"
    },
    { 
      icon: Server, 
      label: "Servers Using", 
      value: 842, 
      color: "from-accent/20 to-accent/5",
      description: "Worldwide"
    },
    { 
      icon: Users, 
      label: "Discord Members", 
      value: 3250, 
      color: "from-primary/20 to-primary/5",
      description: "Community members"
    },
  ];

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
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-40" style={{ marginTop: announcement && announcement.enabled ? '52px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-highlight-muted rounded-lg glow-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Manager</span>
            </div>
            <div className="flex gap-3 sm:gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link to="/wiki" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                Wiki
              </Link>
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm sm:text-base">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 animate-fade-in">
            {/* Plugin Icon */}
            <div className="flex-shrink-0 lg:w-1/3">
              <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="20" width="30" height="60" fill="#10b981" rx="5" />
                <rect x="85" y="20" width="30" height="120" fill="#10b981" rx="5" />
                <rect x="120" y="20" width="30" height="60" fill="#10b981" rx="5" />
                <path d="M 70 85 Q 100 100 130 85" stroke="#10b981" stroke-width="8" fill="none" stroke-linecap="round" />
                <rect x="40" y="145" width="120" height="15" fill="#10b981" rx="7" />
                <ellipse cx="100" cy="175" rx="50" ry="15" fill="#10b981" opacity="0.6" />
              </svg>
            </div>

            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
              <div className="inline-block">
                <div className="bg-gradient-to-r from-primary to-highlight-muted bg-clip-text text-transparent">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Manager</h1>
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A comprehensive multi-purpose Minecraft plugin that streamlines server development
                and management, empowering administrators with powerful tools and intuitive controls.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all hover:scale-105 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label}
              className="p-4 sm:p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-3 sm:p-4`}>
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5">
                    <AnimatedCounter end={stat.value} />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</div>
                  <div className="text-xs text-muted-foreground/70">{stat.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-primary to-highlight-muted bg-clip-text text-transparent">
          Why Choose Manager?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {[
            {
              title: "Easy Configuration",
              description: "Intuitive configuration system with comprehensive documentation and examples."
            },
            {
              title: "Performance Optimized",
              description: "Built with efficiency in mind, minimal resource usage and maximum reliability."
            },
            {
              title: "Regular Updates",
              description: "Active development with frequent updates, bug fixes, and new features."
            },
            {
              title: "Community Support",
              description: "Join our Discord community for help, suggestions, and plugin discussions."
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-card to-secondary border border-border hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-primary to-highlight-muted bg-clip-text text-transparent">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Send us a Message
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="bg-background border-border resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Community Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Join Our Community
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://discord.gg/manager"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-6 bg-[#5865F2] hover:bg-[#4752C4] transition-all hover:scale-105 border-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <div className="text-white">
                      <div className="font-semibold">Discord</div>
                      <div className="text-sm opacity-90">Join our server</div>
                    </div>
                  </div>
                </Card>
              </a>

              <a
                href="https://instagram.com/manager"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-6 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90 transition-all hover:scale-105 border-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <div className="text-white">
                      <div className="font-semibold">Instagram</div>
                      <div className="text-sm opacity-90">Follow us</div>
                    </div>
                  </div>
                </Card>
              </a>

              <a
                href="https://youtube.com/@manager"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-6 bg-[#FF0000] hover:bg-[#CC0000] transition-all hover:scale-105 border-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <div className="text-white">
                      <div className="font-semibold">YouTube</div>
                      <div className="text-sm opacity-90">Subscribe</div>
                    </div>
                  </div>
                </Card>
              </a>

              <a
                href="https://github.com/manager/plugin"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-6 bg-[#24292e] hover:bg-[#1a1e22] transition-all hover:scale-105 border-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <div className="text-white">
                      <div className="font-semibold">GitHub</div>
                      <div className="text-sm opacity-90">View source</div>
                    </div>
                  </div>
                </Card>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2024 Manager Plugin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
