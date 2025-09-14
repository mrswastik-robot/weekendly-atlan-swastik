'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Copy, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '../../../hooks/use-toast';
import {
  exportTimelineAsImage,
  exportTimelineAsPDF,
  copyTimelineToClipboard,
  checkBrowserSupport
} from '../utils/exportHelpers';

export function ExportControls() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);
  const { toast } = useToast();

  // Check browser capabilities
  const browserSupport = checkBrowserSupport();

  const handleExport = async (format: 'png' | 'jpg' | 'pdf' | 'clipboard') => {
    setIsExporting(true);
    setExportType(format);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (format) {
        case 'png':
          await exportTimelineAsImage('timeline-export', 'weekend-timeline', 'png');
          toast({
            title: "Timeline Exported! 🎉",
            description: "Your timeline has been downloaded as a PNG image.",
          });
          break;
        case 'jpg':
          await exportTimelineAsImage('timeline-export', 'weekend-timeline', 'jpg');
          toast({
            title: "Timeline Exported! 🎉",
            description: "Your timeline has been downloaded as a JPG image.",
          });
          break;
        case 'pdf':
          await exportTimelineAsPDF('timeline-export', 'weekend-timeline');
          toast({
            title: "Timeline Exported! 📄",
            description: "Your timeline has been downloaded as a PDF document.",
          });
          break;
        case 'clipboard':
          if (!browserSupport.clipboard) {
            throw new Error('Clipboard not supported in this browser');
          }
          await copyTimelineToClipboard('timeline-export');
          toast({
            title: "Copied to Clipboard! 📋",
            description: "Your timeline image is ready to paste anywhere.",
          });
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PNG Export */}
          <Button 
            onClick={() => handleExport('png')}
            disabled={isExporting || !browserSupport.canvas}
            variant={exportType === 'png' ? 'default' : 'outline'}
            className="flex flex-col h-auto py-4 px-4"
          >
            {isExporting && exportType === 'png' ? (
              <Loader2 className="h-6 w-6 mb-2 animate-spin" />
            ) : (
              <ImageIcon className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm font-medium">PNG Image</span>
            <span className="text-xs text-muted-foreground mt-1">
              High quality, perfect for sharing
            </span>
          </Button>

          {/* JPG Export */}
          <Button 
            onClick={() => handleExport('jpg')}
            disabled={isExporting || !browserSupport.canvas}
            variant={exportType === 'jpg' ? 'default' : 'outline'}
            className="flex flex-col h-auto py-4 px-4"
          >
            {isExporting && exportType === 'jpg' ? (
              <Loader2 className="h-6 w-6 mb-2 animate-spin" />
            ) : (
              <ImageIcon className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm font-medium">JPG Image</span>
            <span className="text-xs text-muted-foreground mt-1">
              Smaller file size, good for email
            </span>
          </Button>

          {/* PDF Export */}
          <Button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting || !browserSupport.canvas}
            variant={exportType === 'pdf' ? 'default' : 'outline'}
            className="flex flex-col h-auto py-4 px-4"
          >
            {isExporting && exportType === 'pdf' ? (
              <Loader2 className="h-6 w-6 mb-2 animate-spin" />
            ) : (
              <FileText className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm font-medium">PDF Document</span>
            <span className="text-xs text-muted-foreground mt-1">
              Print-ready, professional format
            </span>
          </Button>

          {/* Clipboard Copy */}
          <Button 
            onClick={() => handleExport('clipboard')}
            disabled={isExporting || !browserSupport.clipboard || !browserSupport.canvas}
            variant={exportType === 'clipboard' ? 'default' : 'outline'}
            className="flex flex-col h-auto py-4 px-4"
          >
            {isExporting && exportType === 'clipboard' ? (
              <Loader2 className="h-6 w-6 mb-2 animate-spin" />
            ) : (
              <Copy className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm font-medium">Copy Image</span>
            <span className="text-xs text-muted-foreground mt-1">
              Paste directly into apps
            </span>
          </Button>
        </div>

        {/* Export Status */}
        {isExporting && (
          <div className="flex items-center justify-center mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
            <span className="text-sm font-medium">
              {exportType === 'pdf' ? 'Generating PDF...' : 
               exportType === 'clipboard' ? 'Copying to clipboard...' :
               'Generating image...'}
            </span>
          </div>
        )}

        {/* Browser Support Warnings */}
        {(!browserSupport.canvas || !browserSupport.clipboard) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Browser Limitations</p>
                <ul className="text-yellow-700 mt-1 space-y-1">
                  {!browserSupport.canvas && (
                    <li>• Image export not supported in this browser</li>
                  )}
                  {!browserSupport.clipboard && (
                    <li>• Clipboard copy not supported in this browser</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
