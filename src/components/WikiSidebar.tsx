import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getWikiPages, getCategories, type WikiPage, type Category } from "@/lib/mongodb";

interface WikiSidebarProps {
  selectedPage: string;
  onSelectPage: (pageId: string) => void;
}

const WikiSidebar = ({ selectedPage, onSelectPage }: WikiSidebarProps) => {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pagesData, categoriesData] = await Promise.all([
          getWikiPages(),
          getCategories(),
        ]);
        setPages(pagesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading wiki data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full lg:w-64 border-r border-border min-h-[calc(100vh-4rem)] lg:sticky lg:top-16 bg-card">
        <ScrollArea className="h-full lg:h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-64 border-r border-border min-h-[calc(100vh-4rem)] lg:sticky lg:top-16 bg-card">
      <ScrollArea className="h-full lg:h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-4 sm:space-y-6">
          {categories.map(category => (
            <div key={category.id}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                {category.name}
              </h3>
              <div className="space-y-1">
                {pages
                  .filter(page => page.category === category.name)
                  .map(page => (
                    <button
                      key={page.id}
                      onClick={() => onSelectPage(page.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedPage === page.id
                          ? "bg-primary/20 text-primary font-medium border-l-2 border-primary"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      {page.title}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WikiSidebar;
