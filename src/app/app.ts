// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PlaceholderConfig } from './models/placeholder-config';
import { PlaceholderService } from './services/placeholder';
import { ConfettiDirective } from './directives/confetti';

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
    private placeholderService: PlaceholderService
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
}