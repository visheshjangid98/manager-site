import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface WikiPage {
  id: string;
  title: string;
  category?: string;
}

const wikiPages: WikiPage[] = [
  { id: "getting-started", title: "Getting Started", category: "Introduction" },
  { id: "installation", title: "Installation", category: "Introduction" },
  { id: "configuration", title: "Configuration", category: "Setup" },
  { id: "commands", title: "Commands", category: "Setup" },
  { id: "permissions", title: "Permissions", category: "Setup" },
  { id: "features", title: "Features Overview", category: "Advanced" },
  { id: "api", title: "API Usage", category: "Advanced" },
];

interface WikiSidebarProps {
  selectedPage: string;
  onSelectPage: (pageId: string) => void;
}

const WikiSidebar = ({ selectedPage, onSelectPage }: WikiSidebarProps) => {
  const categories = Array.from(new Set(wikiPages.map(p => p.category)));

  return (
    <div className="w-full lg:w-64 border-r border-border min-h-[calc(100vh-4rem)] lg:sticky lg:top-16 bg-card">
      <ScrollArea className="h-full lg:h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-4 sm:space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                {category}
              </h3>
              <div className="space-y-1">
                {wikiPages
                  .filter(page => page.category === category)
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
