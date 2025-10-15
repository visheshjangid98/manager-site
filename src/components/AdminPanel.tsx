import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  LogOut,
  FileText,
  FolderTree,
  Megaphone,
  Save,
  X,
  Info,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import { useToast } from "@/hooks/use-toast";
import {
  getWikiPages,
  getCategories,
  getAnnouncement,
  createWikiPage,
  updateWikiPage,
  deleteWikiPage,
  createCategory,
  updateCategory,
  deleteCategory,
  updateAnnouncement,
  seedInitialData,
  type WikiPage,
  type Category,
  type Announcement,
} from "@/lib/mongodb";

interface AdminPanelProps {
  onLogout: () => void;
}

const iconOptions = [
  { value: "info", label: "Info", Icon: Info },
  { value: "alert", label: "Alert", Icon: AlertCircle },
  { value: "success", label: "Success", Icon: CheckCircle },
  { value: "warning", label: "Warning", Icon: AlertTriangle },
];

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pages");
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await seedInitialData();
      const [pagesData, categoriesData, announcementData] = await Promise.all([
        getWikiPages(),
        getCategories(),
        getAnnouncement(),
      ]);
      setPages(pagesData);
      setCategories(categoriesData);
      setAnnouncement(announcementData || {
        id: "main",
        text: "Welcome to Manager!",
        icon: "info",
        backgroundColor: "#3b82f6",
        enabled: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    }
  };

  const handleCreatePage = async () => {
    const newPage: Omit<WikiPage, '_id' | 'createdAt' | 'updatedAt'> = {
      id: `page-${Date.now()}`,
      title: "New Page",
      content: "# New Page\n\nStart writing your content here...",
      order: pages.length,
      category: categories[0]?.name || "General",
    };

    try {
      await createWikiPage(newPage);
      await loadData();
      toast({
        title: "Page Created",
        description: "New wiki page has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deleteWikiPage(id);
      await loadData();
      if (selectedPage?.id === id) {
        setSelectedPage(null);
        setIsEditing(false);
      }
      toast({
        title: "Page Deleted",
        description: "Wiki page has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const handleSavePage = async (content: string, title: string) => {
    if (selectedPage) {
      try {
        await updateWikiPage(selectedPage.id, { content, title });
        await loadData();
        toast({
          title: "Changes Saved",
          description: "Wiki page has been updated",
        });
        setIsEditing(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save page",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdatePageCategory = async (pageId: string, category: string) => {
    try {
      await updateWikiPage(pageId, { category });
      await loadData();
      toast({
        title: "Category Updated",
        description: "Page category has been changed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Omit<Category, '_id' | 'createdAt'> = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      order: categories.length,
    };

    try {
      await createCategory(newCategory);
      await loadData();
      setNewCategoryName("");
      toast({
        title: "Category Created",
        description: "New category has been added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await loadData();
      toast({
        title: "Category Deleted",
        description: "Category has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!announcement) return;

    try {
      await updateAnnouncement(announcement);
      toast({
        title: "Announcement Updated",
        description: "Announcement settings have been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
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

  const handleDragEnd = async () => {
    if (draggedItem) {
      const page = pages.find(p => p.id === draggedItem);
      if (page) {
        try {
          await updateWikiPage(page.id, { order: page.order });
        } catch (error) {
          console.error('Error updating page order:', error);
        }
      }
    }
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="announcement" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Announcement</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-80 space-y-4">
                <Button
                  onClick={handleCreatePage}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary animate-scale-in"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Page
                </Button>

                <ScrollArea className="h-[calc(100vh-16rem)] rounded-lg border border-border bg-card p-4">
                  <div className="space-y-2">
                    {pages.map((page, index) => (
                      <div
                        key={page.id}
                        draggable
                        onDragStart={() => handleDragStart(page.id)}
                        onDragOver={(e) => handleDragOver(e, page.id)}
                        onDragEnd={handleDragEnd}
                        className="group animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Card
                          className={`p-3 cursor-move hover:border-primary/50 transition-all ${
                            selectedPage?.id === page.id ? 'border-primary bg-primary/10 scale-105' : 'bg-card hover:scale-102'
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
                                className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-all"
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
                                className="h-7 w-7 p-0 hover:bg-destructive/20 hover:text-destructive transition-all"
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

              <div className="flex-1">
                {selectedPage ? (
                  isEditing ? (
                    <div className="animate-fade-in">
                      <div className="mb-4 space-y-4">
                        <div>
                          <Label htmlFor="page-category">Category</Label>
                          <Select
                            value={selectedPage.category}
                            onValueChange={(value) => handleUpdatePageCategory(selectedPage.id, value)}
                          >
                            <SelectTrigger id="page-category" className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <MarkdownEditor
                        initialContent={selectedPage.content}
                        initialTitle={selectedPage.title}
                        onSave={handleSavePage}
                        onCancel={() => setIsEditing(false)}
                      />
                    </div>
                  ) : (
                    <Card className="p-6 animate-fade-in">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h1 className="text-3xl font-bold text-foreground">{selectedPage.title}</h1>
                          <p className="text-muted-foreground mt-1">{selectedPage.category}</p>
                        </div>
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <MarkdownPreview content={selectedPage.content} />
                    </Card>
                  )
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center text-muted-foreground">
                      <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Select a page to view or edit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                  className="flex-1"
                />
                <Button onClick={handleCreateCategory} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Card
                    key={category.id}
                    className="p-4 flex items-center justify-between hover:border-primary/50 transition-all animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {pages.filter(p => p.category === category.name).length} pages
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="announcement" className="animate-fade-in">
            <Card className="p-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Announcement Banner</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="announcement-enabled" className="text-base font-medium">
                      Enable Announcement
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show banner across all pages
                    </p>
                  </div>
                  <Switch
                    id="announcement-enabled"
                    checked={announcement?.enabled || false}
                    onCheckedChange={(checked) =>
                      setAnnouncement(prev => prev ? { ...prev, enabled: checked } : null)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="announcement-text">Message</Label>
                  <Textarea
                    id="announcement-text"
                    value={announcement?.text || ""}
                    onChange={(e) =>
                      setAnnouncement(prev => prev ? { ...prev, text: e.target.value } : null)
                    }
                    placeholder="Enter announcement message"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="announcement-icon">Icon</Label>
                  <Select
                    value={announcement?.icon || "info"}
                    onValueChange={(value) =>
                      setAnnouncement(prev => prev ? { ...prev, icon: value } : null)
                    }
                  >
                    <SelectTrigger id="announcement-icon" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(({ value, label, Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="announcement-bg">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="announcement-bg"
                      type="color"
                      value={announcement?.backgroundColor || "#3b82f6"}
                      onChange={(e) =>
                        setAnnouncement(prev => prev ? { ...prev, backgroundColor: e.target.value } : null)
                      }
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={announcement?.backgroundColor || "#3b82f6"}
                      onChange={(e) =>
                        setAnnouncement(prev => prev ? { ...prev, backgroundColor: e.target.value } : null)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Label className="mb-2 block">Preview</Label>
                  <div
                    className="p-4 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: announcement?.backgroundColor || "#3b82f6" }}
                  >
                    <div className="flex items-center gap-3">
                      {iconOptions.find(opt => opt.value === announcement?.icon)?.Icon &&
                        (() => {
                          const IconComponent = iconOptions.find(opt => opt.value === announcement?.icon)!.Icon;
                          return <IconComponent className="w-5 h-5 text-white" />;
                        })()
                      }
                      <p className="text-white font-medium">{announcement?.text || "Preview message"}</p>
                    </div>
                    <X className="w-4 h-4 text-white" />
                  </div>
                </div>

                <Button
                  onClick={handleSaveAnnouncement}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Announcement
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
