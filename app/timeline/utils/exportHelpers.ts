import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Preprocess CSS to handle problematic color functions and variables
 */
function preprocessElementForExport(element: HTMLElement): () => void {
  const originalStyles = new Map<HTMLElement, string>();
  const elementsToProcess = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[];
  
  elementsToProcess.forEach(el => {
    originalStyles.set(el, el.style.cssText);
    
    // Get computed styles to resolve CSS variables
    const computedStyle = window.getComputedStyle(el);
    
    // Override problematic properties with computed values
    el.style.backgroundColor = computedStyle.backgroundColor;
    el.style.color = computedStyle.color;
    el.style.borderColor = computedStyle.borderColor;
    el.style.boxShadow = computedStyle.boxShadow;
    
    // Force standard color formats and remove modern CSS functions
    (['backgroundColor', 'color', 'borderColor'] as const).forEach(prop => {
      const value = el.style[prop];
      if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('var('))) {
        // Use computed value which should be resolved to rgb/rgba
        el.style[prop] = computedStyle[prop];
      }
    });
  });
  
  // Return cleanup function
  return () => {
    elementsToProcess.forEach(el => {
      const original = originalStyles.get(el);
      if (original !== undefined) {
        el.style.cssText = original;
      }
    });
  };
}

/**
 * Export timeline as PNG or JPG image using html-to-image
 */
export async function exportTimelineAsImage(
  elementId: string, 
  filename: string = 'weekend-timeline',
  format: 'png' | 'jpg' = 'png'
): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Timeline element not found');
  }

  try {
    // Preprocess CSS to fix color issues
    const cleanup = preprocessElementForExport(element);
    
    // Force a repaint to ensure styles are applied
    void element.offsetHeight;
    
    // Small delay to ensure all styles are computed
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use html-to-image which handles modern CSS better
    const dataUrl = format === 'png' 
      ? await htmlToImage.toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: {
            backgroundColor: '#ffffff'
          }
        })
      : await htmlToImage.toJpeg(element, {
          quality: 0.9,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          style: {
            backgroundColor: '#ffffff'
          }
        });

    // Clean up styles
    cleanup();

    // Download the image
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    link.click();

    return dataUrl;
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export timeline as PDF document using html-to-image
 */
export async function exportTimelineAsPDF(
  elementId: string, 
  filename: string = 'weekend-timeline'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Timeline element not found');
  }

  try {
    // Preprocess CSS to fix color issues
    const cleanup = preprocessElementForExport(element);
    
    // Force a repaint to ensure styles are applied
    void element.offsetHeight;
    
    // Small delay to ensure all styles are computed
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate high-quality image for PDF
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        backgroundColor: '#ffffff'
      }
    });

    // Clean up styles
    cleanup();

    // Convert to PDF
    const pdf = new jsPDF();
    
    // Create image element to get dimensions
    const img = new Image();
    img.onload = () => {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (img.height * imgWidth) / img.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
    };
    img.src = dataUrl;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Copy timeline image to clipboard using html-to-image
 */
export async function copyTimelineToClipboard(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Timeline element not found');
  }

  // Check if clipboard API is supported
  if (!navigator.clipboard || !navigator.clipboard.write) {
    throw new Error('Clipboard API not supported in this browser');
  }

  try {
    // Preprocess CSS to fix color issues
    const cleanup = preprocessElementForExport(element);
    
    // Force a repaint
    void element.offsetHeight;

    // Generate image using html-to-image
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      style: {
        backgroundColor: '#ffffff'
      }
    });

    // Clean up styles
    cleanup();

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  } catch (error) {
    console.error('Clipboard copy error:', error);
    throw new Error(`Failed to copy to clipboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate shareable image URL (for social sharing) using html-to-image
 */
export async function generateShareableImageUrl(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Timeline element not found');
  }

  try {
    // Preprocess CSS to fix color issues
    const cleanup = preprocessElementForExport(element);
    
    // Force a repaint
    void element.offsetHeight;

    // Generate image optimized for sharing
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.9,
      pixelRatio: 1.5, // Balanced quality for sharing
      backgroundColor: '#ffffff',
      style: {
        backgroundColor: '#ffffff'
      }
    });

    // Clean up styles
    cleanup();

    // Convert to blob URL for sharing
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    return url;
  } catch (error) {
    console.error('Shareable image generation error:', error);
    throw new Error(`Failed to generate shareable image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to check if browser supports required APIs
 */
export function checkBrowserSupport(): {
  canvas: boolean;
  clipboard: boolean;
  download: boolean;
} {
  return {
    canvas: typeof HTMLCanvasElement !== 'undefined',
    clipboard: !!(navigator.clipboard && navigator.clipboard.write),
    download: typeof document.createElement === 'function'
  };
}

/**
 * Get optimized export settings based on format and usage
 */
export function getExportSettings(format: 'social' | 'print' | 'email' | 'presentation') {
  const settings = {
    social: {
      scale: 1.5,
      quality: 0.8,
      maxWidth: 1200,
      backgroundColor: '#ffffff'
    },
    print: {
      scale: 2,
      quality: 1.0,
      maxWidth: 2400,
      backgroundColor: '#ffffff'
    },
    email: {
      scale: 1.2,
      quality: 0.7,
      maxWidth: 800,
      backgroundColor: '#ffffff'
    },
    presentation: {
      scale: 2,
      quality: 0.9,
      maxWidth: 1920,
      backgroundColor: '#ffffff'
    }
  };

  return settings[format] || settings.social;
}
