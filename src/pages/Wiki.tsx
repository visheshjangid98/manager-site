import { useState } from "react";
import { Link } from "react-router-dom";
import WikiSidebar from "@/components/WikiSidebar";
import WikiContent from "@/components/WikiContent";
import { Shield, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Wiki = () => {
  const [selectedPage, setSelectedPage] = useState("getting-started");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
    setIsSidebarOpen(false); // Close mobile sidebar after selection
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* Mobile/Tablet Menu Toggle */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-card">
                  <WikiSidebar selectedPage={selectedPage} onSelectPage={handlePageSelect} />
                </SheetContent>
              </Sheet>

              {/* Desktop Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex"
                onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-highlight-muted rounded-lg glow-primary" />
                <span className="text-lg sm:text-xl font-bold text-foreground">Manager</span>
              </Link>
            </div>
            <div className="flex gap-3 sm:gap-6">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link to="/wiki" className="text-foreground hover:text-primary transition-colors text-sm sm:text-base">
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

      {/* Wiki Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        {!isDesktopSidebarCollapsed && (
          <div className="hidden lg:block">
            <WikiSidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
          </div>
        )}
        <WikiContent pageId={selectedPage} />
      </div>
    </div>
  );
};

export default Wiki;
