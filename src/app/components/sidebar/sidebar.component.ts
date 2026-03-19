import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-full sm:w-72 bg-[#111] border-r-4 border-black flex flex-shrink-0 flex-col p-6 z-20 h-full overflow-y-auto custom-scrollbar">
      <div class="mb-8">
        <div class="flex items-center gap-4 p-4 bg-black border-4 border-black mb-4 neo-brutalist-shadow-primary border-primary">
          <div class="w-10 h-10 bg-primary border-4 border-black flex items-center justify-center">
            <mat-icon class="text-white text-base">person</mat-icon>
          </div>
          <div class="overflow-hidden">
            <h3 class="text-[10px] font-black uppercase tracking-tighter text-primary truncate">{{ authService.currentUser()?.username || 'SYSTEM_GUEST' }}</h3>
            <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">RANK: ELITE</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 space-y-1">
        <!-- New Navigation Hierarchy -->
        <a routerLink="/identity" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary" [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">fingerprint</mat-icon> IDENTITY
        </a>
        <a routerLink="/manifesto" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">description</mat-icon> THE MANIFESTO
        </a>
        <a routerLink="/blog" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">history_edu</mat-icon> BLOG
        </a>
        <a routerLink="/community" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">groups</mat-icon> COMMUNITY
        </a>
        <a routerLink="/connect" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">alternate_email</mat-icon> CONNECT
        </a>

        <div class="my-6 border-t-2 border-slate-800 pt-4 px-2">
           <span class="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">SYSTEM_TOOLS</span>
        </div>

        <a routerLink="/problems" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">bolt</mat-icon> CHALLENGES
        </a>
        <a routerLink="/submissions" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">code</mat-icon> SUBMISSIONS
        </a>
        <a routerLink="/leaderboard" routerLinkActive="bg-primary text-black neo-brutalist-shadow border-primary"
           class="flex items-center gap-4 p-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white border-4 border-transparent transition-all">
          <mat-icon class="text-xs">emoji_events</mat-icon> LEADERBOARD
        </a>

        @if (authService.currentUser()?.role === 'admin') {
          <a routerLink="/admin" routerLinkActive="bg-red-600 text-white border-red-600"
             class="flex items-center gap-4 p-3 font-black text-[10px] uppercase tracking-widest text-red-900 hover:text-red-500 border-l-4 border-transparent transition-all mt-4">
            <mat-icon class="text-xs">admin_panel_settings</mat-icon> ADMIN_CONSOLE
          </a>
        }
      </nav>

      <div class="mt-auto pt-6 border-t-2 border-slate-800">
        <div class="p-4 border-2 border-dashed border-slate-700 font-mono text-[8px] text-slate-500 leading-tight">
          SYSTEM_ID: 0xFD2900<br>
          SECURE_TUNNEL_ACTIVE
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
    .neo-brutalist-shadow { box-shadow: 4px 4px 0 0 #000; }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
}
