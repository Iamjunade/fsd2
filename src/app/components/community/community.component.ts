import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <main class="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <div class="max-w-6xl mx-auto pb-20">
          <div class="mb-16 text-center">
            <h1 class="text-[12rem] md:text-[18rem] font-black italic uppercase text-white/5 tracking-tighter leading-none absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
              GRID
            </h1>
            <h1 class="text-7xl md:text-[10rem] font-black uppercase text-white relative z-10 glitch-text-brutal" data-text="COMMUNITY">
              COMMUNITY
            </h1>
            <div class="inline-block px-12 py-2 bg-primary text-black font-black uppercase italic -rotate-1 text-2xl mt-4">ACTIVE_NODES: 1,244</div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Active Feed -->
            <div class="border-4 border-white bg-black p-8 neo-brutalist-shadow">
               <div class="text-2xl font-black uppercase text-primary mb-8 underline decoration-primary underline-offset-8 decoration-4">GLOBAL_ACTIVITY_STREAM</div>
               <div class="space-y-6">
                 @for (i of [1,2,3,4,5]; track i) {
                   <div class="flex gap-6 items-start border-l-4 border-primary/20 pl-6 py-2 hover:border-primary transition-all group">
                     <div class="w-12 h-12 bg-white flex items-center justify-center border-4 border-black shrink-0 group-hover:rotate-6">
                       <mat-icon class="text-black">person</mat-icon>
                     </div>
                     <div>
                       <div class="font-black italic uppercase text-white">OPERATOR_0x{{i}}FA2...</div>
                       <p class="text-[10px] font-bold text-slate-500 uppercase">SOLVED CHALLENGE: [QUANTUM_BUFFER_EXPLOIT] // +500 PTS</p>
                       <div class="text-[8px] font-mono text-primary/60 mt-2">TIMESTAMP: 2026-03-19_18:04:{{i}}2</div>
                     </div>
                   </div>
                 }
               </div>
            </div>

            <!-- Global Stats / News -->
            <div class="space-y-8">
               <div class="bg-primary text-black p-12 border-8 border-black font-black uppercase rotate-1">
                 <h3 class="text-5xl mb-4 italic">SYSTEM_UPDATE</h3>
                 <p class="text-sm border-t-2 border-black pt-4">THE GRID IS EXPANDING. NEW CHALLENGE VECTORS ESTABLISHED IN THE NEURAL_NET SUBSYSTEM. PREPARE FOR DEPLOYMENT.</p>
               </div>

               <div class="grid grid-cols-2 gap-4">
                 <div class="p-8 border-4 border-white bg-[#111] neo-brutalist-shadow text-center transition-transform hover:-translate-y-2">
                   <div class="text-5xl font-black italic mb-2">99.9%</div>
                   <div class="text-[8px] font-black uppercase text-slate-500">UPTIME_STABILITY</div>
                 </div>
                 <div class="p-8 border-4 border-primary bg-[#111] neo-brutalist-shadow-primary text-center transition-transform hover:-translate-y-2">
                   <div class="text-5xl font-black italic mb-2 text-primary">0/8</div>
                   <div class="text-[8px] font-black uppercase text-slate-500">THREATS_DETECTED</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
export class CommunityComponent {}
