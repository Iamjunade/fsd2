import { Component, inject, signal } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/types';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Terminal Header -->
      <div class="bg-black border-4 border-black p-4 mb-10 flex flex-col sm:flex-row items-center justify-between neo-brutalist-shadow gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-red-600 p-1.5 border-2 border-black">
            <mat-icon class="text-white text-base h-auto w-auto">security</mat-icon>
          </div>
          <div>
            <h1 class="text-white font-black text-lg tracking-tighter uppercase leading-none">CORE_ADMIN_INTERFACE_v4.2</h1>
            <p class="text-[10px] text-red-500 font-mono font-bold tracking-widest mt-1 anim-pulse">SECURITY_LEVEL: OMEGA // ACCESS_GRANTED</p>
          </div>
        </div>
        
        <div class="flex gap-4 w-full sm:w-auto">
          <button (click)="seedProblems()" [disabled]="seeding()" 
            class="flex-1 sm:flex-none px-6 py-2 bg-white border-4 border-black font-black uppercase text-xs tracking-tighter hover:translate-x-1 hover:-translate-y-1 transition-transform neo-brutalist-shadow disabled:opacity-50">
            {{ seeding() ? 'SEEDING...' : 'INIT_SEED_SEQUENCE' }}
          </button>
          <button (click)="openAddModal()" 
            class="flex-1 sm:flex-none px-6 py-2 bg-primary text-white border-4 border-black font-black uppercase text-xs tracking-tighter hover:translate-x-1 hover:-translate-y-1 transition-transform neo-brutalist-shadow-primary">
            ADD_NEW_MANIFEST
          </button>
        </div>
      </div>

      <!-- Problem List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (problem of problemService.problems(); track problem.id) {
          <div class="bg-white border-4 border-black neo-brutalist-shadow group relative overflow-hidden">
            <!-- Difficulty Bar -->
            <div class="absolute top-0 right-0 p-2">
              <span class="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-tighter"
                [class.bg-green-500]="problem.difficulty === 'Easy'"
                [class.bg-yellow-500]="problem.difficulty === 'Medium'"
                [class.bg-red-600]="problem.difficulty === 'Hard'">
                {{ problem.difficulty }}
              </span>
            </div>

            <div class="p-8">
              <p class="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">// NODE_ID: {{ problem.id?.substring(0, 8) }}</p>
              <h3 class="text-xl font-black uppercase mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">
                {{ problem.title }}
              </h3>
              
              <div class="flex flex-wrap gap-2 mb-6">
                @if (problem.subsystem) {
                  <span class="px-2 py-0.5 border-2 border-black text-[10px] font-black bg-slate-100 uppercase">{{ problem.subsystem }}</span>
                }
                @for (tag of problem.tags; track tag) {
                  <span class="px-2 py-0.5 border-2 border-black text-[10px] font-black bg-white uppercase">#{{ tag }}</span>
                }
              </div>

              <div class="flex items-center justify-between pt-6 border-t-4 border-black border-dashed">
                <div class="flex gap-4">
                  <button (click)="openEditModal(problem)" class="flex items-center gap-1 font-black text-xs uppercase hover:text-primary">
                    <mat-icon class="text-sm h-auto w-auto">edit</mat-icon> EDIT
                  </button>
                  <button (click)="deleteProblem(problem.id!)" class="flex items-center gap-1 font-black text-xs uppercase text-red-600 hover:text-red-800">
                    <mat-icon class="text-sm h-auto w-auto">delete</mat-icon> PURGE
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal for Add/Edit (Terminal Style) -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" (click)="closeModal()"></div>
          
          <div class="relative w-full max-w-2xl bg-white border-8 border-black neo-brutalist-shadow-primary max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="bg-black p-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <mat-icon class="text-primary text-xl">terminal</mat-icon>
                <span class="text-white font-black uppercase tracking-tighter text-sm">
                  {{ editingProblem() ? 'EDIT_MANIFEST_OVERRIDE' : 'NEW_MANIFEST_ENTRY' }}
                </span>
              </div>
              <button (click)="closeModal()" class="text-white hover:text-red-500 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="p-8">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-black uppercase mb-2">MANIFEST_TITLE</label>
                    <input type="text" [ngModel]="formData().title" (ngModelChange)="updateFormData('title', $event)" 
                      class="w-full bg-slate-50 border-4 border-black p-3 font-bold focus:ring-4 focus:ring-primary/20 outline-none uppercase placeholder:text-slate-300"
                      placeholder="ENTER_IDENTIFIER">
                  </div>
                  <div>
                    <label class="block text-xs font-black uppercase mb-2">THREAT_LEVEL</label>
                    <select [ngModel]="formData().difficulty" (ngModelChange)="updateFormData('difficulty', $event)" 
                      class="w-full bg-slate-50 border-4 border-black p-3 font-black focus:ring-4 focus:ring-primary/20 outline-none uppercase cursor-pointer">
                      <option value="Easy">EASY_LOW</option>
                      <option value="Medium">MEDIUM_ELEVATED</option>
                      <option value="Hard">HARD_CRITICAL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-black uppercase mb-2">MISSION_DESCRIPTION</label>
                  <textarea [ngModel]="formData().description" (ngModelChange)="updateFormData('description', $event)" 
                    rows="4" class="w-full bg-slate-50 border-4 border-black p-4 font-medium focus:ring-4 focus:ring-primary/20 outline-none"
                    placeholder="DESCRIBE_OBJECTIVES..."></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-black uppercase mb-2">SAMPLE_TELEMETRY_IN</label>
                    <textarea [ngModel]="formData().sampleInput" (ngModelChange)="updateFormData('sampleInput', $event)" 
                      rows="3" class="w-full bg-black text-green-400 border-4 border-black p-4 font-mono text-sm focus:ring-4 focus:ring-primary/20 outline-none shadow-inner"
                      placeholder="INIT_STATE"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-black uppercase mb-2">EXPECTED_TELEMETRY_OUT</label>
                    <textarea [ngModel]="formData().sampleOutput" (ngModelChange)="updateFormData('sampleOutput', $event)" 
                      rows="3" class="w-full bg-black text-primary border-4 border-black p-4 font-mono text-sm focus:ring-4 focus:ring-primary/20 outline-none shadow-inner"
                      placeholder="FINAL_STATE"></textarea>
                  </div>
                </div>

                <div class="pt-6 flex gap-4">
                  <button (click)="saveProblem()" 
                    class="flex-1 py-4 bg-primary text-white border-4 border-black font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform neo-brutalist-shadow-primary">
                    EXECUTE_SAVE
                  </button>
                  <button (click)="closeModal()" 
                    class="px-8 py-4 bg-white border-4 border-black font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform neo-brutalist-shadow">
                    ABORT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
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
