// src/app/app.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PlaceholderConfig } from './models/placeholder-config';
import { PlaceholderService } from './services/placeholder';
import { ConfettiDirective } from './directives/confetti';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, ConfettiDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  placeholderForm: FormGroup;
  currentUrl = '';
  copyButtonText = 'Copy';

  formatOptions = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
    { value: 'gif', label: 'GIF' }
  ];

  constructor(
    private fb: FormBuilder,
    private placeholderService: PlaceholderService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.placeholderForm = this.fb.group({
      width: [400],
      height: [300],
      backgroundColor: ['#cccccc'],
      textColor: ['#969696'],
      customText: [''],
      format: ['png']
    });
  }

  ngOnInit(): void {
    this.updatePreview();
    

      if (isPlatformBrowser(this.platformId)) {
    // This code will only run in the browser
    this.setSEOData();
  }
    
    // Listen to form changes
    this.placeholderForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });
  }

  updatePreview(): void {
    const config: PlaceholderConfig = this.placeholderForm.value;
    this.placeholderService.updateConfig(config);
    this.currentUrl = this.placeholderService.generateUrl(config);
  }

  async copyUrl(): Promise<void> {
    await this.placeholderService.copyToClipboard(this.currentUrl);
    this.copyButtonText = 'Copied!';
    setTimeout(() => {
      this.copyButtonText = 'Copy';
    }, 2000);
  }

  async downloadImage(): Promise<void> {
    const config = this.placeholderForm.value;
    const filename = `placeholder-${config.width}x${config.height}.${config.format}`;
    await this.placeholderService.downloadImage(this.currentUrl, filename);
  }

  openInNewTab(): void {
    this.placeholderService.openInNewTab(this.currentUrl);
  }



  private setSEOData() {
    // Set title
    this.title.setTitle('Image Placeholder Generator | Custom Dummy Images for Web Design');
    
    // Set meta tags
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Fast, free image placeholder generator for developers and designers. Create custom dummy images with any dimensions, colors, and text for your projects.' 
    });
    
    this.meta.updateTag({ name: 'keywords', content: 'image placeholder, dummy images, placeholder generator, web design tool, mockup images' });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: 'Free Image Placeholder Generator Tool' });
    this.meta.updateTag({ property: 'og:description', content: 'Generate custom placeholder images instantly for web design and mockups' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    
    // Add schema markup
    this.addJsonLdSchema();
  }

  private addJsonLdSchema() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Image Placeholder Generator",
      "description": "Free online tool to generate custom placeholder images",
      "url": window.location.href,
      "applicationCategory": "Design Tool"
    });
    
    document.head.appendChild(script);
  }
}