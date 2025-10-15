import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownPreview from "./MarkdownPreview";
import { getWikiPage, seedInitialData, type WikiPage } from "@/lib/mongodb";

interface WikiContentProps {
  pageId: string;
}

const WikiContent = ({ pageId }: WikiContentProps) => {
  const [page, setPage] = useState<WikiPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        await seedInitialData();
        const pageData = await getWikiPage(pageId);
        setPage(pageData);
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex-1 w-full overflow-hidden">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const content = page?.content || "# Page Not Found\n\nThis page doesn't exist yet.";

  return (
    <div className="flex-1 w-full overflow-hidden">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <MarkdownPreview content={content} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default WikiContent;
