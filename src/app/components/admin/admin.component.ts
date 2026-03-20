import { Component, inject, signal } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/types';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, MatIconModule, SidebarComponent, CommonModule],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <!-- Metadata Margins (Decorative) -->
        <div class="fixed top-28 right-6 text-[10px] font-black text-primary opacity-30 flex flex-col items-end gap-1 pointer-events-none hidden sm:flex">
          <div>SECURE_CONSOLE_ACTIVE</div>
          <div>ENCRYPTION: AES_256</div>
          <div class="w-32 h-1 bg-primary mt-2"></div>
        </div>

        <div class="max-w-6xl mx-auto pb-20">
          <!-- Cyber Header -->
          <div class="bg-[#0d0d0d] border-4 border-white hard-shadow-primary p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="bg-red-600 p-2 border-2 border-black rotate-3">
                <mat-icon class="text-white text-xl h-auto w-auto">privacy_tip</mat-icon>
              </div>
              <div>
                <h1 class="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">CORE_ADMIN_V4.2</h1>
                <p class="text-[10px] text-red-500 font-mono font-black tracking-[0.2em] mt-2 animate-pulse uppercase">ROOT_ACCESS_GRANTED // OVERRIDE_ENABLED</p>
              </div>
            </div>
            
            <div class="flex gap-4 w-full sm:w-auto">
              <button (click)="seedProblems()" [disabled]="seeding()" 
                class="flex-1 sm:flex-none px-6 py-3 bg-white text-black border-4 border-black font-black uppercase text-xs tracking-tighter hover:translate-x-1 hover:-translate-y-1 transition-transform hard-shadow-white disabled:opacity-50">
                {{ seeding() ? 'INITIALIZING...' : 'INIT_SEED_SEQUENCE' }}
              </button>
              <button (click)="openAddModal()" 
                class="flex-1 sm:flex-none px-6 py-3 bg-primary text-white border-4 border-black font-black uppercase text-xs tracking-tighter hover:translate-x-1 hover:-translate-y-1 transition-transform hard-shadow-primary">
                ADD_NEW_MANIFEST
              </button>
            </div>
          </div>

          <!-- Problem Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (problem of problemService.problems(); track problem.id) {
              <div class="bg-[#0d0d0d] border-4 border-white hard-shadow-purple group relative overflow-hidden transition-all hover:-translate-y-2">
                <!-- Status Bar -->
                <div class="absolute top-0 right-0 p-2 z-10">
                  <span class="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-tighter border-2 border-white"
                    [class.border-green-500]="problem.difficulty === 'Easy'"
                    [class.text-green-500]="problem.difficulty === 'Easy'"
                    [class.border-yellow-500]="problem.difficulty === 'Medium'"
                    [class.text-yellow-500]="problem.difficulty === 'Medium'"
                    [class.border-red-600]="problem.difficulty === 'Hard'"
                    [class.text-red-600]="problem.difficulty === 'Hard'">
                    {{ problem.difficulty }}
                  </span>
                </div>

                <div class="p-8">
                  <p class="text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.3em] font-mono">NODE_{{ problem.id?.substring(0, 8) }}</p>
                  <h3 class="text-2xl font-black italic uppercase mb-6 tracking-tighter leading-tight text-white group-hover:text-primary transition-colors">
                    {{ problem.title }}
                  </h3>
                  
                  <div class="flex flex-wrap gap-2 mb-8">
                    @if (problem.subsystem) {
                      <span class="px-2 py-0.5 border-2 border-primary text-[9px] font-black bg-primary/10 text-primary uppercase">{{ problem.subsystem }}</span>
                    }
                    @for (tag of problem.tags; track tag) {
                      <span class="px-2 py-0.5 border-2 border-slate-700 text-[9px] font-black text-slate-400 uppercase">#{{ tag }}</span>
                    }
                  </div>

                  <div class="flex items-center justify-between pt-6 border-t-2 border-slate-800 border-dashed">
                    <div class="flex gap-6">
                      <button (click)="openEditModal(problem)" class="flex items-center gap-1 font-black text-[10px] uppercase text-white hover:text-primary transition-colors">
                        <mat-icon class="text-sm h-auto w-auto">settings</mat-icon> OVERRIDE
                      </button>
                      <button (click)="deleteProblem(problem.id!)" class="flex items-center gap-1 font-black text-[10px] uppercase text-red-500 hover:text-red-300 transition-colors">
                        <mat-icon class="text-sm h-auto w-auto">delete_forever</mat-icon> PURGE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Terminal Style Modal -->
        @if (showModal()) {
          <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <div class="relative w-full max-w-3xl bg-[#0d0d0d] border-8 border-white hard-shadow-primary max-h-[90vh] overflow-y-auto custom-scrollbar">
              <!-- Modal Header -->
              <div class="bg-primary p-4 flex items-center justify-between border-b-4 border-black">
                <div class="flex items-center gap-3">
                  <mat-icon class="text-black font-black">terminal</mat-icon>
                  <span class="text-black font-black uppercase italic tracking-tighter">
                    {{ editingProblem() ? 'MANIFEST_OVERRIDE_SEQUENCE' : 'NEW_MANIFEST_INITIALIZATION' }}
                  </span>
                </div>
                <button (click)="closeModal()" class="text-black hover:bg-black hover:text-primary transition-all p-1">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="p-8">
                <div class="space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label class="block text-[10px] font-black uppercase text-primary mb-3">// IDENTIFIER</label>
                      <input type="text" [ngModel]="formData().title" (ngModelChange)="updateFormData('title', $event)" 
                        class="w-full bg-black text-white border-4 border-slate-800 p-4 font-black uppercase focus:border-primary outline-none tracking-widest placeholder-slate-800"
                        placeholder="PROBLEM_ID">
                    </div>
                    <div>
                      <label class="block text-[10px] font-black uppercase text-primary mb-3">// THREAT_LEVEL</label>
                      <select [ngModel]="formData().difficulty" (ngModelChange)="updateFormData('difficulty', $event)" 
                        class="w-full bg-black text-white border-4 border-slate-800 p-4 font-black uppercase focus:border-primary outline-none cursor-pointer tracking-widest">
                        <option value="Easy">EASY_LOW</option>
                        <option value="Medium">MEDIUM_NORMAL</option>
                        <option value="Hard">HARD_CRITICAL</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] font-black uppercase text-primary mb-3">// DATA_DESC</label>
                    <textarea [ngModel]="formData().description" (ngModelChange)="updateFormData('description', $event)" 
                      rows="4" class="w-full bg-black text-white border-4 border-slate-800 p-4 font-bold focus:border-primary outline-none placeholder-slate-800"
                      placeholder="ENTER_PROBLEM_DESCRIPTION_MARKDOWN"></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label class="block text-[10px] font-black uppercase text-primary mb-3 font-mono">TELEMETRY_IN_STREAM</label>
                      <textarea [ngModel]="formData().sampleInput" (ngModelChange)="updateFormData('sampleInput', $event)" 
                        rows="3" class="w-full bg-black text-green-500 border-4 border-slate-800 p-4 font-mono text-sm focus:border-green-500 outline-none"
                        placeholder="INPUT_BUFFER"></textarea>
                    </div>
                    <div>
                      <label class="block text-[10px] font-black uppercase text-primary mb-3 font-mono">EXPECTED_OUT_BUFFER</label>
                      <textarea [ngModel]="formData().sampleOutput" (ngModelChange)="updateFormData('sampleOutput', $event)" 
                        rows="3" class="w-full bg-black text-primary border-4 border-slate-800 p-4 font-mono text-sm focus:border-primary outline-none"
                        placeholder="OUTPUT_TARGET"></textarea>
                    </div>
                  </div>

                  <div class="pt-8 flex gap-6">
                    <button (click)="saveProblem()" 
                      class="flex-1 py-4 bg-primary text-black font-black uppercase italic tracking-widest border-4 border-black hard-shadow-black hover:translate-x-1 hover:-translate-y-1 transition-transform">
                      EXECUTE_MANIFEST_UPDATE
                    </button>
                    <button (click)="closeModal()" 
                      class="px-10 py-4 bg-white text-black font-black uppercase italic tracking-widest border-4 border-black hard-shadow-black hover:translate-x-1 hover:-translate-y-1 transition-transform">
                      ABORT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .hard-shadow-primary { box-shadow: 12px 12px 0 0 #b90df2; }
    .hard-shadow-white { box-shadow: 10px 10px 0 0 #ffffff; }
    .hard-shadow-purple { box-shadow: 8px 8px 0 0 #8b5cf6; }
    .hard-shadow-black { box-shadow: 6px 6px 0 0 #000; }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
export class AdminComponent {
  problemService = inject(ProblemService);
  
  showModal = signal(false);
  editingProblem = signal<Problem | null>(null);
  seeding = signal(false);
  
  formData = signal<Partial<Problem>>({
    title: '',
    difficulty: 'Easy',
    description: '',
    sampleInput: '',
    sampleOutput: ''
  });

  async seedProblems() {
    this.seeding.set(true);
    const sampleProblems: Omit<Problem, 'id'>[] = [
      { title: 'System_Breach_01', difficulty: 'Easy', description: 'Bypass a legacy XOR obfuscation layer to extract a hidden kernel pointer.', subsystem: 'ALGO_HACK', tags: ['XOR', 'SECURITY'], sampleInput: '0x42 0x11 0x88 0x99\nKey: 0xFF', sampleOutput: 'Decrypted: 0xBD 0xEE 0x77 0x66', createdAt: new Date().toISOString() },
      { title: 'Packet_Sieve_V2', difficulty: 'Easy', description: 'Filter high-velocity network traffic using SIMD instructions for maximum throughput.', subsystem: 'NET_PROTOCOL', tags: ['RUST', 'NETWORK'], sampleInput: 'TCP 192.168.1.1:80 -> 10.0.0.1:443', sampleOutput: 'Filtered: 1\nAllowed: 1', createdAt: new Date().toISOString() },
      { title: 'Memory_Void_Alpha', difficulty: 'Hard', description: 'Optimize a raw memory allocator to handle fragmented heaps under 50ms latency.', subsystem: 'LOW_LEVEL_C', tags: ['C++', 'SYSTEMS'], sampleInput: 'malloc(64)\nfree(0x1)', sampleOutput: 'Heap utilization: 84%', createdAt: new Date().toISOString() },
      { title: 'Protocol_Inversion', difficulty: 'Medium', description: 'Reverse-engineer a custom P2P protocol to identify the originator node.', subsystem: 'NET_PROTOCOL', tags: ['P2P', 'NETWORK'], sampleInput: 'Node_A -> Node_B (DATA: 0x01)', sampleOutput: 'Originator: Node_C', createdAt: new Date().toISOString() },
      { title: 'Kernel_Smasher', difficulty: 'Hard', description: 'Implement a zero-copy buffer swap in a custom microkernel.', subsystem: 'LOW_LEVEL_C', tags: ['KERNEL', 'SYSTEMS'], sampleInput: 'Buffer_A: 0x1122\nBuffer_B: 0x3344', sampleOutput: 'Swap Success: 0x3344 -> 0x1122', createdAt: new Date().toISOString() }
    ];

    try {
      for (const p of sampleProblems) {
        await this.problemService.addProblem(p);
      }
    } catch (error) {
      console.error('Error seeding problems', error);
    } finally {
      this.seeding.set(false);
    }
  }

  updateFormData(key: keyof Problem, value: unknown) {
    this.formData.update(data => ({ ...data, [key]: value }));
  }

  openAddModal() {
    this.editingProblem.set(null);
    this.formData.set({
      title: '',
      difficulty: 'Easy',
      description: '',
      sampleInput: '',
      sampleOutput: ''
    });
    this.showModal.set(true);
  }

  openEditModal(problem: Problem) {
    this.editingProblem.set(problem);
    this.formData.set({ ...problem });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  async saveProblem() {
    const data = this.formData() as Problem;
    if (!data.title || !data.description) return;

    try {
      if (this.editingProblem()) {
        await this.problemService.updateProblem(this.editingProblem()!.id!, data);
      } else {
        await this.problemService.addProblem({
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      this.closeModal();
    } catch (error) {
      console.error('Error saving problem', error);
    }
  }

  async deleteProblem(id: string) {
    // In a real app, use a custom modal for confirmation. 
    // Here we just delete directly to avoid window.confirm in iframe.
    try {
      await this.problemService.deleteProblem(id);
    } catch (error) {
      console.error('Error deleting problem', error);
    }
  }
}
