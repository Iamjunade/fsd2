import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule, CommonModule],
  template: `
    <div class="min-h-screen terminal-grid bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <main class="max-w-7xl mx-auto px-6 md:px-10 py-10 w-full">
        <div class="mb-12">
          <div class="inline-block bg-primary text-black px-3 py-1 text-xs font-black uppercase mb-4 border-2 border-black">SYSTEM_STATUS: ACTIVE</div>
          <h1 class="text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase mb-2 break-all">
            BRUTAL<br/><span class="text-primary italic">CHALLENGES</span>
          </h1>
          <p class="text-lg font-bold text-slate-500 dark:text-slate-400 max-w-2xl uppercase">
            // EXECUTE OR TERMINATE. HIGH-CONTRAST COMPUTING FOR THE ELITE OVERLORDS. NO PACKET LEFT UNCHECKED.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-10">
          <aside class="w-full lg:w-72 shrink-0">
            <div class="border-4 border-black bg-slate-100 dark:bg-slate-900 p-6 neo-brutalist-shadow">
              <h3 class="font-black uppercase text-xl mb-6 border-b-2 border-black pb-2 flex items-center justify-between">
                MANIFEST
                <span class="material-symbols-outlined">filter_list</span>
              </h3>
              <div class="space-y-6">
                <!-- Search -->
                <div>
                   <label class="block text-xs font-black uppercase mb-3 text-slate-500">SEARCH_MANIFEST</label>
                   <div class="flex items-stretch border-2 border-black bg-white dark:bg-slate-800">
                      <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" 
                        class="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase placeholder:text-slate-500 py-2 px-3" 
                        placeholder="ENTER_QUERY">
                   </div>
                </div>

                <!-- Subsystem Filter -->
                <div>
                  <label class="block text-xs font-black uppercase mb-3 text-slate-500">SUBSYSTEM_TYPE</label>
                  <div class="space-y-2">
                    <button (click)="subsystemFilter.set('All')" 
                      [ngClass]="subsystemFilter() === 'All' ? 'bg-primary text-black' : 'hover:bg-primary/20'"
                      class="w-full text-left px-3 py-2 border-2 border-black font-black text-sm uppercase transition-colors">
                      ALL_SYSTEMS
                    </button>
                    <button (click)="subsystemFilter.set('ALGO_HACK')" 
                      [ngClass]="subsystemFilter() === 'ALGO_HACK' ? 'bg-primary text-black' : 'hover:bg-primary/20'"
                      class="w-full text-left px-3 py-2 border-2 border-black font-black text-sm uppercase transition-colors">
                      ALGO_HACK
                    </button>
                    <button (click)="subsystemFilter.set('NET_PROTOCOL')" 
                      [ngClass]="subsystemFilter() === 'NET_PROTOCOL' ? 'bg-primary text-black' : 'hover:bg-primary/20'"
                      class="w-full text-left px-3 py-2 border-2 border-black font-black text-sm uppercase transition-colors">
                      NET_PROTOCOL
                    </button>
                    <button (click)="subsystemFilter.set('LOW_LEVEL_C')" 
                      [ngClass]="subsystemFilter() === 'LOW_LEVEL_C' ? 'bg-primary text-black' : 'hover:bg-primary/20'"
                      class="w-full text-left px-3 py-2 border-2 border-black font-black text-sm uppercase transition-colors">
                      LOW_LEVEL_C
                    </button>
                  </div>
                </div>

                <!-- Threat Level Filter -->
                <div>
                  <label class="block text-xs font-black uppercase mb-3 text-slate-500">THREAT_LEVEL</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button (click)="difficultyFilter.set('Easy')" 
                      [ngClass]="difficultyFilter() === 'Easy' ? 'bg-green-500 text-black' : 'hover:bg-green-500/20'"
                      class="border-2 border-black py-2 font-black text-xs uppercase transition-colors">STABLE</button>
                    <button (click)="difficultyFilter.set('Medium')" 
                      [ngClass]="difficultyFilter() === 'Medium' ? 'bg-yellow-500 text-black' : 'hover:bg-yellow-500/20'"
                      class="border-2 border-black py-2 font-black text-xs uppercase transition-colors">UNSTABLE</button>
                    <button (click)="difficultyFilter.set('Hard')" 
                      [ngClass]="difficultyFilter() === 'Hard' ? 'bg-red-600 text-white' : 'hover:bg-red-600/20'"
                      class="border-2 border-black py-2 font-black text-xs uppercase transition-colors col-span-2">HARDCORE</button>
                    <button (click)="difficultyFilter.set('All')" 
                      [ngClass]="difficultyFilter() === 'All' ? 'bg-slate-500 text-white' : 'hover:bg-slate-500/20'"
                      class="border-2 border-black py-1 font-black text-[10px] uppercase transition-colors col-span-2">CLEAR_FILTER</button>
                  </div>
                </div>

                <!-- Terminal info box -->
                <div class="pt-4">
                  <div class="bg-black text-primary p-4 font-mono text-xs leading-tight border-2 border-primary/50">
                    <p>&gt; uptime: 99.9%</p>
                    <p>&gt; nodes: active</p>
                    <p>&gt; session: root</p>
                    <p class="animate-pulse">_</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div class="flex-1">
             @if (problemService.loading()) {
                <div class="flex items-center justify-center p-20">
                   <div class="text-4xl font-black uppercase animate-pulse">LOADING_DATA...</div>
                </div>
             } @else if (filteredProblems().length === 0) {
                <div class="border-4 border-black border-dashed p-20 text-center">
                   <h3 class="text-2xl font-black uppercase">NO_TARGETS_FOUND</h3>
                   <p class="text-slate-500 font-bold uppercase mt-2">ADJUST FILTER PARAMS OR SEARCH QUERY</p>
                </div>
             } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  @for (problem of filteredProblems(); track problem.id; let i = $index) {
                    <div class="border-4 border-black bg-white dark:bg-slate-900 overflow-hidden neo-brutalist-shadow flex flex-col relative transition-transform hover:scale-[1.02]"
                        [ngClass]="i % 2 === 0 ? 'rotate-1' : '-rotate-1'">
                      
                      <!-- Header -->
                      <div class="px-4 py-2 font-black uppercase text-sm border-b-4 border-black flex justify-between items-center"
                        [ngClass]="getThreatColor(problem.difficulty)">
                        <span>THREAT: {{ getThreatLabel(problem.difficulty) }}</span>
                        <span class="material-symbols-outlined text-sm">{{ getThreatIcon(problem.difficulty) }}</span>
                      </div>

                      <!-- Content -->
                      <div class="p-6 flex-1">
                        <div class="flex justify-between items-start mb-4">
                          <h2 class="text-3xl font-black uppercase leading-none tracking-tighter">{{ problem.title }}</h2>
                          <span class="bg-black text-white px-2 py-1 text-[10px] font-black italic">ID: {{ problem.id?.substring(0, 6) || '0x????' }}</span>
                        </div>
                        <p class="font-bold text-sm mb-6 uppercase leading-snug">{{ problem.description }}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-8">
                          @if (problem.tags && problem.tags.length > 0) {
                            @for (tag of problem.tags; track tag) {
                              <span class="border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-800">{{ tag }}</span>
                            }
                          } @else {
                            <span class="border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-800">UNLABELED</span>
                          }
                        </div>
                      </div>

                      <!-- Footer/Action -->
                      <div class="p-6 pt-0 mt-auto">
                        <button [routerLink]="['/problems', problem.id]" 
                          class="w-full bg-primary text-black border-4 border-black py-4 font-black uppercase text-xl neo-brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                          INITIATE_HACK
                        </button>
                      </div>
                    </div>
                  }

                  <!-- Propose Card -->
                  <div class="border-4 border-black bg-primary/10 border-dashed dark:bg-slate-900/50 overflow-hidden flex flex-col relative justify-center items-center p-10 text-center min-h-[300px]">
                    <span class="material-symbols-outlined text-6xl mb-4 text-primary">add_box</span>
                    <h3 class="text-2xl font-black uppercase">PROPOSE_LOG</h3>
                    <p class="text-xs font-bold uppercase mt-2">REQUEST NEW CHALLENGE VECTOR FROM COMMAND</p>
                  </div>
                </div>
             }
          </div>
        </div>
      </main>
    </div>
  `
})
export class ProblemListComponent {
  problemService = inject(ProblemService);
  
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
