import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full bg-white dark:bg-black border-b-4 border-black dark:border-primary px-6 py-4">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-4 group cursor-pointer no-underline">
          <div class="bg-primary p-2 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#fff] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
            <span class="material-symbols-outlined text-white text-2xl">terminal</span>
          </div>
          <h2 class="text-2xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">CodeLab</h2>
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-8">
          <a routerLink="/problems" routerLinkActive="text-primary border-primary"
             class="text-sm font-black uppercase hover:text-primary transition-all border-b-2 border-transparent hover:border-black dark:hover:border-primary no-underline">
            Challenges
          </a>
          @if (authService.currentUser()) {
            <a routerLink="/submissions" routerLinkActive="text-primary border-primary"
               class="text-sm font-black uppercase hover:text-primary transition-all border-b-2 border-transparent hover:border-black dark:hover:border-primary no-underline">
              Submissions
            </a>
            @if (authService.currentUser()?.role === 'admin') {
              <a routerLink="/admin" routerLinkActive="text-primary border-primary"
                 class="text-sm font-black uppercase hover:text-primary transition-all border-b-2 border-transparent hover:border-black dark:hover:border-primary no-underline">
                Admin Panel
              </a>
            }
          }
        </nav>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-4">
          @if (authService.currentUser()) {
            <span class="text-sm font-bold text-slate-600 dark:text-slate-300 hidden md:inline">
              Welcome, {{ authService.currentUser()?.username }}
            </span>
            <button (click)="logout()"
                    class="px-6 py-2 text-sm font-black uppercase border-3 border-black dark:border-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
              Log Out
            </button>
          } @else {
            <a routerLink="/login"
               class="px-6 py-2 text-sm font-black uppercase border-3 border-black dark:border-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all no-underline">
              Log In
            </a>
            <a routerLink="/login"
               class="px-6 py-2 text-sm font-black uppercase bg-primary text-white border-3 border-black dark:border-white shadow-brutal dark:shadow-brutal-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all no-underline">
              Join Now
            </a>
          }
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);

  async logout() {
    await this.authService.logout();
  }
}
