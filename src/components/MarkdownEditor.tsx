import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, X, Link as LinkIcon, Highlighter, Code, FileCode, 
  ChevronDown, Bold, Heading1, Heading2, List
} from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";

interface MarkdownEditorProps {
  initialContent: string;
  initialTitle: string;
  onSave: (content: string, title: string) => void;
  onCancel: () => void;
}

const MarkdownEditor = ({ initialContent, initialTitle, onSave, onCancel }: MarkdownEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);

  const insertSyntax = (before: string, after: string = "") => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const syntaxButtons = [
    { icon: Heading1, label: "H1", syntax: "# ", after: "" },
    { icon: Heading2, label: "H2", syntax: "## ", after: "" },
    { icon: Bold, label: "Bold", syntax: "**", after: "**" },
    { icon: LinkIcon, label: "Link", syntax: "[", after: "](url)" },
    { icon: Highlighter, label: "Highlight", syntax: "[[", after: "]]" },
    { icon: Code, label: "Code", syntax: "``", after: "``" },
    { icon: FileCode, label: "Code Block", syntax: "``'language'\n", after: "\n``" },
    { icon: ChevronDown, label: "Dropdown", syntax: "{{<Title>\n", after: "\n}}" },
    { icon: List, label: "List", syntax: "- ", after: "" },
  ];

  return (
    <div className="h-auto lg:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-3 sm:p-4 bg-card">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page Title"
            className="text-lg sm:text-xl font-bold bg-background border-border"
          />
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={() => onSave(content, title)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-border hover:bg-muted flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
          </div>
        </div>

        {/* Syntax Toolbar */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {syntaxButtons.map((btn) => (
            <Button
              key={btn.label}
              onClick={() => insertSyntax(btn.syntax, btn.after)}
              variant="outline"
              size="sm"
              className="border-border hover:bg-primary/10 hover:border-primary text-xs sm:text-sm px-2 sm:px-3"
            >
              <btn.icon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">{btn.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Editor/Preview Tabs */}
      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <TabsList className="mx-3 sm:mx-4 mt-3 sm:mt-4 bg-muted">
          <TabsTrigger value="editor" className="text-xs sm:text-sm">Editor</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 m-0">
          <ScrollArea className="h-[50vh] lg:h-[calc(100vh-16rem)]">
            <div className="p-3 sm:p-4">
              <Textarea
                id="markdown-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your content using markdown..."
                className="min-h-[40vh] lg:min-h-[calc(100vh-18rem)] font-mono text-xs sm:text-sm bg-background border-border resize-none"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0">
          <ScrollArea className="h-[50vh] lg:h-[calc(100vh-16rem)]">
            <div className="p-4 sm:p-6 lg:p-8">
              <MarkdownPreview content={content} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Syntax Reference */}
      <Card className="mx-3 sm:mx-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-card border-border">
        <h3 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">Syntax Reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground overflow-x-auto">
          <div className="whitespace-nowrap"><code className="text-primary">[text](link)</code> - Link</div>
          <div className="whitespace-nowrap"><code className="text-primary">[[text]]</code> - Highlight</div>
          <div className="whitespace-nowrap"><code className="text-primary">``text``</code> - Code</div>
          <div className="whitespace-nowrap"><code className="text-primary">``'lang'code``</code> - Syntax</div>
        </div>
      </Card>
    </div>
  );
};

export default MarkdownEditor;
