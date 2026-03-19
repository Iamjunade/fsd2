import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <main class="flex-1 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-black/40">
        <!-- Terminal Frame -->
        <div class="relative w-full max-w-5xl aspect-video border-[12px] border-[#111] bg-black neo-brutalist-shadow flex flex-col overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
          
          <!-- Top Telemetry -->
          <div class="p-4 flex items-center justify-between pointer-events-none">
            <div class="text-[10px] font-mono text-slate-500">BAUD_RATE: 9600 // STATUS: ENCRYPTED</div>
            <div class="px-2 py-0.5 border-2 border-slate-700 bg-black text-[8px] font-black uppercase text-slate-400">SESSION_HISTORY_V2.0</div>
          </div>

          <div class="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            @if (submissionService.loading()) {
              <div class="animate-pulse flex flex-col items-center gap-4">
                <div class="h-10 w-64 bg-slate-800 mb-2"></div>
                <div class="h-4 w-48 bg-slate-900"></div>
              </div>
            } @else if (submissionService.userSubmissions().length === 0) {
              <h1 class="text-6xl sm:text-7xl md:text-8xl glitch-text-brutal mb-8 select-none" data-text="NO_RECORD_FOUND">
                NO_RECORD_FOUND
              </h1>
              
              <p class="max-w-md text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed mb-12">
                Initial submission sequence not yet established. Connect to the grid to begin data synchronization.
              </p>

              <button routerLink="/problems" class="px-12 py-5 bg-primary text-white border-8 border-black font-black text-xl uppercase tracking-tighter hover:translate-x-2 hover:-translate-y-2 transition-transform neo-brutalist-shadow-white active:translate-x-0 active:translate-y-0 relative group">
                <span class="relative z-10">INITIATE_FIRST_HACK</span>
                <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            } @else {
              <!-- Display real submissions in a scrolling list with brutalist styling -->
              <div class="w-full h-full flex flex-col">
                <div class="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  @for (sub of submissionService.userSubmissions(); track sub.id) {
                    <div class="p-4 border-4 border-[#222] bg-[#050505] flex items-center justify-between hover:border-primary transition-colors group">
                      <div class="flex items-center gap-6">
                        <div class="text-[10px] font-mono text-slate-500 group-hover:text-primary">{{ sub.submittedAt | date:'HH:mm:ss' }}</div>
                        <div class="font-black text-sm uppercase group-hover:text-white truncate max-w-[150px]">{{ sub.problemId }}</div>
                        <div class="px-2 py-0.5 text-[8px] font-black uppercase border-2" 
                          [class.border-green-500]="sub.status === 'Accepted'"
                          [class.text-green-500]="sub.status === 'Accepted'"
                          [class.border-red-600]="sub.status !== 'Accepted'"
                          [class.text-red-600]="sub.status !== 'Accepted'">
                          {{ sub.status }}
                        </div>
                      </div>
                      <div class="text-[10px] font-mono text-slate-500 hidden sm:block">{{ sub.executionTime }}MS // {{ sub.language }}</div>
                      <button [routerLink]="['/problems', sub.problemId]" class="px-3 py-1 bg-white text-black text-[8px] font-black uppercase border-2 border-black hover:bg-primary hover:text-white transition-colors">
                        REPLAY
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Bottom Telemetry overlay -->
          <div class="absolute bottom-4 right-4 pointer-events-none z-20 scale-75 origin-bottom-right sm:scale-100">
            <div class="cyber-footer-box p-3 min-w-[200px]">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[8px] font-black uppercase text-slate-500">NETWORK_LOAD</span>
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div class="w-1.5 h-1.5 bg-yellow-400/30 rounded-full"></div>
                </div>
              </div>
              <div class="space-y-1 font-mono text-[8px] text-slate-400">
                <div class="flex justify-between"><span>EU_WEST_1</span> <span>0.04ms</span></div>
                <div class="flex justify-between"><span>US_EAST_2</span> <span>122.1ms</span></div>
                <div class="flex justify-between text-red-500 font-bold"><span>AP_SOUTH_1</span> <span>OFFLINE</span></div>
              </div>
              <div class="mt-2 pt-2 border-t border-slate-800 text-[8px] font-mono text-primary flex justify-between">
                <span>SESSION_ID: 0x8842</span>
                <span class="text-slate-600">v4.0.2</span>
              </div>
            </div>
          </div>
          
          <div class="absolute left-0 bottom-0 pointer-events-none p-4 vertical-text text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] select-none">
            AUTHENTICATION_REQUIRED
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
export class SubmissionsComponent implements OnInit {
  submissionService = inject(SubmissionService);
  authService = inject(AuthService);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.submissionService.loadUserSubmissions(user.uid);
    }
  }
}
