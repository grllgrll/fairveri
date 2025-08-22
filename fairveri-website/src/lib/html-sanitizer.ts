/**
 * HTML sanitization utilities for safely rendering user content
 * 
 * This module provides utilities to sanitize HTML content and prevent XSS attacks
 * while preserving safe formatting like highlighting and basic text formatting.
 */

// Simple HTML sanitizer for search highlights and basic text formatting
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Allow only specific safe tags and remove everything else
  const allowedTags = ['mark', 'strong', 'em', 'b', 'i', 'u', 'br'];
  const allowedAttributes = ['class'];

  // Remove script tags and their content completely
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove on* event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: urls
  sanitized = sanitized.replace(/javascript:\s*[^"']*/gi, '');
  
  // Remove href attributes that contain javascript
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  // Remove src attributes that contain javascript
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  // Remove data: URLs except for images
  sanitized = sanitized.replace(/(?:href|src)\s*=\s*["']data:(?!image\/)[^"']*["']/gi, '');
  
  // Remove all tags except allowed ones
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase();
    
    if (!allowedTags.includes(lowerTagName)) {
      return '';
    }
    
    // For allowed tags, remove disallowed attributes
    if (match.includes('=')) {
      return match.replace(/\s+([a-zA-Z-]+)\s*=\s*["'][^"']*["']/g, (attrMatch, attrName) => {
        const lowerAttrName = attrName.toLowerCase();
        return allowedAttributes.includes(lowerAttrName) ? attrMatch : '';
      });
    }
    
    return match;
  });
  
  // Decode common HTML entities to prevent double encoding
  const entityMap: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  Object.entries(entityMap).forEach(([entity, char]) => {
    sanitized = sanitized.replace(new RegExp(entity, 'g'), char);
  });
  
  return sanitized.trim();
}

// Create safe HTML for search highlighting
export function createSafeHighlight(text: string, searchTerm: string): string {
  if (!text || !searchTerm) {
    return escapeHTML(text || '');
  }
  
  const escapedText = escapeHTML(text);
  const escapedSearchTerm = escapeHTML(searchTerm);
  
  // Create safe highlight with escaped content
  const highlightRegex = new RegExp(`(${escapedSearchTerm})`, 'gi');
  return escapedText.replace(highlightRegex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
}

// Escape HTML characters to prevent XSS
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=\/]/g, (match) => escapeMap[match] || match);
}

// Strip all HTML tags and return plain text
export function stripHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Truncate HTML content while preserving tag structure
export function truncateHTML(html: string, maxLength: number): string {
  const plainText = stripHTML(html);
  
  if (plainText.length <= maxLength) {
    return html;
  }
  
  // Find truncation point
  let truncated = '';
  let currentLength = 0;
  let inTag = false;
  
  for (let i = 0; i < html.length && currentLength < maxLength; i++) {
    const char = html[i];
    
    if (char === '<') {
      inTag = true;
    } else if (char === '>') {
      inTag = false;
    } else if (!inTag) {
      currentLength++;
    }
    
    truncated += char;
  }
  
  // Add ellipsis if truncated
  if (currentLength >= maxLength) {
    truncated += '...';
  }
  
  return truncated;
}

// Validate if HTML content is safe (basic check)
export function isHTMLSafe(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return true;
  }
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script\b/i,
    /<style\b/i,
    /javascript:/i,
    /vbscript:/i,
    /data:(?!image\/)/i,
    /on\w+\s*=/i,
    /<iframe\b/i,
    /<object\b/i,
    /<embed\b/i,
    /<form\b/i,
    /<input\b/i,
    /<meta\b/i,
    /<link\b/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(html));
}

// React component safe HTML props creator
export function createSafeHTMLProps(html: string): { dangerouslySetInnerHTML: { __html: string } } {
  return {
    dangerouslySetInnerHTML: {
      __html: sanitizeHTML(html)
    }
  };
}

export default {
  sanitizeHTML,
  createSafeHighlight,
  escapeHTML,
  stripHTML,
  truncateHTML,
  isHTMLSafe,
  createSafeHTMLProps
};