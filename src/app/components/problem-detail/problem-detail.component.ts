import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] terminal-grid bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display p-6 md:p-10">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
        
        <!-- Left Panel: Problem Description -->
        <div class="w-full lg:w-1/2 flex flex-col border-4 border-black bg-white dark:bg-slate-900 neo-brutalist-shadow overflow-hidden sticky top-24 max-h-[85vh]">
          
          <!-- Card Header -->
          <div class="px-6 py-3 border-b-4 border-black flex items-center justify-between"
               [ngClass]="getThreatColor(problem()?.difficulty || 'Medium')">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined font-black">description</span>
              <h2 class="font-black uppercase tracking-tighter text-xl">MANIFEST_DETAIL</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-black text-white px-2 py-0.5 text-[10px] font-black italic">ID: {{ problem()?.id?.substring(0, 8) || '0x????' }}</span>
              <span class="material-symbols-outlined text-sm">{{ getThreatIcon(problem()?.difficulty || 'Medium') }}</span>
            </div>
          </div>

          @if (loading()) {
            <div class="p-20 text-center flex-1 flex flex-col items-center justify-center gap-4">
              <div class="text-3xl font-black uppercase animate-pulse">FETCHING_DATA...</div>
              <div class="w-48 h-2 bg-slate-200 dark:bg-slate-800 border-2 border-black overflow-hidden">
                <div class="h-full bg-primary animate-[marquee_2s_linear_infinite]" style="width: 50%"></div>
              </div>
            </div>
          } @else if (problem()) {
            <div class="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div class="flex flex-col gap-8">
                <!-- Title & Tags -->
                <div>
                  <h1 class="text-4xl md:text-5xl font-black uppercase leading-none tracking-tighter mb-4">{{ problem()?.title }}</h1>
                  <div class="flex flex-wrap gap-2">
                    <span class="border-2 border-black px-3 py-1 text-xs font-black uppercase bg-primary text-black">
                      THREAT: {{ getThreatLabel(problem()?.difficulty || 'Medium') }}
                    </span>
                    @for (tag of problem()?.tags || ['SYSTEMS', 'CORE']; track tag) {
                      <span class="border-2 border-black px-3 py-1 text-xs font-black uppercase bg-slate-100 dark:bg-slate-800">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Description -->
                <div class="border-t-2 border-black/10 dark:border-white/10 pt-6">
                  <label class="block text-xs font-black uppercase mb-3 text-slate-500 italic">// OBJECTIVE</label>
                  <p class="text-lg font-bold leading-relaxed whitespace-pre-wrap uppercase">{{ problem()?.description }}</p>
                </div>

                <!-- Samples -->
                <div class="grid grid-cols-1 gap-6">
                  <div class="bg-slate-100 dark:bg-black/50 border-2 border-black p-4 relative">
                    <label class="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">SAMPLE_INPUT</label>
                    <pre class="font-mono text-sm overflow-x-auto pt-2">{{ problem()?.sampleInput || 'NO_INPUT_DEFINED' }}</pre>
                  </div>
                  <div class="bg-slate-100 dark:bg-black/50 border-2 border-black p-4 relative">
                    <label class="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase">EXPECTED_OUTPUT</label>
                    <pre class="font-mono text-sm overflow-x-auto pt-2">{{ problem()?.sampleOutput || 'NO_OUTPUT_DEFINED' }}</pre>
                  </div>
                </div>

                <!-- Terminal Footer -->
                <div class="bg-black text-primary p-4 font-mono text-xs leading-tight border-2 border-primary/30 mt-4">
                  <p>&gt; access_level: encrypted</p>
                  <p>&gt; integrity_check: passed</p>
                  <p>&gt; ready_for_execution</p>
                  <p class="animate-pulse">_</p>
                </div>
              </div>
            </div>
          } @else {
            <div class="p-20 text-center text-red-600 flex-1 flex flex-col items-center justify-center gap-4">
              <span class="material-symbols-outlined text-6xl">error</span>
              <h3 class="text-2xl font-black uppercase">TARGET_NOT_FOUND</h3>
              <p class="font-bold uppercase opacity-60">LINK_CORRUPTED_OR_MISSING</p>
              <button (click)="router.navigate(['/problems'])" 
                class="mt-4 px-6 py-3 bg-black text-white font-black uppercase border-2 border-black hover:bg-red-600 transition-colors">
                RETURN_TO_MANIFEST
              </button>
            </div>
          }
        </div>

        <!-- Right Panel: Editor -->
        <div class="w-full lg:w-1/2 flex flex-col border-4 border-black bg-white dark:bg-slate-900 neo-brutalist-shadow overflow-hidden min-h-[85vh]">
          <!-- Card Header (Editor) -->
          <div class="px-6 py-3 border-b-4 border-black bg-slate-200 dark:bg-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined font-black">terminal</span>
              <h2 class="font-black uppercase tracking-tighter text-xl">BUFFER_V24.exe</h2>
            </div>
            <div class="flex gap-2">
               <div class="size-3 rounded-full border-2 border-black bg-yellow-400"></div>
               <div class="size-3 rounded-full border-2 border-black bg-green-500"></div>
            </div>
          </div>

          <div class="p-6 flex-1 bg-white">
            <div data-pym-src="https://www.jdoodle.com/embed/v1/4defaf9d91a9060c" class="w-full"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #fff; }
    :host ::ng-deep iframe { border: none !important; width: 100% !important; min-height: 700px !important; }
  `]
})
export class ProblemDetailComponent implements OnInit, AfterViewInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  problemService = inject(ProblemService);

  problem = signal<Problem | null>(null);
  loading = signal<boolean>(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      let p: Problem | null = null;
      
      try {
        p = await this.problemService.getProblem(id);
      } catch (error) {
        console.error('Error fetching problem detail, falling back to mock:', error);
      }
      
      // Mock fallback if product is not found or error occurred
      if (!p) {
        p = this.getMockProblem(id);
      }
      
      this.problem.set(p);
    }
    this.loading.set(false);
  }

  getMockProblem(id: string): Problem | null {
    const mocks: Problem[] = [
      {
        id: '0x8842',
        title: 'Memory_Void',
        difficulty: 'Hard',
        description: 'Optimize a raw memory allocator to handle fragmented heaps under 50ms latency.',
        tags: ['C++', 'SYSTEMS', 'LOW_LEVEL'],
        subsystem: 'LOW_LEVEL_C',
        createdAt: new Date().toISOString(),
        sampleInput: 'malloc(64)\nmalloc(128)\nfree(0x1)',
        sampleOutput: 'Heap utilization: 84%\nFragmentation: 2.1%'
      },
      {
        id: '0x4421',
        title: 'Packet_Sieve',
        difficulty: 'Easy',
        description: 'Filter high-throughput network traffic using SIMD instructions for maximum velocity.',
        tags: ['RUST', 'NETWORK'],
        subsystem: 'NET_PROTOCOL',
        createdAt: new Date().toISOString(),
        sampleInput: 'TCP 192.168.1.1:80 -> 10.0.0.1:443\nUDP 8.8.8.8:53 -> 192.168.1.1:1234',
        sampleOutput: 'Filtered: 1\nAllowed: 1'
      },
      {
        id: '0x1102',
        title: 'Crypto_Grind',
        difficulty: 'Medium',
        description: 'Decrypt a custom XOR-ciphered stream with 1024-bit rotating keys in parallel.',
        tags: ['SECURITY', 'MATH'],
        subsystem: 'ALGO_HACK',
        createdAt: new Date().toISOString(),
        sampleInput: '0x42 0x11 0x88 0x99\nKey: 0xFF',
        sampleOutput: 'Decrypted: 0xBD 0xEE 0x77 0x66'
      }
    ];
    // Use a simpler find to avoid lint errors with optional id
    return mocks.find(m => m.id === id || (m.id && m.id.includes(id))) || mocks[0];
  }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

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
