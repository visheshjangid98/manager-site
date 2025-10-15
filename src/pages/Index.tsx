import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Server, Users, Book, Shield } from "lucide-react";

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
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
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
          <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
            <div className="inline-block">
              <div className="bg-gradient-to-r from-primary to-highlight-muted bg-clip-text text-transparent">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Manager</h1>
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              A comprehensive multi-purpose Minecraft plugin that streamlines server development 
              and management, empowering administrators with powerful tools and intuitive controls.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all hover:scale-105 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className="border-primary/50 hover:bg-primary/10 hover:border-primary transition-all w-full sm:w-auto"
              >
                <Link to="/wiki">
                  <Book className="w-4 h-4 mr-2" />
                  View Documentation
                </Link>
              </Button>
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
