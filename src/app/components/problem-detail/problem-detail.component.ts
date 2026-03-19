import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 items-start">
      <!-- Left Panel: Problem Description -->
      <div class="w-full md:w-1/2 flex flex-col bg-white rounded-lg shadow overflow-hidden sticky top-8 max-h-[calc(100vh-4rem)]">
        @if (loading()) {
          <div class="p-6 text-center text-gray-500 flex-1 flex items-center justify-center">
            <mat-icon class="animate-spin mr-2">autorenew</mat-icon> Loading problem...
          </div>
        } @else if (problem()) {
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-900">{{ problem()?.title }}</h1>
              <span class="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                [class.bg-green-100]="problem()?.difficulty === 'Easy'"
                [class.text-green-800]="problem()?.difficulty === 'Easy'"
                [class.bg-yellow-100]="problem()?.difficulty === 'Medium'"
                [class.text-yellow-800]="problem()?.difficulty === 'Medium'"
                [class.bg-red-100]="problem()?.difficulty === 'Hard'"
                [class.text-red-800]="problem()?.difficulty === 'Hard'">
                {{ problem()?.difficulty }}
              </span>
            </div>
          </div>
          <div class="p-6 flex-1 overflow-y-auto">
            <div class="prose max-w-none text-gray-700">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p class="whitespace-pre-wrap">{{ problem()?.description }}</p>
              
              <h3 class="text-lg font-medium text-gray-900 mt-6 mb-2">Sample Input</h3>
              <pre class="bg-gray-100 p-4 rounded-md text-sm font-mono text-gray-800">{{ problem()?.sampleInput }}</pre>
              
              <h3 class="text-lg font-medium text-gray-900 mt-6 mb-2">Sample Output</h3>
              <pre class="bg-gray-100 p-4 rounded-md text-sm font-mono text-gray-800">{{ problem()?.sampleOutput }}</pre>
            </div>
          </div>
        } @else {
          <div class="p-6 text-center text-red-500 flex-1 flex items-center justify-center">
            Problem not found.
          </div>
        }
      </div>

      <!-- Right Panel: JDoodle Embed -->
      <div class="w-full md:w-1/2 flex flex-col bg-white rounded-lg shadow p-4 min-h-[800px]">
        <div data-pym-src="https://www.jdoodle.com/embed/v1/4defaf9d91a9060c" class="w-full"></div>
      </div>
    </div>
  `
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
      const p = await this.problemService.getProblem(id);
      this.problem.set(p);
    }
    this.loading.set(false);
  }

  ngAfterViewInit() {
    // Dynamically load the JDoodle pym script so it can initialize the embed
    const script = document.createElement('script');
    script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }
}
