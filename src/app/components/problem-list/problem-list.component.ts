import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="sm:flex sm:items-center justify-between">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-semibold text-gray-900">Coding Problems</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all available coding problems to practice.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex gap-4">
          <div class="relative rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <mat-icon class="text-gray-400 text-sm" style="width: 18px; height: 18px; font-size: 18px;">search</mat-icon>
            </div>
            <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6" placeholder="Search problems...">
          </div>
          <select [ngModel]="difficultyFilter()" (ngModelChange)="difficultyFilter.set($event)" class="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-emerald-600 sm:text-sm sm:leading-6">
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Solve</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  @if (problemService.loading()) {
                    <tr>
                      <td colspan="3" class="py-4 text-center text-sm text-gray-500">Loading problems...</td>
                    </tr>
                  } @else if (filteredProblems().length === 0) {
                    <tr>
                      <td colspan="3" class="py-4 text-center text-sm text-gray-500">No problems match your criteria.</td>
                    </tr>
                  } @else {
                    @for (problem of filteredProblems(); track problem.id) {
                      <tr>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ problem.title }}</td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                          <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                            [class.bg-green-100]="problem.difficulty === 'Easy'"
                            [class.text-green-800]="problem.difficulty === 'Easy'"
                            [class.bg-yellow-100]="problem.difficulty === 'Medium'"
                            [class.text-yellow-800]="problem.difficulty === 'Medium'"
                            [class.bg-red-100]="problem.difficulty === 'Hard'"
                            [class.text-red-800]="problem.difficulty === 'Hard'">
                            {{ problem.difficulty }}
                          </span>
                        </td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a [routerLink]="['/problems', problem.id]" class="text-emerald-600 hover:text-emerald-900 flex items-center justify-end gap-1">
                            Solve <mat-icon class="text-sm" style="width: 18px; height: 18px; font-size: 18px;">arrow_forward</mat-icon>
                          </a>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProblemListComponent {
  problemService = inject(ProblemService);
  
  searchQuery = signal('');
  difficultyFilter = signal('All');
  
  filteredProblems = computed(() => {
    let problems = this.problemService.problems();
    
    if (this.difficultyFilter() !== 'All') {
      problems = problems.filter(p => p.difficulty === this.difficultyFilter());
    }
    
    if (this.searchQuery().trim() !== '') {
      const query = this.searchQuery().toLowerCase();
      problems = problems.filter(p => p.title.toLowerCase().includes(query));
    }
    
    return problems;
  });
}
