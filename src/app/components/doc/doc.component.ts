import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar (Consistent Navigation) -->
      <app-sidebar></app-sidebar>

      <!-- Documentation Content -->
      <main class="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar">
        <!-- Metadata Corner -->
        <div class="fixed top-28 right-6 text-[10px] font-black text-primary opacity-50 flex flex-col items-end gap-1 pointer-events-none hidden sm:flex">
          <div>PROJECT_ID: FSD_LAB_2026</div>
          <div>STATUS: COMPLETED</div>
          <div class="w-32 h-1 bg-primary mt-2"></div>
        </div>

        <div class="max-w-5xl mx-auto pb-24">
          <!-- Academic Header -->
          <div class="mb-20 border-l-8 border-primary pl-8 py-4">
            <h1 class="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6">
              PROJECT_<br/>DOCUMENTATION
            </h1>
            <div class="inline-block bg-primary text-black px-4 py-1 font-black uppercase tracking-widest text-sm mb-4">
              Full Stack Development Lab Micro Project
            </div>
            <p class="text-xl font-bold text-slate-400 max-w-2xl">
              An advanced algorithmic playground designed to bridge the gap between competitive programming and modern software aesthetics.
            </p>
          </div>

          <!-- The Team / Faculty -->
          <section class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div class="bg-white text-black p-8 border-4 border-black neo-brutalist-shadow relative overflow-hidden group">
              <div class="absolute top-0 right-0 bg-black text-white px-3 py-1 text-[8px] font-black">SUPERVISOR</div>
              <h2 class="text-3xl font-black uppercase italic mb-6">FACULTY_GUIDANCE</h2>
              <div class="flex items-center gap-6 mb-8">
                 <div class="w-16 h-16 bg-black border-4 border-primary flex items-center justify-center">
                    <mat-icon class="text-primary text-3xl">school</mat-icon>
                 </div>
                 <div>
                   <h3 class="text-2xl font-black uppercase leading-none">Mr Shiva Kumar</h3>
                   <span class="text-primary font-bold text-xs">Project Lead & Mentor</span>
                 </div>
              </div>
              <p class="text-xs font-bold leading-relaxed uppercase opacity-80">
                Provided critical insights into system scalability and full-stack integration strategies for the CodeLab ecosystem.
              </p>
            </div>

            <div class="bg-black border-4 border-primary p-8 neo-brutalist-shadow-primary">
              <h2 class="text-3xl font-black uppercase italic mb-6 text-primary">PROJECT_DEVELOPERS</h2>
              <div class="space-y-4">
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">MOHAMMED JUNADE PASHA</span>
                  <span class="text-[10px] font-mono opacity-60 italic">24R01A6639</span>
                </div>
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">RISHIKESH MEPPERI</span>
                  <span class="text-[10px] font-mono opacity-60 italic">6637</span>
                </div>
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">TEJA REDDY</span>
                  <span class="text-[10px] font-mono opacity-60 italic">6636</span>
                </div>
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">ISHAN SAI</span>
                  <span class="text-[10px] font-mono opacity-60 italic">6633</span>
                </div>
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">SATHYANARAYAN</span>
                  <span class="text-[10px] font-mono opacity-60 italic">6632</span>
                </div>
                <div class="flex justify-between items-center border-b border-primary/20 pb-2">
                  <span class="font-black text-lg">SAMIKSHA</span>
                  <span class="text-[10px] font-mono opacity-60 italic">6631</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Project Specs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div class="md:col-span-2 border-4 border-black bg-[#111] p-10 relative">
               <div class="absolute -top-4 -left-4 bg-yellow-400 text-black px-4 py-1 font-black text-xs uppercase">PROJECT_TITLE</div>
               <h2 class="text-4xl md:text-5xl font-black uppercase mb-8 leading-tight">
                 CREATE A CODING <br/> PLATFORM USING <span class="text-primary italic">ANGULAR JS</span>
               </h2>
               <div class="space-y-8">
                 <div>
                   <h4 class="text-primary font-black uppercase text-sm mb-2">// CORE_VISION</h4>
                   <p class="text-slate-400 font-bold leading-relaxed uppercase">
                     Developing a robust, high-performance platform that integrates a real-time code editor with competitive programming tracks, utilizing a backend-as-a-service (Firebase) and a modern frontend framework (Angular).
                   </p>
                 </div>
                 <div>
                   <h4 class="text-primary font-black uppercase text-sm mb-2">// TECH_STACK</h4>
                   <div class="flex flex-wrap gap-4">
                     <span class="px-3 py-1 bg-white text-black font-black text-[10px] uppercase">Angular 18+</span>
                     <span class="px-3 py-1 bg-white text-black font-black text-[10px] uppercase">Firebase (Firestore)</span>
                     <span class="px-3 py-1 bg-white text-black font-black text-[10px] uppercase">Tailwind CSS</span>
                     <span class="px-3 py-1 bg-white text-black font-black text-[10px] uppercase">Monaco Editor</span>
                     <span class="px-3 py-1 bg-white text-black font-black text-[10px] uppercase">Material Icons</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="bg-primary text-black p-10 flex flex-col justify-center border-4 border-black neo-brutalist-shadow">
               <div class="text-6xl font-black italic mb-2 tracking-tighter leading-none">V1.0</div>
               <div class="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-4 mb-4">PRODUCTION_READY</div>
               <p class="text-xs font-bold leading-tight uppercase">
                 Successfully implemented key features including authentication, real-time leaderboard, and problematic resolution modules.
               </p>
            </div>
          </div>

          <!-- Module Deep Dive -->
          <h3 class="text-3xl font-black uppercase italic mb-12 flex items-center gap-4">
             <span class="w-12 h-1 bg-primary"></span> MODULE_OVERVIEW
          </h3>
          
          <div class="space-y-12">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
               <div>
                 <h4 class="text-2xl font-black uppercase mb-4 text-primary">01. CHALLENGES & IDE</h4>
                 <p class="text-slate-400 font-bold uppercase leading-relaxed text-sm">
                   A high-performance coding environment featuring the Monaco Editor, allowing users to solve complex algorithms in real-time. Integrated with a backend judging service to provide immediate feedback on code efficiency and correctness.
                 </p>
               </div>
               <div class="border-2 border-dashed border-primary/30 p-4">
                 <div class="flex gap-2 mb-2">
                   <div class="w-3 h-3 bg-primary rounded-full"></div>
                   <div class="w-3 h-3 bg-primary/30 rounded-full"></div>
                   <div class="w-3 h-3 bg-primary/30 rounded-full"></div>
                 </div>
                 <div class="h-24 bg-primary/5 border border-primary/10 flex items-center justify-center font-mono text-[8px] text-primary">
                    [REALTIME_JUDGING_ENGINE_LOADED]
                 </div>
               </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
               <div class="order-2 md:order-1 border-2 border-dashed border-primary/30 p-4">
                 <div class="grid grid-cols-4 gap-2 h-24">
                   <div class="bg-primary pt-2 flex items-end justify-center text-[8px] font-black text-black uppercase">98%</div>
                   <div class="bg-primary/60 pt-6 flex items-end justify-center text-[8px] font-black text-black uppercase">74%</div>
                   <div class="bg-primary/40 pt-10 flex items-end justify-center text-[8px] font-black text-black uppercase">43%</div>
                   <div class="bg-primary/20 pt-14 flex items-end justify-center text-[8px] font-black text-black uppercase">22%</div>
                 </div>
               </div>
               <div class="order-1 md:order-2">
                 <h4 class="text-2xl font-black uppercase mb-4 text-primary">02. SOCIAL ARCHITECTURE</h4>
                 <p class="text-slate-400 font-bold uppercase leading-relaxed text-sm">
                   Modules for Identity, Manifesto, and Community management enable developers to build their profiles, declare their engineering philosophy, and connect with peers through a synchronized global leaderboard.
                 </p>
               </div>
             </div>
          </div>

          <!-- Closing -->
          <div class="mt-32 p-12 border-4 border-white text-center group transition-colors hover:bg-white hover:text-black">
             <h2 class="text-4xl md:text-6xl font-black italic uppercase leading-tight mb-8">
               DEFINING THE <br/> <span class="text-primary italic transition-colors group-hover:text-black">VOID_SPACE</span>
             </h2>
             <p class="text-xs font-black tracking-[0.4em] uppercase opacity-50">
               Engineering Excellence Through Minimalist Aggression
             </p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .neo-brutalist-shadow { box-shadow: 8px 8px 0 0 #000; }
    .neo-brutalist-shadow-primary { box-shadow: 8px 8px 0 0 #b90df2; }
    .skew-brutal { transform: skewY(-1deg); }
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #b90df2; border: 2px solid #000; }
  `]
})
export class DocComponent {}
