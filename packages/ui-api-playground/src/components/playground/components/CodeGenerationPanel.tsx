'use client';

import React, { useMemo } from 'react';
import { Box, BoxContent, BoxHeader, BoxTitle } from '@workspace/ui-core/components/box';
import { Badge } from '@workspace/ui-core/components/badge';
import { Button } from '@workspace/ui-core/components/button';
import { Checkbox } from '@workspace/ui-core/components/checkbox';
import { Label } from '@workspace/ui-core/components/label';
import { Copy, Code2 } from 'lucide-react';
import SyntaxHighlighter from '../SyntaxHighlighter';
import { getSyntaxLanguage } from '../../../utils/codeGenerators';

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js)', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C# (.NET)', icon: '🔷' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'curl', label: 'cURL', icon: '🌐' },
];

interface CodeGenerationPanelProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  generateCode: (language: string) => string;
  copied: boolean;
  handleCopyCode: () => void;
  showAuthToken: boolean;
  setShowAuthToken: (show: boolean) => void;
}

export const CodeGenerationPanel: React.FC<CodeGenerationPanelProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  generateCode,
  copied,
  handleCopyCode,
  showAuthToken,
  setShowAuthToken
}) => {
  // Memoize the generated code to ensure it updates when generateCode function changes
  const code = useMemo(() => generateCode(selectedLanguage), [generateCode, selectedLanguage]);

  return (
    <Box className="flex h-full min-h-0 min-w-0 flex-col border shadow-sm transition-shadow hover:shadow-md rounded-lg">
      <BoxHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BoxTitle className="flex min-w-0 items-center gap-2 text-base text-foreground">
            <div className="h-4 w-4 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="truncate">Programming Language</span>
            <Badge
              variant="secondary"
              className="shrink-0"
              title={`${PROGRAMMING_LANGUAGES.length} languages`}
              aria-label={`${PROGRAMMING_LANGUAGES.length} languages`}
            >
              {PROGRAMMING_LANGUAGES.length}
            </Badge>
          </BoxTitle>
          <Button onClick={handleCopyCode} variant="outline" size="sm" className="flex min-h-11 shrink-0 items-center gap-1 px-3 lg:h-7 lg:min-h-0 lg:px-2">
            <Copy className="h-3 w-3" />
            <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </BoxHeader>
      
      <BoxContent className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="language-tabs flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1">
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              className={`language-tab flex min-h-11 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-h-0 lg:py-2 ${
                selectedLanguage === lang.value
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
              type="button"
              onClick={(e) => { e.preventDefault(); setSelectedLanguage(lang.value); }}
              data-language={lang.value}
            >
              <span className="language-icon text-sm">{lang.icon}</span>
              <span className="language-name text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
        
        {/* Show Auth Token Checkbox */}
        <div className="flex min-h-11 items-center gap-2 border-b border-border py-2">
          <Checkbox
            id="show-auth-token"
            checked={showAuthToken}
            onCheckedChange={(checked) => setShowAuthToken(checked === true)}
          />
          <Label htmlFor="show-auth-token" className="text-sm cursor-pointer">
            Show auth token
          </Label>
        </div>
        
        {/* Generated Code */}
        <div className="text-sm code-content flex-1 overflow-y-auto">
          <SyntaxHighlighter 
            code={code} 
            language={getSyntaxLanguage(selectedLanguage)}
            className="h-full"
          />
        </div>
      </BoxContent>
    </Box>
  );
};

