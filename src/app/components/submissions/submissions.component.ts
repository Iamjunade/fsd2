import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [DatePipe, MatIconModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Terminal Header -->
      <div class="bg-black border-4 border-black p-3 mb-8 flex items-center justify-between neo-brutalist-shadow">
        <div class="flex items-center gap-3">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500 border border-black"></div>
            <div class="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
          </div>
          <span class="text-white font-black text-xs tracking-tighter uppercase">SESSION_HISTORY_v2.0 // USER:{{ authService.currentUser()?.username }}</span>
        </div>
        <div class="text-[10px] text-slate-500 font-mono hidden sm:block">BAUD_RATE: 9600 // STATUS: ENCRYPTED</div>
      </div>

      <div class="space-y-6">
        @if (submissionService.loading()) {
          <div class="p-12 text-center border-4 border-black border-dashed">
            <div class="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p class="font-black uppercase tracking-widest text-sm">RETRIEVING_DATA_PACKETS...</p>
          </div>
        } @else if (submissionService.userSubmissions().length === 0) {
          <div class="bg-white border-4 border-black p-12 text-center neo-brutalist-shadow">
            <mat-icon class="text-6xl h-auto w-auto mb-4 text-slate-300">history</mat-icon>
            <h3 class="text-xl font-black uppercase mb-2">NO_RECORD_FOUND</h3>
            <p class="text-slate-500 font-medium">Initial submission sequence not yet established.</p>
            <button routerLink="/problems" class="mt-6 px-8 py-3 bg-primary text-white border-4 border-black font-black uppercase tracking-tighter hover:translate-x-1 hover:-translate-y-1 transition-transform neo-brutalist-shadow-primary">
              INITIATE_FIRST_HACK
            </button>
          </div>
        } @else {
          <div class="grid gap-6">
            @for (sub of submissionService.userSubmissions(); track sub.id) {
              <div class="bg-white border-4 border-black neo-brutalist-shadow overflow-hidden group hover:-translate-y-1 transition-transform">
                <div class="p-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                      <div class="w-12 h-12 flex-shrink-0 border-4 border-black flex items-center justify-center font-black text-xl"
                        [class.bg-green-400]="sub.status === 'Accepted'"
                        [class.bg-red-400]="sub.status === 'Wrong Answer' || sub.status === 'Error' || sub.status === 'Runtime Error'"
                        [class.bg-yellow-400]="sub.status === 'Pending'">
                        @if (sub.status === 'Accepted') {
                          <mat-icon>check</mat-icon>
                        } @else if (sub.status === 'Pending') {
                          <mat-icon>schedule</mat-icon>
                        } @else {
                          <mat-icon>close</mat-icon>
                        }
                      </div>
                      
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-[10px] font-black uppercase tracking-tighter text-slate-500">PROBLEM_NODE:</span>
                          <a [routerLink]="['/problems', sub.problemId]" class="font-black text-primary hover:underline uppercase tracking-tighter">
                            {{ sub.problemId }}
                          </a>
                        </div>
                        <h3 class="text-lg font-black uppercase leading-none mb-2">
                          {{ sub.status }}
                        </h3>
                        <div class="flex flex-wrap gap-3 text-[10px] font-bold text-slate-600 uppercase">
                          <span class="flex items-center gap-1">
                            <mat-icon class="text-xs w-auto h-auto">calendar_today</mat-icon>
                            {{ sub.submittedAt | date:'medium' }}
                          </span>
                          <span class="flex items-center gap-1">
                            <mat-icon class="text-xs w-auto h-auto">speed</mat-icon>
                            {{ sub.executionTime }}MS
                          </span>
                          <span class="flex items-center gap-1">
                            <mat-icon class="text-xs w-auto h-auto">code</mat-icon>
                            {{ sub.language }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button [routerLink]="['/problems', sub.problemId]" class="px-4 py-2 bg-black text-white border-2 border-black font-black text-[10px] uppercase hover:bg-slate-800 transition-colors">
                        VIEW_CODE
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Expanded section indicator -->
                <div class="h-1 bg-black w-full opacity-10 group-hover:opacity-100 transition-opacity"></div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
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
