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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="sm:flex sm:items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">Admin Panel</h1>
          <p class="mt-2 text-sm text-gray-700">Manage coding problems.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="seedProblems()" [disabled]="seeding()" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50">
            <mat-icon class="mr-2 text-gray-500">auto_awesome</mat-icon> 
            {{ seeding() ? 'Seeding...' : 'Seed 10 Problems' }}
          </button>
          <button (click)="openAddModal()" class="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto">
            <mat-icon class="mr-2">add</mat-icon> Add Problem
          </button>
        </div>
      </div>

      <!-- Problem List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          @for (problem of problemService.problems(); track problem.id) {
            <li>
              <div class="px-4 py-4 flex items-center sm:px-6">
                <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div class="flex text-sm">
                      <p class="font-medium text-emerald-600 truncate">{{ problem.title }}</p>
                      <p class="ml-1 flex-shrink-0 font-normal text-gray-500">
                        - {{ problem.difficulty }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="ml-5 flex-shrink-0 flex gap-2">
                  <button (click)="openEditModal(problem)" class="text-indigo-600 hover:text-indigo-900">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button (click)="deleteProblem(problem.id!)" class="text-red-600 hover:text-red-900">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>

      <!-- Modal for Add/Edit -->
      @if (showModal()) {
        <div class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ editingProblem() ? 'Edit Problem' : 'Add New Problem' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" type="text" [ngModel]="formData().title" (ngModelChange)="updateFormData('title', $event)" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulty</label>
                    <select id="difficulty" [ngModel]="formData().difficulty" (ngModelChange)="updateFormData('difficulty', $event)" class="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" [ngModel]="formData().description" (ngModelChange)="updateFormData('description', $event)" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"></textarea>
                  </div>
                  <div>
                    <label for="sampleInput" class="block text-sm font-medium text-gray-700">Sample Input</label>
                    <textarea id="sampleInput" [ngModel]="formData().sampleInput" (ngModelChange)="updateFormData('sampleInput', $event)" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm font-mono"></textarea>
                  </div>
                  <div>
                    <label for="sampleOutput" class="block text-sm font-medium text-gray-700">Sample Output</label>
                    <textarea id="sampleOutput" [ngModel]="formData().sampleOutput" (ngModelChange)="updateFormData('sampleOutput', $event)" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm font-mono"></textarea>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button type="button" (click)="saveProblem()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:col-start-2 sm:text-sm">
                  Save
                </button>
                <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                  Cancel
                </button>
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
      { title: 'Two Sum', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', sampleInput: 'nums = [2,7,11,15]\ntarget = 9', sampleOutput: '[0,1]', createdAt: new Date().toISOString() },
      { title: 'Reverse String', difficulty: 'Easy', description: 'Write a function that reverses a string. The input string is given as an array of characters s.', sampleInput: 's = ["h","e","l","l","o"]', sampleOutput: '["o","l","l","e","h"]', createdAt: new Date().toISOString() },
      { title: 'FizzBuzz', difficulty: 'Easy', description: 'Given an integer n, return a string array answer (1-indexed) where answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, and i (as a string) if none of the above conditions are true.', sampleInput: 'n = 3', sampleOutput: '["1","2","Fizz"]', createdAt: new Date().toISOString() },
      { title: 'Valid Palindrome', difficulty: 'Easy', description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.', sampleInput: 's = "A man, a plan, a canal: Panama"', sampleOutput: 'true', createdAt: new Date().toISOString() },
      { title: 'Fibonacci Number', difficulty: 'Easy', description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.', sampleInput: 'n = 2', sampleOutput: '1', createdAt: new Date().toISOString() },
      { title: 'Valid Parentheses', difficulty: 'Easy', description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.', sampleInput: 's = "()[]{}"', sampleOutput: 'true', createdAt: new Date().toISOString() },
      { title: 'Maximum Subarray', difficulty: 'Medium', description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', sampleOutput: '6', createdAt: new Date().toISOString() },
      { title: 'Climbing Stairs', difficulty: 'Easy', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?', sampleInput: 'n = 2', sampleOutput: '2', createdAt: new Date().toISOString() },
      { title: 'Missing Number', difficulty: 'Easy', description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.', sampleInput: 'nums = [3,0,1]', sampleOutput: '2', createdAt: new Date().toISOString() },
      { title: 'Container With Most Water', difficulty: 'Medium', description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.', sampleInput: 'height = [1,8,6,2,5,4,8,3,7]', sampleOutput: '49', createdAt: new Date().toISOString() }
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
