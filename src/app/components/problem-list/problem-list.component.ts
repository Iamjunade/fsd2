import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule, CommonModule, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-104px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="mb-12">
            <div class="inline-block bg-primary text-black px-3 py-1 text-[10px] font-black uppercase mb-4 border-2 border-black">SYSTEM_STATUS: ACTIVE</div>
            <h1 class="text-6xl md:text-8xl font-black leading-[0.8] tracking-tighter uppercase mb-2 break-all skew-brutal" style="text-shadow: 8px 8px 0 #b90df2;">
              BRUTAL_<br/><span class="text-primary italic">CHALLENGES</span>
            </h1>
          </div>

          <!-- Controls/Filters Horizontal Bar -->
          <div class="mb-12 bg-[#111] border-4 border-black p-4 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center neo-brutalist-shadow">
            <div class="flex-1">
              <label class="block text-[8px] font-black uppercase mb-2 text-slate-500">SEARCH_MANIFEST</label>
              <div class="flex items-stretch border-2 border-black bg-black">
                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" 
                  class="w-full bg-transparent border-none focus:ring-0 text-xs font-bold uppercase placeholder:text-slate-700 py-2 px-3 text-white" 
                  placeholder="ENTER_QUERY">
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-4">
              <div class="flex border-2 border-black bg-black overflow-hidden">
                <button (click)="subsystemFilter.set('All')" 
                  [class.bg-primary]="subsystemFilter() === 'All'"
                  [class.text-black]="subsystemFilter() === 'All'"
                  class="px-4 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-primary/20">
                  ALL_SYSTEMS
                </button>
                <button (click)="subsystemFilter.set('ALGO_HACK')" 
                  [class.bg-primary]="subsystemFilter() === 'ALGO_HACK'"
                  [class.text-black]="subsystemFilter() === 'ALGO_HACK'"
                  class="px-4 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-primary/20">
                  ALGO
                </button>
                <button (click)="subsystemFilter.set('NET_PROTOCOL')" 
                  [class.bg-primary]="subsystemFilter() === 'NET_PROTOCOL'"
                  [class.text-black]="subsystemFilter() === 'NET_PROTOCOL'"
                  class="px-4 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-primary/20">
                  NETWORK
                </button>
              </div>

              <div class="flex border-2 border-black bg-black overflow-hidden">
                <button (click)="difficultyFilter.set('Easy')" 
                  [class.bg-green-500]="difficultyFilter() === 'Easy'"
                  [class.text-black]="difficultyFilter() === 'Easy'"
                  class="px-3 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-green-500/20">STABLE</button>
                <button (click)="difficultyFilter.set('Medium')" 
                  [class.bg-yellow-500]="difficultyFilter() === 'Medium'"
                  [class.text-black]="difficultyFilter() === 'Medium'"
                  class="px-3 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-yellow-500/20">UNSTABLE</button>
                <button (click)="difficultyFilter.set('Hard')" 
                  [class.bg-red-600]="difficultyFilter() === 'Hard'"
                  class="px-3 py-2 font-black text-[10px] uppercase border-r-2 border-black last:border-0 hover:bg-red-600/20">HARDCORE</button>
              </div>
            </div>
          </div>

          @if (problemService.loading()) {
            <div class="flex items-center justify-center p-20">
               <div class="text-4xl font-black uppercase animate-pulse text-primary tracking-widest">LOADING_DATA...</div>
            </div>
          } @else if (filteredProblems().length === 0) {
            <div class="border-4 border-black border-dashed p-20 text-center bg-[#111]">
               <h3 class="text-2xl font-black uppercase mb-4">NO_TARGETS_FOUND</h3>
               <button (click)="searchQuery.set(''); difficultyFilter.set('All'); subsystemFilter.set('All')" 
                 class="px-6 py-2 bg-white text-black font-black uppercase text-xs border-4 border-black">
                 RESET_FILTERS
               </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              @for (problem of filteredProblems(); track problem.id; let i = $index) {
                <div class="border-4 border-black bg-[#111] overflow-hidden neo-brutalist-shadow flex flex-col relative transition-all hover:border-primary group">
                  <!-- Header -->
                  <div class="px-4 py-2 font-black uppercase text-[10px] border-b-4 border-black flex justify-between items-center bg-black/50"
                    [class.text-green-500]="problem.difficulty === 'Easy'"
                    [class.text-yellow-500]="problem.difficulty === 'Medium'"
                    [class.text-red-600]="problem.difficulty === 'Hard'">
                    <span>THREAT: {{ getThreatLabel(problem.difficulty) }}</span>
                    <mat-icon class="text-sm h-auto w-auto">{{ getThreatIcon(problem.difficulty) }}</mat-icon>
                  </div>

                  <!-- Content -->
                  <div class="p-6 flex-1">
                    <div class="flex justify-between items-start mb-4">
                      <h2 class="text-2xl font-black uppercase leading-none tracking-tighter group-hover:text-primary transition-colors">{{ problem.title }}</h2>
                      <span class="bg-black text-slate-500 px-2 py-0.5 text-[8px] font-black mono border border-slate-800">0x{{ problem.id?.substring(0, 4) || '??' }}</span>
                    </div>
                    <p class="font-bold text-[10px] mb-6 uppercase leading-snug text-slate-400">{{ problem.description }}</p>
                    
                    <div class="flex flex-wrap gap-2">
                      @for (tag of (problem.tags || ['UNLABELED']); track tag) {
                        <span class="border-2 border-black px-2 py-0.5 text-[8px] font-black uppercase bg-black text-slate-500">{{ tag }}</span>
                      }
                    </div>
                  </div>

                  <!-- Footer/Action -->
                  <div class="p-6 pt-0 mt-auto">
                    <button [routerLink]="['/problems', problem.id]" 
                      class="w-full bg-primary text-black border-4 border-black py-4 font-black uppercase text-sm neo-brutalist-shadow-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                      INITIATE_HACK
                    </button>
                  </div>
                </div>
              }

              <!-- Propose Card -->
              <div class="border-4 border-black bg-primary/5 border-dashed overflow-hidden flex flex-col relative justify-center items-center p-10 text-center min-h-[300px] group hover:bg-primary/10 transition-colors">
                <mat-icon class="text-6xl mb-4 text-primary h-auto w-auto">add_box</mat-icon>
                <h3 class="text-xl font-black uppercase">PROPOSE_LOG</h3>
                <p class="text-[8px] font-bold uppercase mt-2 text-slate-500">REQUEST NEW CHALLENGE VECTOR FROM COMMAND</p>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ProblemListComponent {
  problemService = inject(ProblemService);
  authService = inject(AuthService);
  
  searchQuery = signal('');
  difficultyFilter = signal('All');
  subsystemFilter = signal('All');
  
  filteredProblems = computed(() => {
    let problems = this.problemService.problems();
    
    // Add mock data if empty for UI verification
    if (problems.length === 0 && !this.problemService.loading()) {
      problems = [
        {
          id: '0x8842',
          title: 'Memory_Void',
          difficulty: 'Hard',
          description: 'Optimize a raw memory allocator to handle fragmented heaps under 50ms latency.',
          tags: ['C++', 'SYSTEMS', 'LOW_LEVEL'],
          subsystem: 'LOW_LEVEL_C',
          createdAt: new Date().toISOString(),
          sampleInput: '',
          sampleOutput: ''
        },
        {
          id: '0x4421',
          title: 'Packet_Sieve',
          difficulty: 'Easy',
          description: 'Filter high-throughput network traffic using SIMD instructions for maximum velocity.',
          tags: ['RUST', 'NETWORK'],
          subsystem: 'NET_PROTOCOL',
          createdAt: new Date().toISOString(),
          sampleInput: '',
          sampleOutput: ''
        },
        {
          id: '0x1102',
          title: 'Crypto_Grind',
          difficulty: 'Medium',
          description: 'Decrypt a custom XOR-ciphered stream with 1024-bit rotating keys in parallel.',
          tags: ['SECURITY', 'MATH'],
          subsystem: 'ALGO_HACK',
          createdAt: new Date().toISOString(),
          sampleInput: '',
          sampleOutput: ''
        }
      ];
    }

    if (this.difficultyFilter() !== 'All') {
      problems = problems.filter(p => p.difficulty === this.difficultyFilter());
    }

    if (this.subsystemFilter() !== 'All') {
      problems = problems.filter(p => p.subsystem === this.subsystemFilter());
    }
    
    if (this.searchQuery().trim() !== '') {
      const query = this.searchQuery().toLowerCase();
      problems = problems.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    return problems;
  });

  getThreatColor(difficulty: string) {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-black';
      case 'Medium': return 'bg-yellow-500 text-black';
      case 'Hard': return 'bg-red-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  }

  getThreatLabel(difficulty: string) {
    switch (difficulty) {
      case 'Easy': return 'STABLE';
      case 'Medium': return 'UNSTABLE';
      case 'Hard': return 'HARDCORE';
      default: return 'UNKNOWN';
    }
  }

  getThreatIcon(difficulty: string) {
    switch (difficulty) {
      case 'Easy': return 'check_circle';
      case 'Medium': return 'bolt';
      case 'Hard': return 'warning';
      default: return 'help';
    }
  }
}
