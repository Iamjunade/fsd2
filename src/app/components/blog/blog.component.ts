import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <main class="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <div class="max-w-6xl mx-auto pb-20">
          <div class="mb-16">
            <h1 class="text-9xl font-black italic uppercase text-white tracking-tighter leading-none skew-brutal" style="text-shadow: 10px 10px 0 #b90df2;">
              DATA_LOGS
            </h1>
            <div class="h-4 bg-primary w-64 -mt-4 mb-4"></div>
            <p class="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500">TRANSMISSIONS_FROM_THE_CORE</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Blog Posts -->
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-[#111] border-4 border-white p-8 neo-brutalist-shadow hover:translate-x-1 hover:-translate-y-1 transition-all cursor-pointer group">
                <div class="text-[10px] font-mono text-primary mb-4 flex justify-between">
                  <span>ENTRY #000{{i}}</span>
                  <span>[2026-03-{{10+i}}]</span>
                </div>
                <h3 class="text-2xl font-black uppercase mb-4 group-hover:text-primary transition-colors">DECRYPTING_THE_QUANTUM_BUFFER</h3>
                <p class="text-xs font-bold text-slate-500 uppercase mb-8 leading-tight">Implementing a rolling XOR cipher across distributed nodes to prevent spectral leakages in the core memory bank.</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/10 uppercase font-black text-[10px]">
                  <span class="bg-white text-black px-2 py-1 italic">READ_MORE</span>
                  <span class="text-slate-700">64KB_RAW</span>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .skew-brutal { transform: skewY(-1deg); }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
export class BlogComponent {}
