import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center text-emerald-600">
          <mat-icon class="text-5xl" style="width: 48px; height: 48px; font-size: 48px;">code</mat-icon>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <p class="mb-6 text-gray-600">Use your Google account to sign in or register.</p>
          
          <div>
            <button (click)="login()" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <span class="flex items-center gap-2">
                <mat-icon>login</mat-icon> Sign in with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  async login() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/problems']);
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}
