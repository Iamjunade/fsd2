import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaderboardService } from '../../services/leaderboard.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <!-- Metadata Margins (Decorative) -->
        <div class="fixed top-28 right-6 text-[10px] font-black text-primary opacity-50 flex flex-col items-end gap-1 pointer-events-none hidden sm:flex">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            LIVE_DATA_STREAM: ACTIVE
          </div>
          <div>BUFFER_LOAD: 14%</div>
          <div>LATENCY: 12MS</div>
          <div class="w-32 h-1 bg-primary mt-2"></div>
        </div>

        <div class="max-w-6xl mx-auto pb-20">
          <!-- Hero Title -->
          <div class="mb-16 relative">
            <h1 class="text-7xl md:text-9xl font-black italic uppercase text-white tracking-tighter leading-[0.8] skew-brutal" 
                style="text-shadow: 12px 12px 0 #b90df2;">
              GLOBAL_<br/>RANKINGS
            </h1>
            <div class="absolute -bottom-4 left-0 w-48 h-4 bg-yellow-400"></div>
          </div>

          @if (leaderboardService.loading()) {
            <div class="py-20 text-center">
              <div class="inline-block animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p class="font-black uppercase tracking-widest text-sm text-primary">SCANNING_CORE_DATABASE...</p>
            </div>
          } @else {
            <!-- TOP 3 Spotlight -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end">
              <!-- Rank 2 -->
              @if (leaderboardService.topPlayers().length >= 2) {
                <div class="order-2 md:order-1 bg-surface-container border-4 border-white p-6 hard-shadow-purple transition-transform hover:-translate-y-2 bg-[#111]">
                  <div class="flex justify-between items-start mb-4">
                    <div class="text-4xl font-black italic text-white">#02</div>
                    <div class="bg-primary text-black px-2 py-0.5 text-[10px] font-black">LVL {{ authService.getLevel(leaderboardService.topPlayers()[1].points) }}</div>
                  </div>
                  <div class="w-full aspect-square bg-surface-bright mb-4 flex items-center justify-center border-2 border-dashed border-primary">
                    <mat-icon class="text-6xl text-primary h-auto w-auto">robot_2</mat-icon>
                  </div>
                  <h3 class="text-xl font-black italic uppercase mb-1 truncate">{{ leaderboardService.topPlayers()[1].username }}</h3>
                  <div class="text-[10px] font-black text-slate-500 mb-2 mt-1 tracking-widest">{{ authService.getRankTitle(leaderboardService.topPlayers()[1].points) }}</div>
                  <div class="text-primary font-bold text-sm tracking-tighter">XP: {{ leaderboardService.topPlayers()[1].points }}</div>
                </div>
              }

              <!-- Rank 1 -->
              @if (leaderboardService.topPlayers().length >= 1) {
                <div class="order-1 md:order-2 bg-gradient-to-br from-primary to-purple-900 border-4 border-yellow-400 p-8 hard-shadow-white transition-transform hover:-translate-y-4 relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-4 opacity-20">
                    <mat-icon class="text-9xl h-auto w-auto text-white">military_tech</mat-icon>
                  </div>
                  <div class="flex justify-between items-start mb-6 relative z-10">
                    <div class="text-6xl font-black italic text-white drop-shadow-[4px_4px_0_#000]">#01</div>
                    <div class="bg-yellow-400 text-black px-3 py-1 text-xs font-black shadow-[4px_4px_0_#000]">LVL {{ authService.getLevel(leaderboardService.topPlayers()[0].points) }}</div>
                  </div>
                  <div class="w-full aspect-square bg-black mb-6 flex items-center justify-center border-4 border-yellow-400 relative z-10 overflow-hidden">
                    <div class="absolute inset-0 bg-primary/20 animate-pulse"></div>
                    <div class="w-full h-full flex items-center justify-center relative z-10">
                      <mat-icon class="text-8xl text-yellow-400 h-auto w-auto">shield</mat-icon>
                    </div>
                  </div>
                  <h3 class="text-3xl font-black italic uppercase mb-1 text-white relative z-10 truncate">{{ leaderboardService.topPlayers()[0].username }}</h3>
                  <div class="text-xs font-black text-yellow-400 mb-3 relative z-10 tracking-[0.2em]">{{ authService.getRankTitle(leaderboardService.topPlayers()[0].points) }}</div>
                  <div class="bg-yellow-400 text-black font-black px-3 py-1 inline-block text-lg relative z-10 tracking-widest">
                    XP: {{ leaderboardService.topPlayers()[0].points }}
                  </div>
                </div>
              }

              <!-- Rank 3 -->
              @if (leaderboardService.topPlayers().length >= 3) {
                <div class="order-3 bg-surface-container border-4 border-white p-6 hard-shadow-purple transition-transform hover:-translate-y-2 bg-[#111]">
                  <div class="flex justify-between items-start mb-4">
                    <div class="text-4xl font-black italic text-white">#03</div>
                    <div class="bg-primary text-black px-2 py-0.5 text-[10px] font-black">LVL {{ authService.getLevel(leaderboardService.topPlayers()[2].points) }}</div>
                  </div>
                  <div class="w-full aspect-square bg-surface-bright mb-4 flex items-center justify-center border-2 border-dashed border-primary">
                    <mat-icon class="text-6xl text-primary h-auto w-auto">skull</mat-icon>
                  </div>
                  <h3 class="text-xl font-black italic uppercase mb-1 truncate">{{ leaderboardService.topPlayers()[2].username }}</h3>
                  <div class="text-[10px] font-black text-slate-500 mb-2 mt-1 tracking-widest">{{ authService.getRankTitle(leaderboardService.topPlayers()[2].points) }}</div>
                  <div class="text-primary font-bold text-sm tracking-tighter">XP: {{ leaderboardService.topPlayers()[2].points }}</div>
                </div>
              }
            </section>

            <!-- Global Rankings -->
            <div class="space-y-4">
              <div class="grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-black uppercase text-primary tracking-[0.2em] border-b border-primary/20 pb-4">
                <div class="col-span-1">RK</div>
                <div class="col-span-5">OPERATOR_ID</div>
                <div class="col-span-3">RANK_STATUS</div>
                <div class="col-span-1 text-center">LVL</div>
                <div class="col-span-2 text-right">TOTAL_XP</div>
              </div>

              <!-- List Items -->
              @for (player of leaderboardService.topPlayers().slice(3); track player.uid; let i = $index) {
                <div class="group relative bg-[#0d0d0d] border-4 border-white p-6 flex items-center justify-between hard-shadow-purple hover:bg-[#1a1a1a] transition-colors cursor-pointer active:translate-x-2 active:translate-y-2 active:shadow-none overflow-hidden">
                  <div class="grid grid-cols-12 gap-4 w-full items-center">
                    <div class="col-span-1 text-3xl font-black italic text-primary/80">
                      {{ (i + 4).toString().padStart(2, '0') }}
                    </div>
                    <div class="col-span-5 flex items-center gap-4">
                      <div class="w-10 h-10 bg-white p-1 border-2 border-black flex-shrink-0">
                        <div class="w-full h-full bg-primary/40 flex items-center justify-center">
                          <mat-icon class="text-black text-sm">person</mat-icon>
                        </div>
                      </div>
                      <span class="font-black italic text-xl uppercase tracking-tighter truncate">{{ player.username }}</span>
                    </div>
                    <div class="col-span-3 text-[10px] font-black text-slate-500 tracking-widest truncate">
                      {{ authService.getRankTitle(player.points) }}
                    </div>
                    <div class="col-span-1 text-center font-black">
                      <span class="bg-primary/20 text-primary px-2 py-0.5 text-xs">L{{ authService.getLevel(player.points) }}</span>
                    </div>
                    <div class="col-span-2 text-right font-black text-2xl tracking-tighter text-white">
                      {{ player.points }}
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .hard-shadow-purple { box-shadow: 8px 8px 0 0 #b90df2; }
    .hard-shadow-white { box-shadow: 8px 8px 0 0 #ffffff; }
    .skew-brutal { transform: skewY(-1deg); }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
  export class LeaderboardComponent implements OnInit {
  leaderboardService = inject(LeaderboardService);
  authService = inject(AuthService);

  ngOnInit() {}
}
