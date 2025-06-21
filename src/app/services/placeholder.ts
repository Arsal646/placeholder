// src/app/services/placeholder.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaceholderConfig, DEFAULT_CONFIG } from '../models/placeholder-config';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {
  private configSubject = new BehaviorSubject<PlaceholderConfig>(DEFAULT_CONFIG);
  public config$ = this.configSubject.asObservable();

  constructor() {}

  updateConfig(config: PlaceholderConfig): void {
    this.configSubject.next(config);
  }

  getCurrentConfig(): PlaceholderConfig {
    return this.configSubject.value;
  }

generateUrl(formValue: PlaceholderConfig): string {
  const {
    width,
    height,
    backgroundColor,
    textColor,
    customText,
    format,
    fontFamily
  } = formValue;

  const bgColor = backgroundColor.replace('#', '');
  const txtColor = textColor.replace('#', '');

  let url = `https://placehold.co/${width}x${height}/${bgColor}/${txtColor}.${format}`;
  const queryParams: string[] = [];

  if (customText && customText.trim()) {
    queryParams.push(`text=${encodeURIComponent(customText.trim())}`);
  }



   if (fontFamily) {
    queryParams.push(`font=${encodeURIComponent(fontFamily)}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  return url;
}


  async downloadImage(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }
}