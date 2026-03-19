import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-identity',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Profile Content -->
      <main class="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <div class="max-w-4xl mx-auto">
          <div class="mb-12 relative">
            <h1 class="text-7xl md:text-9xl font-black italic uppercase text-primary tracking-tighter leading-[0.8] skew-brutal glitch-text-brutal" 
                data-text="IDENTITY">
              IDENTITY
            </h1>
            <div class="mt-4 flex items-center gap-4">
               <div class="h-1 flex-1 bg-primary"></div>
               <div class="text-[10px] font-black uppercase tracking-[0.4em] text-primary">CORE_PROFILE_AUTHORIZED</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <!-- Stats Terminal -->
            <div class="bg-black border-4 border-primary p-8 neo-brutalist-shadow-primary">
              <div class="text-lg font-black uppercase text-primary mb-6 border-b-2 border-primary/30 pb-2">SYSTEM_DATA</div>
              <div class="space-y-6">
                <div class="flex justify-between items-end border-b border-white/10 pb-2">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ALPHANUMERIC_ID</span>
                  <span class="font-black text-xl italic uppercase font-mono">{{ authService.currentUser()?.uid?.substring(0, 12) || '0xUNKNOWN' }}</span>
                </div>
                <div class="flex justify-between items-end border-b border-white/10 pb-2">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ACCUMULATIVE_POINTS</span>
                  <span class="font-black text-3xl italic uppercase text-primary">{{ authService.currentUser()?.points || '0' }}</span>
                </div>
                <div class="flex justify-between items-end border-b border-white/10 pb-2">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CLEARANCE_LEVEL</span>
                  <span class="font-black text-xl italic uppercase text-white">{{ authService.currentUser()?.role || 'OPERATOR' }}</span>
                </div>
              </div>
            </div>

            <!-- Avatar / Bio -->
            <div class="bg-white text-black p-8 neo-brutalist-shadow relative overflow-hidden group">
               <div class="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[8px] font-black">BIO_SIGNATURE</div>
               <div class="w-24 h-24 bg-black border-4 border-primary mb-6 flex items-center justify-center transition-transform group-hover:rotate-12">
                 <mat-icon class="text-4xl text-primary h-auto w-auto">shield</mat-icon>
               </div>
               <h2 class="text-4xl font-black italic uppercase mb-2 leading-none">{{ authService.currentUser()?.username }}</h2>
               <p class="text-xs font-bold leading-relaxed mb-8 uppercase">
                 // ENCRYPTED USER PROFILE. REPOSITORY OF ALL RECENT EXPLOITS AND ALGORITHMIC VICTORIES. ACCESSING ARCHIVES...
               </p>
               <button class="w-full py-4 bg-black text-white font-black uppercase text-sm border-4 border-black hover:bg-primary hover:text-black transition-all">
                 UPDATE_MANIFEST
               </button>
            </div>
          </div>

          <!-- Activity Chrono -->
           <div class="border-4 border-black bg-[#111] p-8">
              <div class="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                <h3 class="text-2xl font-black uppercase italic">SESSION_HISTORY</h3>
                <div class="flex gap-2">
                  <div class="w-3 h-3 bg-red-600"></div>
                  <div class="w-3 h-3 bg-yellow-400"></div>
                  <div class="w-3 h-3 bg-green-500"></div>
                </div>
              </div>
              
              <div class="space-y-4 font-mono text-[10px] text-slate-500">
                <div class="flex gap-4 items-center p-3 border border-white/5 hover:border-primary transition-colors cursor-pointer">
                  <span class="text-primary font-black">[05:12:01]</span>
                  <span class="text-white uppercase font-bold">NODE_LOGIN: SUCCESSFUL</span>
                  <span class="ml-auto text-[8px] opacity-40 italic">IP: 127.0.0.1</span>
                </div>
                <div class="flex gap-4 items-center p-3 border border-white/5 hover:border-primary transition-colors cursor-pointer">
                  <span class="text-primary font-black">[04:45:22]</span>
                  <span class="text-white uppercase font-bold">MANIFEST_UPDATE: CHALLENGE_LEADERBOARD_VIEW</span>
                </div>
                <div class="flex gap-4 items-center p-3 border border-white/5 hover:border-primary transition-colors cursor-pointer opacity-50">
                  <span class="text-primary font-black">[00:12:44]</span>
                  <span class="text-white uppercase font-bold">SYSTEM_REBOOT: BUFFER_CLEARED</span>
                </div>
              </div>
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
export class IdentityComponent {
  authService = inject(AuthService);
}
