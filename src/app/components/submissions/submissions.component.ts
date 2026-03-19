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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-semibold text-gray-900">My Submissions</h1>
          <p class="mt-2 text-sm text-gray-700">A history of all your code submissions across problems.</p>
        </div>
      </div>
      
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Time Submitted</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Problem ID</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Runtime</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Language</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  @if (submissionService.loading()) {
                    <tr>
                      <td colspan="5" class="py-4 text-center text-sm text-gray-500">Loading submissions...</td>
                    </tr>
                  } @else if (submissionService.userSubmissions().length === 0) {
                    <tr>
                      <td colspan="5" class="py-4 text-center text-sm text-gray-500">You haven't made any submissions yet.</td>
                    </tr>
                  } @else {
                    @for (sub of submissionService.userSubmissions(); track sub.id) {
                      <tr>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {{ sub.submittedAt | date:'medium' }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-emerald-600">
                          <a [routerLink]="['/problems', sub.problemId]">{{ sub.problemId }}</a>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm font-medium">
                          <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                            [class.bg-green-100]="sub.status === 'Accepted'"
                            [class.text-green-800]="sub.status === 'Accepted'"
                            [class.bg-red-100]="sub.status === 'Wrong Answer' || sub.status === 'Error'"
                            [class.text-red-800]="sub.status === 'Wrong Answer' || sub.status === 'Error'"
                            [class.bg-gray-100]="sub.status === 'Pending'"
                            [class.text-gray-800]="sub.status === 'Pending'">
                            {{ sub.status }}
                          </span>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {{ sub.executionTime }} ms
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            {{ sub.language }}
                          </span>
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
