import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SidebarComponent],
  template: `
    <div class="h-[calc(100vh-76px)] bg-[#0a0a0a] dot-grid-bg text-white font-display overflow-hidden flex flex-col sm:flex-row">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <main class="flex-1 relative p-6 sm:p-24 flex items-center justify-center">
        <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div class="lg:col-span-3 space-y-12">
            <h1 class="text-9xl font-black italic uppercase leading-none skew-brutal glitch-text-brutal" data-text="CONNECT">
              CONNECT
            </h1>
            <p class="text-2xl font-bold uppercase text-slate-500 max-w-md leading-relaxed">
              STABLISH SECURE LINK WITH THE CORE SYSTEM OVERLORDS. NO PACKET SNIFFING ALLOWED.
            </p>
            <div class="pt-8 border-t-8 border-primary inline-block">
               <div class="text-[10px] font-black tracking-widest uppercase text-primary">ENCRYPTION_PROTOCOL: RSA_4096</div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-4">
             <a href="mailto:admin@codelab.io" class="block bg-white text-black p-8 border-4 border-black neo-brutalist-shadow hover:-translate-y-2 transition-all">
               <div class="flex items-center justify-between">
                 <span class="text-4xl font-black italic uppercase">EMAIL</span>
                 <mat-icon class="text-4xl h-auto w-auto">mail</mat-icon>
               </div>
               <p class="text-[8px] font-black uppercase mt-4 text-slate-500">SECURE_MAIL_RELAY</p>
             </a>
             
             <a href="#" class="block bg-primary text-black p-8 border-4 border-black neo-brutalist-shadow hover:-translate-y-2 transition-all">
               <div class="flex items-center justify-between">
                 <span class="text-4xl font-black italic uppercase">X/COMM</span>
                 <mat-icon class="text-4xl h-auto w-auto">chat_bubble</mat-icon>
               </div>
               <p class="text-[8px] font-black uppercase mt-4 text-black opacity-50">DIRECT_COMM_CHANNEL</p>
             </a>

             <a href="#" class="block bg-black text-primary p-8 border-4 border-primary neo-brutalist-shadow-primary hover:-translate-y-2 transition-all">
               <div class="flex items-center justify-between">
                 <span class="text-4xl font-black italic uppercase">GITHUB</span>
                 <mat-icon class="text-4xl h-auto w-auto">terminal</mat-icon>
               </div>
               <p class="text-[8px] font-black uppercase mt-4 text-primary opacity-50">CORE_REPOSITORY_ACCESS</p>
             </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .skew-brutal { transform: skewY(-2deg); }
  `]
})
export class ConnectComponent {}
