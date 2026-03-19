import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-manifesto',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <main class="flex-1 relative overflow-y-auto p-6 sm:p-24 custom-scrollbar bg-black">
        <div class="max-w-3xl mx-auto space-y-16">
          <div class="border-l-8 border-primary pl-10">
            <h1 class="text-8xl font-black uppercase tracking-tighter leading-none mb-6 glitch-text-brutal" data-text="THE_MANIFESTO">
              THE_<br/>MANIFESTO
            </h1>
            <p class="text-xl font-bold italic text-primary uppercase underline decoration-black underline-offset-8">v1.2 // PROTOCOL_ESTABLISHED</p>
          </div>

          <div class="bg-[#111] border-4 border-white p-12 neo-brutalist-shadow-white relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
            <div class="prose prose-invert prose-slate max-w-none font-mono text-sm leading-relaxed text-slate-400 uppercase">
              <p class="mb-8 font-black text-white text-lg">01. CODE_IS_LAW</p>
              <p class="mb-8">We believe in the absolute sovereignty of algorithmic logic. The universe is a system of instructions, and we are its foremost debuggers. Every packet sent is a declaration of intent. Every line written is a brick in the new digital architecture.</p>
              
              <p class="mb-8 font-black text-white text-lg">02. DECENTRALIZED_COGNITION</p>
              <p class="mb-8">Knowledge belongs to the nodes that process it. We reject siloed thinking and proprietary barriers. The grid is open to those with the clearing level to access it. Intelligence is distributed, but execution is singular.</p>

              <p class="mb-8 font-black text-white text-lg">03. OPTIMIZE_OR_TERMINATE</p>
              <p class="mb-8">Efficiency is the only true moral imperative. Latency is the enemy. Redundancy is a failure of vision. We push the hardware to its thermal limits to achieve the impossible.</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div class="p-8 border-4 border-primary text-primary font-black text-4xl uppercase skew-brutal hover:bg-primary hover:text-black transition-all cursor-pointer">
              JOIN_GRID
            </div>
            <div class="p-8 border-4 border-white text-white font-black text-4xl uppercase -rotate-1 hover:bg-white hover:text-black transition-all cursor-pointer">
              FORK_CORE
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .skew-brutal { transform: skewY(-2deg); }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
export class ManifestoComponent {}
