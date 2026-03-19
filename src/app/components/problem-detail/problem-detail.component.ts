import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodeExecutionService } from '../../services/code-execution.service';

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MonacoEditorModule],
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
              <select [(ngModel)]="selectedLanguage" (change)="onLanguageChange()" class="bg-black text-white border-2 border-primary font-black uppercase text-xs px-2 py-1 outline-none">
                <option value="python">PYTHON_3.14</option>
                <option value="cpp">GCC_G++_15</option>
                <option value="java">OPENJDK_25</option>
                <option value="javascript">NODE_JS_DENO</option>
              </select>
            </div>
            <div class="flex gap-4">
              <button (click)="onRunCode()" [disabled]="executing()"
                      class="bg-green-500 text-black px-4 py-1 text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
                {{ executing() ? 'RUNNING...' : 'RUN_CODE' }}
              </button>
              <button (click)="onSubmitCode()" [disabled]="executing()"
                      class="bg-primary text-white px-4 py-1 text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
                {{ executing() ? 'PROCESSING...' : 'SUBMIT_PLAN' }}
              </button>
            </div>
          </div>

          <div class="flex-1 flex flex-col min-h-[600px]">
            <!-- Monaco Editor -->
            <div class="flex-1 border-b-4 border-black overflow-hidden bg-[#1e1e1e]">
              <ngx-monaco-editor [options]="editorOptions" [(ngModel)]="code" class="h-full w-full"></ngx-monaco-editor>
            </div>

            <!-- Inputs & Output Console -->
            <div class="h-64 bg-black text-white font-mono flex flex-col">
              <div class="flex border-b-2 border-slate-800">
                <button (click)="activeTab = 'stdin'" [class.bg-slate-800]="activeTab === 'stdin'" class="px-6 py-2 text-xs font-black border-r-2 border-slate-800 uppercase">STDIN_BUFFER</button>
                <button (click)="activeTab = 'stdout'" [class.bg-slate-800]="activeTab === 'stdout'" class="px-6 py-2 text-xs font-black border-r-2 border-slate-800 uppercase">STDOUT_LOG</button>
              </div>
              
              <div class="flex-1 p-4 overflow-auto custom-scrollbar">
                @if (activeTab === 'stdin') {
                  <textarea [(ngModel)]="stdin" 
                    placeholder="ENTER_SAMPLES_HERE..."
                    class="w-full h-full bg-transparent outline-none text-primary resize-none placeholder:text-primary/30"></textarea>
                } @else {
                  <div class="whitespace-pre-wrap lowercase text-sm">
                    @if (output()) {
                      <div [class.text-red-500]="status() === 'error'" class="mb-4">
                        <span class="text-slate-500 uppercase">[{{ status() === 'success' ? 'SUCCESS' : 'FAILURE' }}]</span><br>
                        {{ output() }}
                      </div>
                    } @else if (executing()) {
                      <div class="flex flex-col gap-1">
                        <div class="text-primary animate-pulse">&gt; INITIATING_VIRTUAL_MACHINE... [OK]</div>
                        <div class="text-primary animate-pulse">&gt; MOUNTING_COMPILER_RUNTIME... [OK]</div>
                        <div class="text-primary animate-pulse">&gt; EXECUTING_CODE_STREAM... [PENDING]</div>
                        <div class="mt-2 w-full h-1 bg-slate-900 border border-slate-700 overflow-hidden">
                          <div class="h-full bg-primary animate-[loading_1.5s_infinite]"></div>
                        </div>
                      </div>
                    } @else {
                      <div class="text-slate-500 uppercase">&gt; IDLE_STANDBY_MODE</div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #fff; }
    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `]
})
export class ProblemDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  problemService = inject(ProblemService);
  codeService = inject(CodeExecutionService);

  problem = signal<Problem | null>(null);
  loading = signal<boolean>(true);
  
  // IDE State
  code: string = '# write your code here...';
  selectedLanguage: string = 'python';
  stdin: string = '';
  output = signal<string>('');
  status = signal<string>('');
  executing = signal<boolean>(false);
  activeTab: 'stdin' | 'stdout' = 'stdout';

  editorOptions = {
    theme: 'vs-dark',
    language: 'python',
    fontSize: 14,
    fontFamily: "'Fira Code', monospace",
    minimap: { enabled: false },
    automaticLayout: true,
    padding: { top: 20 }
  };

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
      this.setDefaultCode(p);
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

  setDefaultCode(p: Problem | null) {
    if (p?.tags?.includes('C++')) {
      this.selectedLanguage = 'cpp';
      this.code = '#include <iostream>\n\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}';
    } else {
      this.selectedLanguage = 'python';
      this.code = 'print("Hello World")';
    }
    this.onLanguageChange();
  }

  onLanguageChange() {
    this.editorOptions = { ...this.editorOptions, language: this.selectedLanguage };
  }

  onRunCode() {
    if (this.executing()) return;
    
    this.executing.set(true);
    this.activeTab = 'stdout';
    this.output.set('');
    
    this.codeService.runCode(this.code, this.selectedLanguage, this.stdin).subscribe({
      next: (res) => {
        this.output.set(res.output);
        this.status.set(res.status);
        this.executing.set(false);
      },
      error: (err) => {
        this.output.set('CRITICAL_SYSTEM_ERROR: ' + err.message);
        this.status.set('error');
        this.executing.set(false);
      }
    });
  }

  onSubmitCode() {
    if (this.executing()) return;
    
    this.executing.set(true);
    this.activeTab = 'stdout';
    this.output.set('');
    
    this.codeService.submitCode(this.code, this.selectedLanguage, this.stdin).subscribe({
      next: (res) => {
        this.output.set(`STATUS: ${res.status}\n\nTEST_CASE_SUMMARY:\n` + 
          res.testCases.map((tc: any) => `[TC_${tc.id}] ${tc.type}: ${tc.status} (${tc.time}ms)`).join('\n'));
        this.status.set(res.status === 'Accepted' ? 'success' : 'error');
        this.executing.set(false);
      },
      error: (err) => {
        this.output.set('SUBMISSION_FAILED: ' + err.message);
        this.status.set('error');
        this.executing.set(false);
      }
    });
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
