import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Plus, Edit, Trash2, GripVertical, LogOut, Eye } from "lucide-react";
import MarkdownEditor from "./MarkdownEditor";
import { useToast } from "@/hooks/use-toast";

interface WikiPage {
  id: string;
  title: string;
  content: string;
  order: number;
  category: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [pages, setPages] = useState<WikiPage[]>([
    { id: "getting-started", title: "Getting Started", content: "# Getting Started", order: 0, category: "Introduction" },
    { id: "installation", title: "Installation", content: "# Installation", order: 1, category: "Introduction" },
  ]);
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreatePage = () => {
    const newPage: WikiPage = {
      id: `page-${Date.now()}`,
      title: "New Page",
      content: "# New Page\n\nStart writing your content here...",
      order: pages.length,
      category: "General",
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
    setIsEditing(true);
    toast({
      title: "Page Created",
      description: "New wiki page has been created",
    });
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
    if (selectedPage?.id === id) {
      setSelectedPage(null);
      setIsEditing(false);
    }
    toast({
      title: "Page Deleted",
      description: "Wiki page has been removed",
    });
  };

  const handleSavePage = (content: string, title: string) => {
    if (selectedPage) {
      setPages(pages.map(p => 
        p.id === selectedPage.id 
          ? { ...p, content, title }
          : p
      ));
      setSelectedPage({ ...selectedPage, content, title });
      toast({
        title: "Changes Saved",
        description: "Wiki page has been updated",
      });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIdx = pages.findIndex(p => p.id === draggedItem);
    const targetIdx = pages.findIndex(p => p.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) return;

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIdx, 1);
    newPages.splice(targetIdx, 0, draggedPage);

    newPages.forEach((page, idx) => {
      page.order = idx;
    });

    setPages(newPages);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-highlight-muted rounded-lg glow-primary" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Manager Admin</span>
            </Link>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Pages List */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border min-h-[auto] lg:min-h-[calc(100vh-4rem)] bg-card">
          <div className="p-4">
            <Button
              onClick={handleCreatePage}
              className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </div>

          <ScrollArea className="h-[200px] lg:h-[calc(100vh-8rem)]">
            <div className="px-4 pb-4 space-y-2">
              {pages.map(page => (
                <div
                  key={page.id}
                  draggable
                  onDragStart={() => handleDragStart(page.id)}
                  onDragOver={(e) => handleDragOver(e, page.id)}
                  onDragEnd={handleDragEnd}
                  className="group"
                >
                  <Card
                    className={`p-3 cursor-move hover:border-primary/50 transition-all ${
                      selectedPage?.id === page.id ? 'border-primary bg-primary/10' : 'bg-card'
                    }`}
                    onClick={() => {
                      setSelectedPage(page);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{page.title}</div>
                        <div className="text-xs text-muted-foreground">{page.category}</div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPage(page);
                            setIsEditing(true);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page.id);
                          }}
                          className="h-7 w-7 p-0 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 w-full overflow-hidden">
          {selectedPage ? (
            isEditing ? (
              <MarkdownEditor
                initialContent={selectedPage.content}
                initialTitle={selectedPage.title}
                onSave={handleSavePage}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedPage.title}</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">{selectedPage.category}</p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Page
                  </Button>
                </div>
                <div className="prose prose-invert max-w-none text-sm sm:text-base">
                  {selectedPage.content}
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
              <div className="text-center text-muted-foreground">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Select a page to view or edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
