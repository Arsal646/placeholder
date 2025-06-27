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
  currentYear = new Date().getFullYear();


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
      format: ['png'],
      fontFamily: ['lato']  // Default font supported by placehold.co
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
    this.title.setTitle('Free Image Placeholder Generator for Developers & Designers');

    // Meta description and keywords
    this.meta.updateTag({
      name: 'description',
      content: 'Create custom image placeholders in any size, color, or format. Perfect for web design, UI/UX, and mockups. No login. Instant preview. Easy download & sharing.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'image placeholder, placeholder generator, dummy images, web design tool, mockup generator, responsive image placeholder'
    });

    // Open Graph (Facebook, LinkedIn, etc.)
    this.meta.updateTag({ property: 'og:title', content: 'Free Image Placeholder Generator Tool' });
    this.meta.updateTag({ property: 'og:description', content: 'Generate custom image placeholders instantly for web design, mockups, and prototyping. Fully responsive and free to use.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://imageplaceholder.dev/' });
    this.meta.updateTag({ property: 'og:image', content: 'https://imageplaceholder.dev/og-image.png' }); // Replace with actual image URL if you add one

    // Optional: Twitter Card support
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Free Image Placeholder Generator Tool' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Create custom placeholder images instantly for web and UI mockups. No sign-up needed.' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://imageplaceholder.dev/og-image.png' }); // Replace as needed


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
      "description": "Free online tool to generate custom image placeholder",
      "url": window.location.href,
      "applicationCategory": "Design Tool"
    });

    document.head.appendChild(script);
  }



  presets = [
    {
      label: 'Web Banner',
      config: {
        width: 1200,
        height: 400,
        backgroundColor: '#e0e0e0',
        textColor: '#000000',
        customText: 'Web Banner',
        format: 'png',
        fontFamily: 'roboto'
      }
    },
    {
      label: 'Instagram Post',
      config: {
        width: 1080,
        height: 1080,
        backgroundColor: '#fdf6e3',
        textColor: '#333333',
        customText: 'Instagram Post',
        format: 'jpg',
        fontFamily: 'montserrat'
      }
    },
    {
      label: 'Mobile Preview',
      config: {
        width: 375,
        height: 667,
        backgroundColor: '#d1d5db',
        textColor: '#111827',
        customText: 'Mobile View',
        format: 'webp',
        fontFamily: 'inter'
      }
    },
    {
      label: 'Facebook Cover',
      config: {
        width: 820,
        height: 312,
        backgroundColor: '#4267B2',
        textColor: '#ffffff',
        customText: 'Facebook Cover',
        format: 'png',
        fontFamily: 'open sans'
      }
    },
    {
      label: 'YouTube Thumbnail',
      config: {
        width: 1280,
        height: 720,
        backgroundColor: '#ff0000',
        textColor: '#ffffff',
        customText: 'YouTube Thumbnail',
        format: 'jpg',
        fontFamily: 'oswald'
      }
    },
    {
      label: 'Ad Banner (300x250)',
      config: {
        width: 300,
        height: 250,
        backgroundColor: '#fef2f2',
        textColor: '#7f1d1d',
        customText: 'Ad Banner',
        format: 'png',
        fontFamily: 'poppins'
      }
    },
    {
      label: 'App Icon (512x512)',
      config: {
        width: 512,
        height: 512,
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        customText: 'App Icon',
        format: 'webp',
        fontFamily: 'lato'
      }
    },
    {
      label: 'Twitter Post',
      config: {
        width: 1200,
        height: 675,
        backgroundColor: '#1DA1F2',
        textColor: '#ffffff',
        customText: 'Twitter Post',
        format: 'jpg',
        fontFamily: 'nunito'
      }
    },
    {
      label: 'LinkedIn Post',
      config: {
        width: 1200,
        height: 627,
        backgroundColor: '#0077B5',
        textColor: '#ffffff',
        customText: 'LinkedIn Post',
        format: 'jpg',
        fontFamily: 'ubuntu'
      }
    }
  ];


  presetCategories = [
    {
      name: "Social Media",
      value: [
        {
          label: 'Instagram Story',
          config: {
            width: 1080,
            height: 1920,
            backgroundColor: '#E1306C',
            textColor: '#FFFFFF',
            fontFamily: 'poppins'
          }
        },
        {
          label: 'Facebook Post',
          config: {
            width: 1200,
            height: 630,
            backgroundColor: '#4267B2',
            textColor: '#FFFFFF',
            fontFamily: 'poppins'
          }
        },
        {
          label: 'Twitter Header',
          config: {
            width: 1500,
            height: 500,
            backgroundColor: '#1DA1F2',
            textColor: '#FFFFFF',
            fontFamily: 'poppins'
          }
        },
        {
          label: 'LinkedIn Banner',
          config: {
            width: 1584,
            height: 396,
            backgroundColor: '#0077B5',
            textColor: '#FFFFFF',
            fontFamily: 'poppins'
          }
        }
      ],
      bgColor: '#E3F2FD',
      textColor: '#0D47A1',
      fontFamily: 'poppins'
    },
    {
      name: "Web Development",
      value: [
        {
          label: 'Desktop Hero',
          config: {
            width: 1920,
            height: 1080,
            backgroundColor: '#F5F5F5',
            textColor: '#333333',
            fontFamily: 'roboto'
          }
        },
        {
          label: 'Mobile Hero',
          config: {
            width: 375,
            height: 667,
            backgroundColor: '#E0E0E0',
            textColor: '#222222',
            fontFamily: 'roboto'
          }
        },
        {
          label: 'Card Image',
          config: {
            width: 300,
            height: 200,
            backgroundColor: '#FFFFFF',
            textColor: '#444444',
            fontFamily: 'roboto'
          }
        },
        {
          label: 'Blog Thumbnail',
          config: {
            width: 400,
            height: 300,
            backgroundColor: '#FAFAFA',
            textColor: '#333333',
            fontFamily: 'roboto'
          }
        },
        {
          label: 'Banner Ad',
          config: {
            width: 728,
            height: 90,
            backgroundColor: '#FFEB3B',
            textColor: '#000000',
            fontFamily: 'roboto'
          }
        },
        {
          label: 'Square Thumbnail',
          config: {
            width: 150,
            height: 150,
            backgroundColor: '#EEEEEE',
            textColor: '#555555',
            fontFamily: 'roboto'
          }
        }
      ],
      bgColor: '#E8F5E9',
      textColor: '#2E7D32',
      fontFamily: 'roboto'
    },
    {
      name: "Video & Streaming",
      value: [
        {
          label: 'YouTube Banner',
          config: {
            width: 2560,
            height: 1440,
            backgroundColor: '#FF0000',
            textColor: '#FFFFFF',
            fontFamily: 'oswald'
          }
        },
        {
          label: 'Twitch Overlay',
          config: {
            width: 1920,
            height: 1080,
            backgroundColor: '#9147FF',
            textColor: '#FFFFFF',
            fontFamily: 'oswald'
          }
        },
        {
          label: 'Video Preview',
          config: {
            width: 640,
            height: 360,
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            fontFamily: 'oswald'
          }
        },
        {
          label: 'Podcast Cover',
          config: {
            width: 1400,
            height: 1400,
            backgroundColor: '#1A1A1A',
            textColor: '#FFFFFF',
            fontFamily: 'oswald'
          }
        },
        {
          label: 'Stream Thumbnail',
          config: {
            width: 480,
            height: 270,
            backgroundColor: '#333333',
            textColor: '#FFFFFF',
            fontFamily: 'oswald'
          }
        }
      ],
      bgColor: '#F3E5F5',
      textColor: '#6A1B9A',
      fontFamily: 'oswald'
    },
    {
      name: "E-commerce",
      value: [
        {
          label: 'Product Image',
          config: {
            width: 800,
            height: 800,
            backgroundColor: '#FFFFFF',
            textColor: '#333333',
            fontFamily: 'lato'
          }
        },
        {
          label: 'Product Gallery',
          config: {
            width: 600,
            height: 600,
            backgroundColor: '#F9F9F9',
            textColor: '#444444',
            fontFamily: 'lato'
          }
        },
        {
          label: 'Category Banner',
          config: {
            width: 1200,
            height: 400,
            backgroundColor: '#FF5722',
            textColor: '#FFFFFF',
            fontFamily: 'lato'
          }
        },
        {
          label: 'Product Thumbnail',
          config: {
            width: 200,
            height: 200,
            backgroundColor: '#EEEEEE',
            textColor: '#333333',
            fontFamily: 'lato'
          }
        },
        {
          label: 'Zoom Image',
          config: {
            width: 1200,
            height: 1200,
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontFamily: 'lato'
          }
        },
        {
          label: 'Cart Preview',
          config: {
            width: 100,
            height: 100,
            backgroundColor: '#F5F5F5',
            textColor: '#666666',
            fontFamily: 'lato'
          }
        }
      ],
      bgColor: '#FFF3E0',
      textColor: '#E65100',
      fontFamily: 'lato'
    },
    {
      name: "Mobile Apps",
      value: [
        {
          label: 'App Icon',
          config: {
            width: 1024,
            height: 1024,
            backgroundColor: '#2196F3',
            textColor: '#FFFFFF',
            fontFamily: 'montserrat'
          }
        },
        {
          label: 'iPhone Screen',
          config: {
            width: 375,
            height: 667,
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            fontFamily: 'montserrat'
          }
        },
        {
          label: 'iPad Screen',
          config: {
            width: 768,
            height: 1024,
            backgroundColor: '#F5F5F5',
            textColor: '#333333',
            fontFamily: 'montserrat'
          }
        },
        {
          label: 'Android Screen',
          config: {
            width: 360,
            height: 640,
            backgroundColor: '#3DDC84',
            textColor: '#FFFFFF',
            fontFamily: 'montserrat'
          }
        },
        {
          label: 'Splash Screen',
          config: {
            width: 1125,
            height: 2436,
            backgroundColor: '#6200EE',
            textColor: '#FFFFFF',
            fontFamily: 'montserrat'
          }
        },
        {
          label: 'Profile Avatar',
          config: {
            width: 128,
            height: 128,
            backgroundColor: '#424242',
            textColor: '#FFFFFF',
            fontFamily: 'montserrat'
          }
        }
      ],
      bgColor: '#E1F5FE',
      textColor: '#0277BD',
      fontFamily: 'montserrat'
    },
    {
      name: "Print & Design",
      value: [
        {
          label: 'Business Card',
          config: {
            width: 1050,
            height: 600,
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontFamily: 'merriweather'
          }
        },
        {
          label: 'A4 Document',
          config: {
            width: 2480,
            height: 3508,
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontFamily: 'merriweather'
          }
        },
        {
          label: 'Poster',
          config: {
            width: 1800,
            height: 2400,
            backgroundColor: '#F44336',
            textColor: '#FFFFFF',
            fontFamily: 'merriweather'
          }
        },
        {
          label: 'Flyer',
          config: {
            width: 1275,
            height: 1650,
            backgroundColor: '#FFC107',
            textColor: '#000000',
            fontFamily: 'merriweather'
          }
        },
        {
          label: 'Logo',
          config: {
            width: 500,
            height: 500,
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontFamily: 'merriweather'
          }
        },
        {
          label: 'Letterhead',
          config: {
            width: 2550,
            height: 3300,
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            fontFamily: 'merriweather'
          }
        }
      ],
      bgColor: '#EFEBE9',
      textColor: '#4E342E',
      fontFamily: 'merriweather'
    }
  ];



  applyPreset(preset: any): void {
    this.placeholderForm.patchValue(preset.config);
    this.placeholderForm.get('customText')?.setValue(preset.label)

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToPresetSection() {
    // Example: Scroll to the first category
    const element = document.getElementById('category-social-media');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}