'use client';

import React from 'react';
import { Box, BoxContent, BoxHeader, BoxTitle } from '@workspace/ui-core/components/box';
import { Badge } from '@workspace/ui-core/components/badge';
import { Check, FileText, ExternalLink } from 'lucide-react';

interface ApiResponseSectionProps {
  isLoading: boolean;
  showResponse: boolean;
  apiResponse: any;
  apiError: string | null;
  requestDuration: number | null;
  dictionary?: {
    apiResponse?: {
      activityLogNote?: string;
      activityLogLink?: string;
      activityLogNoteSuffix?: string;
    };
  };
}

export const ApiResponseSection: React.FC<ApiResponseSectionProps> = ({
  isLoading,
  showResponse,
  apiResponse,
  apiError,
  requestDuration,
  dictionary
}) => {
  // Default English translations
  const defaultTranslations = {
    activityLogNote: '💡 You can visit the',
    activityLogLink: 'Activity log',
    activityLogNoteSuffix: 'to see your message delivery status.'
  };

  // Use dictionary translations if available, otherwise use defaults
  const translations = dictionary?.apiResponse || defaultTranslations;
  // Valid locales from the i18n config
  const validLocales = ['en', 'es', 'de', 'pt', 'ru', 'it', 'fr', 'nl'];
  const defaultLocale = 'en';

  // Helper function to get the notifications URL with proper locale handling
  const getNotificationsUrl = (): string => {
    if (typeof window === 'undefined') {
      return '/whatsapp-api/notifications';
    }

    const pathname = window.location.pathname;
    const localeMatch = pathname.match(/^\/([^/]+)/);
    const firstSegment = localeMatch?.[1] ?? '';

    // Check if first segment is a valid locale
    const locale = firstSegment && validLocales.includes(firstSegment) ? firstSegment : defaultLocale;

    // For default locale (en), don't add prefix; for others, add locale prefix
    if (locale === defaultLocale) {
      return '/whatsapp-api/notifications';
    }
    return `/${locale}/whatsapp-api/notifications`;
  };
  const responseJson = JSON.stringify(apiResponse?.data || { error: 'No response data' }, null, 2);

  return (
    <Box className="flex min-h-0 flex-col rounded-lg border shadow-sm transition-shadow hover:shadow-md lg:flex-1 lg:basis-0 lg:overflow-hidden">
      <BoxHeader className="shrink-0 px-3 py-2">
        <BoxTitle className="flex items-center gap-2 text-base text-foreground">
          <div className="flex h-4 w-4 items-center justify-center rounded">
            <Check className="h-4 w-4 text-primary" />
          </div>
          API Response
        </BoxTitle>
      </BoxHeader>

      <BoxContent className="flex flex-col gap-2 px-3 py-2 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        <div className="response-body lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {isLoading ? (
            <div className="response-loading flex min-h-24 items-center justify-center">
              <div className="loading-content text-center text-muted-foreground">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-sm">Sending API request...</p>
                <p className="mt-1 text-sm text-muted-foreground/70">Measuring response time</p>
              </div>
            </div>
          ) : showResponse ? (
            <div className="response-content flex flex-col gap-2">
              <div className="response-header flex flex-wrap items-center gap-2">
                <Badge className={`text-sm ${apiResponse?.status >= 200 && apiResponse?.status < 300
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                  }`}>
                  {apiResponse?.status || 'Error'} {apiResponse?.statusText}
                </Badge>
                <span className="text-sm text-muted-foreground">POST /v1/messages</span>
                {requestDuration !== null && (
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-sm text-primary">
                    {requestDuration}ms
                  </Badge>
                )}
              </div>

              {apiError && (
                <div className="error-message rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="mt-1 text-sm text-red-700">{apiError}</p>
                </div>
              )}

              <pre className="response-json-container max-h-52 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg border border-border bg-muted p-3 font-mono text-sm lg:max-h-none">
                {responseJson}
              </pre>
            </div>
          ) : (
            <div className="response-placeholder flex items-center justify-center px-1 py-2 lg:h-full">
              <div className="placeholder-content text-center text-muted-foreground">
                <FileText className="mx-auto mb-1 h-5 w-5 opacity-50" />
                <p className="text-sm leading-5">Click &quot;Test API Call&quot; to see the response here</p>
              </div>
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-border pt-2 text-sm leading-5 text-muted-foreground">
          {translations.activityLogNote}{' '}
          <a
            href={getNotificationsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline"
          >
            {translations.activityLogLink}
            <ExternalLink className="h-3 w-3" />
          </a>
          {' '}{translations.activityLogNoteSuffix}
        </p>
      </BoxContent>
    </Box>
  );
};

