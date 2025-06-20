import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
};

@Directive({
  selector: '[appConfetti]'
})
export class ConfettiDirective implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId = 0;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('click')
  onClick() {
    if (!this.isBrowser) return;

    this.createCanvas();
    this.launchFireworks();

    setTimeout(() => {
      cancelAnimationFrame(this.animationFrameId);
      if (this.canvas) this.canvas.remove();
    }, 1000);
  }

  private createCanvas() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const padding = 60;

    this.canvas = this.renderer.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = `${rect.top + window.scrollY - padding}px`;
    this.canvas.style.left = `${rect.left + window.scrollX - padding}px`;
    this.canvas.width = rect.width + padding * 2;
    this.canvas.height = rect.height + padding * 2;
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1000';

    document.body.appendChild(this.canvas);
  }

  private launchFireworks() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Only star-shaped fireworks, about 40 particles
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 1.8 + 0.7;

      this.particles.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 3,
        alpha: 1,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        rotation: Math.random() * 2 * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.15
      });
    }

    this.animate();
  }

  private animate = () => {
    if (!this.isBrowser) return;

    this.animationFrameId = requestAnimationFrame(this.animate);
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      this.drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
      ctx.fill();
      ctx.restore();
    }

    this.particles = this.particles.filter(p => p.alpha > 0);
    ctx.globalAlpha = 1;
  };

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationFrameId);
      if (this.canvas) this.canvas.remove();
    }
  }
}
