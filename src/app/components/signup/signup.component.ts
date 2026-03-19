import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] terminal-grid bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="border-4 border-black bg-white dark:bg-slate-900 neo-brutalist-shadow overflow-hidden">
          <!-- Header -->
          <div class="bg-primary px-6 py-4 border-b-4 border-black flex items-center justify-between">
            <h2 class="text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
              <span class="material-symbols-outlined">person_add</span>
              CREATE_ACCOUNT
            </h2>
            <span class="bg-black text-white px-2 py-0.5 text-[10px] font-black italic">v1.2.0</span>
          </div>

          <div class="p-8">
            <p class="text-xs font-bold text-slate-500 uppercase mb-8 italic">// ESTABLISHING_IDENTITY_PROTOCOL</p>

            @if (errorMessage()) {
              <div class="bg-red-500 text-white border-4 border-black p-4 mb-6 neo-brutalist-shadow font-black uppercase text-xs flex items-center gap-2 animate-bounce">
                <span class="material-symbols-outlined">warning</span>
                {{ errorMessage() }}
              </div>
            }

            <form (submit)="signup($event)" class="space-y-6">
              <!-- Username -->
              <div>
                <label class="block text-xs font-black uppercase mb-2 text-slate-700 dark:text-slate-300">USERNAME_ALIAS</label>
                <div class="border-2 border-black bg-slate-50 dark:bg-slate-800">
                  <input type="text" [(ngModel)]="username" name="username" required
                    class="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-bold uppercase text-sm"
                    placeholder="ENTER_ALIAS">
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-black uppercase mb-2 text-slate-700 dark:text-slate-300">EMAIL_ADDRESS</label>
                <div class="border-2 border-black bg-slate-50 dark:bg-slate-800">
                  <input type="email" [(ngModel)]="email" name="email" required
                    class="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-bold uppercase text-sm"
                    placeholder="ENTER_EMAIL">
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-xs font-black uppercase mb-2 text-slate-700 dark:text-slate-300">ACCESS_KEY</label>
                <div class="border-2 border-black bg-slate-50 dark:bg-slate-800">
                  <input type="password" [(ngModel)]="password" name="password" required
                    class="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-bold uppercase text-sm"
                    placeholder="ENTER_KEY">
                </div>
              </div>

              <div class="pt-4 space-y-4">
                <button type="submit" [disabled]="loading()"
                  class="w-full bg-primary text-black border-4 border-black py-4 font-black uppercase text-xl neo-brutalist-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (loading()) {
                    EXECUTING...
                  } @else {
                    INITIATE_SIGNUP
                  }
                </button>

                <div class="flex items-center gap-4 py-2">
                  <div class="h-0.5 bg-black/10 dark:bg-white/10 flex-1"></div>
                  <span class="text-[10px] font-black text-slate-500 uppercase">OR_OAUTH</span>
                  <div class="h-0.5 bg-black/10 dark:bg-white/10 flex-1"></div>
                </div>

                <button type="button" (click)="loginWithGoogle()"
                  class="w-full bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black py-3 font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <img src="https://www.google.com/favicon.ico" class="size-4" alt="Google">
                  SIGNUP_WITH_GOOGLE
                </button>
              </div>
            </form>

            <div class="mt-8 pt-6 border-t-2 border-black/10 dark:border-white/10 text-center">
              <p class="text-xs font-bold text-slate-500 uppercase">
                ALREADY_HAVE_IDENTITY? 
                <a routerLink="/login" class="text-primary hover:underline ml-1">RETURN_TO_LOGIN</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);

  username = '';
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  async signup(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);
    if (this.email && this.password && this.username) {
      this.loading.set(true);
      try {
        await this.authService.signupWithEmail(this.email, this.password, this.username);
        this.router.navigate(['/problems']);
      } catch (error: any) {
        console.error('Signup failed', error);
        if (error.code === 'permission-denied' || error.message?.includes('permission')) {
          this.errorMessage.set('DATABASE_PERMISSION_DENIDED: CONTACT_ADMIN');
        } else {
          this.errorMessage.set(error.message || 'SIGNUP_FAILURE_DETECTED');
        }
      } finally {
        this.loading.set(false);
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/problems']);
    } catch (error) {
      console.error('Google login failed', error);
    }
  }
}
