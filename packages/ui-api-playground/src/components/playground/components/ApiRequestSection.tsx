'use client';

import React, { useState } from 'react';
import { Box, BoxContent, BoxHeader, BoxTitle } from '@workspace/ui-core/components/box';
import { Badge } from '@workspace/ui-core/components/badge';
import { Button } from '@workspace/ui-core/components/button';
import { Airplay, Copy, Check } from 'lucide-react';
import { PlaygroundConfig } from '../utils/requestBodyGenerators';

interface ApiRequestSectionProps {
  apiEndpoint: 'sendzen' | 'facebook';
  config: PlaygroundConfig;
  generateRequestBody: (config: PlaygroundConfig) => any;
}

export const ApiRequestSection: React.FC<ApiRequestSectionProps> = ({
  apiEndpoint,
  config,
  generateRequestBody
}) => {
  const [copied, setCopied] = useState(false);
  const endpointUrl = apiEndpoint === 'sendzen' 
    ? '<YOUR_API_BASE_URL>/v1/messages'
    : `https://graph.facebook.com/v21.0/${config.phoneNumberId || '{phone_number_id}'}/messages`;

  const requestBody = generateRequestBody(config);
  const requestBodyJson = JSON.stringify(requestBody, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestBodyJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box className="flex shrink-0 flex-col rounded-lg border shadow-sm transition-shadow hover:shadow-md lg:min-h-0 lg:flex-1 lg:basis-0 lg:overflow-hidden">
      <BoxHeader className="shrink-0 pb-2">
        <div className="flex items-center justify-between gap-2">
          <BoxTitle className="flex min-w-0 items-center gap-2 text-base text-foreground">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded">
              <Airplay className="h-4 w-4 text-primary" />
            </div>
            API Request
          </BoxTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="min-h-11 shrink-0 px-3 lg:h-7 lg:min-h-0 lg:px-2"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </BoxHeader>

      <BoxContent className="flex flex-col gap-2 px-3 pt-0 pb-3 lg:min-h-0 lg:flex-1">
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2 py-1.5">
          <Badge variant="success" className="shrink-0 bg-green-100 text-green-800">
            POST
          </Badge>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground" title={endpointUrl}>
            {endpointUrl}
          </span>
        </div>
        <pre className="max-h-64 min-h-40 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg border border-border bg-muted p-3 font-mono text-sm text-muted-foreground lg:max-h-none lg:min-h-0">
          {requestBodyJson}
        </pre>
      </BoxContent>
    </Box>
  );
};

