import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const parseMarkdown = (text: string) => {
    const elements: JSX.Element[] = [];
    const lines = text.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-foreground">
            {line.substring(2)}
          </h1>
        );
        i++;
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl sm:text-2xl lg:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-foreground">
            {line.substring(3)}
          </h2>
        );
        i++;
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg sm:text-xl lg:text-2xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-foreground">
            {line.substring(4)}
          </h3>
        );
        i++;
      }
      // Dropdowns {{<Title>content}}
      else if (line.match(/^{{<(.+?)>$/)) {
        const titleMatch = line.match(/^{{<(.+?)>$/);
        if (titleMatch) {
          const title = titleMatch[1];
          let dropdownContent = '';
          i++;
          while (i < lines.length && !lines[i].startsWith('}}')) {
            dropdownContent += lines[i] + '\n';
            i++;
          }
          elements.push(
            <Collapsible key={i} className="my-3 sm:my-4 border border-primary/30 rounded-lg bg-card">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 hover:bg-primary/10 transition-colors">
                <span className="font-semibold text-sm sm:text-base text-primary">{title}</span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="pt-2 border-t border-border">
                  <MarkdownPreview content={dropdownContent.trim()} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
          i++;
        }
      }
      // Code blocks with language ``'lang'code``
      else if (line.match(/^``'(.+?)'/)) {
        const langMatch = line.match(/^``'(.+?)'/);
        if (langMatch) {
          const language = langMatch[1];
          let codeContent = '';
          const restOfLine = line.substring(langMatch[0].length);
          
          if (restOfLine.endsWith('``')) {
            codeContent = restOfLine.substring(0, restOfLine.length - 2);
            elements.push(
              <div key={i} className="my-3 sm:my-4 rounded-lg overflow-hidden bg-code-bg border border-border">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted border-b border-border">
                  <span className="text-xs font-mono text-primary">{language}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(codeContent, `code-${i}`)}
                    className="h-6 px-2"
                  >
                    {copiedCode === `code-${i}` ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto">
                  <code className="text-xs sm:text-sm font-mono text-foreground break-all sm:break-normal">{codeContent}</code>
                </pre>
              </div>
            );
          } else {
            codeContent = restOfLine + '\n';
            i++;
            while (i < lines.length && !lines[i].endsWith('``')) {
              codeContent += lines[i] + '\n';
              i++;
            }
            if (i < lines.length) {
              codeContent += lines[i].substring(0, lines[i].length - 2);
            }
            
            elements.push(
              <div key={i} className="my-3 sm:my-4 rounded-lg overflow-hidden bg-code-bg border border-border">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted border-b border-border">
                  <span className="text-xs font-mono text-primary">{language}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(codeContent.trim(), `code-${i}`)}
                    className="h-6 px-2"
                  >
                    {copiedCode === `code-${i}` ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto">
                  <code className="text-xs sm:text-sm font-mono text-foreground break-all sm:break-normal">{codeContent.trim()}</code>
                </pre>
              </div>
            );
          }
          i++;
        }
      }
      // Simple code blocks ``text``
      else if (line.includes('``') && !line.match(/^``'(.+?)'/)) {
        const parts = line.split('``');
        const processedParts = parts.map((part, idx) => {
          if (idx % 2 === 1) {
            const codeId = `inline-${i}-${idx}`;
            return (
              <span key={idx} className="inline-flex items-center gap-1 sm:gap-2 mx-0.5 sm:mx-1 px-2 sm:px-3 py-1 bg-code-bg border border-border rounded font-mono text-xs sm:text-sm break-all">
                <code className="text-primary">{part}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(part, codeId)}
                  className="h-4 w-4 p-0 shrink-0"
                >
                  {copiedCode === codeId ? (
                    <Check className="w-3 h-3 text-primary" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </span>
            );
          }
          return <span key={idx}>{parseInlineFormatting(part)}</span>;
        });
        
        elements.push(
          <p key={i} className="mb-3 sm:mb-4 text-sm sm:text-base text-foreground leading-relaxed break-words">
            {processedParts}
          </p>
        );
        i++;
      }
      // Lists
      else if (line.match(/^[-*]\s/)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^[-*]\s/)) {
          listItems.push(
            <li key={i} className="mb-2 text-sm sm:text-base text-foreground">
              {parseInlineFormatting(lines[i].substring(2))}
            </li>
          );
          i++;
        }
        elements.push(
          <ul key={i} className="list-disc list-inside mb-3 sm:mb-4 space-y-1">
            {listItems}
          </ul>
        );
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s/)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          const content = lines[i].replace(/^\d+\.\s/, '');
          listItems.push(
            <li key={i} className="mb-2 text-sm sm:text-base text-foreground">
              {parseInlineFormatting(content)}
            </li>
          );
          i++;
        }
        elements.push(
          <ol key={i} className="list-decimal list-inside mb-3 sm:mb-4 space-y-1">
            {listItems}
          </ol>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        i++;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={i} className="mb-3 sm:mb-4 text-sm sm:text-base text-foreground leading-relaxed break-words">
            {parseInlineFormatting(line)}
          </p>
        );
        i++;
      }
    }

    return elements;
  };

  const parseInlineFormatting = (text: string): (string | JSX.Element)[] | string => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let key = 0;

    // Parse [[highlighted text]]
    const highlightRegex = /\[\[(.+?)\]\]/g;
    let lastIndex = 0;
    let match;

    while ((match = highlightRegex.exec(currentText)) !== null) {
      if (match.index > lastIndex) {
        const linkResult = parseLinks(currentText.substring(lastIndex, match.index), key++);
        if (Array.isArray(linkResult)) {
          parts.push(...linkResult);
        } else {
          parts.push(linkResult);
        }
      }
      parts.push(
        <span key={key++} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/20 text-primary font-semibold rounded text-xs sm:text-sm">
          {match[1]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < currentText.length) {
      const linkResult = parseLinks(currentText.substring(lastIndex), key++);
      if (Array.isArray(linkResult)) {
        parts.push(...linkResult);
      } else {
        parts.push(linkResult);
      }
    }

    return parts.length > 0 ? parts : parseLinks(text, 0);
  };

  const parseLinks = (text: string, baseKey: number): (string | JSX.Element)[] | string => {
    const parts: (string | JSX.Element)[] = [];
    const linkRegex = /\[(.+?)\]\((.+?)\)/g;
    let lastIndex = 0;
    let match;
    let key = baseKey;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const boldResult = parseBold(text.substring(lastIndex, match.index), key++);
        if (Array.isArray(boldResult)) {
          parts.push(...boldResult);
        } else {
          parts.push(boldResult);
        }
      }
      parts.push(
        <a
          key={key++}
          href={match[2]}
          className="text-primary hover:text-highlight underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const boldResult = parseBold(text.substring(lastIndex), key++);
      if (Array.isArray(boldResult)) {
        parts.push(...boldResult);
      } else {
        parts.push(boldResult);
      }
    }

    return parts.length > 0 ? parts : parseBold(text, 0);
  };

  const parseBold = (text: string, baseKey: number): (string | JSX.Element)[] | string => {
    const parts: (string | JSX.Element)[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    let key = baseKey;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={key++} className="font-bold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return <div className="prose prose-invert max-w-none">{parseMarkdown(content)}</div>;
};

export default MarkdownPreview;
