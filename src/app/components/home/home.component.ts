import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative flex min-h-screen w-full flex-col">
      <main class="flex-1">

        <!-- Hero: Digital Poster Style -->
        <section class="relative min-h-[90vh] flex items-center px-6 overflow-hidden border-b-4 border-black dark:border-primary">
          <div class="absolute inset-0 z-0 bg-primary/5 opacity-40">
            <div class="absolute top-0 right-0 w-1/2 h-full border-l-4 border-black/10 dark:border-primary/20"></div>
            <div class="absolute bottom-0 left-0 w-full h-1/3 border-t-4 border-black/10 dark:border-primary/20"></div>
          </div>
          <div class="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
            <div class="lg:col-span-8 flex flex-col justify-center py-20">
              <div class="inline-block self-start px-4 py-1 mb-6 bg-yellow-400 text-black font-black uppercase border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                System Design Track Live
              </div>
              <h1 class="text-7xl md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase mb-8">
                Master the <br/>
                <span class="text-primary italic overlap-text">Art of</span> <br/>
                Code
              </h1>
              <p class="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400 max-w-xl mb-12 border-l-8 border-primary pl-6">
                A creative playground for modern developers to sharpen their skills and build the future. Join the elite.
              </p>
              <div class="flex flex-wrap gap-6">
                @if (authService.currentUser()) {
                  <a routerLink="/problems"
                     class="px-10 py-5 bg-primary text-white text-xl font-black uppercase border-4 border-black dark:border-white shadow-brutal dark:shadow-brutal-white hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline inline-block">
                    Continue Practicing
                  </a>
                  <a routerLink="/submissions"
                     class="px-10 py-5 bg-white dark:bg-black text-black dark:text-white text-xl font-black uppercase border-4 border-black dark:border-primary shadow-brutal dark:shadow-brutal-purple hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline inline-block">
                    My Submissions
                  </a>
                } @else {
                  <a routerLink="/login"
                     class="px-10 py-5 bg-primary text-white text-xl font-black uppercase border-4 border-black dark:border-white shadow-brutal dark:shadow-brutal-white hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline inline-block">
                    Get Started
                  </a>
                  <a routerLink="/problems"
                     class="px-10 py-5 bg-white dark:bg-black text-black dark:text-white text-xl font-black uppercase border-4 border-black dark:border-primary shadow-brutal dark:shadow-brutal-purple hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline inline-block">
                    View Tracks
                  </a>
                }
              </div>
            </div>
            <div class="lg:col-span-4 relative mt-12 lg:mt-0">
              <div class="absolute -top-10 -right-10 vertical-text text-8xl font-black text-black/5 dark:text-white/5 select-none uppercase">
                Playground
              </div>
              <div class="relative w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 border-4 border-black dark:border-primary shadow-brutal dark:shadow-brutal-purple overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-800 to-black"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary/40 text-[200px]">code</span>
                </div>
                <div class="absolute bottom-6 left-6 right-6 p-4 bg-primary text-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <p class="font-black italic uppercase text-sm">Active Developers: 50,231</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Social Proof: Harsh Scrolling Bar -->
        <section class="bg-primary py-8 border-b-4 border-black">
          <div class="flex whitespace-nowrap overflow-hidden items-center">
            <div class="flex gap-20 animate-marquee items-center">
              <span class="text-4xl font-black text-white italic stroke-black uppercase">Techflow</span>
              <span class="text-4xl font-black text-black uppercase">Nexus</span>
              <span class="text-4xl font-black text-white uppercase">Prism.io</span>
              <span class="text-4xl font-black text-black italic uppercase">Vortex</span>
              <span class="text-4xl font-black text-white uppercase tracking-tighter">Quantum</span>
              <span class="text-4xl font-black text-white italic stroke-black uppercase">Techflow</span>
              <span class="text-4xl font-black text-black uppercase">Nexus</span>
              <span class="text-4xl font-black text-white uppercase">Prism.io</span>
              <span class="text-4xl font-black text-black italic uppercase">Vortex</span>
              <span class="text-4xl font-black text-white uppercase tracking-tighter">Quantum</span>
            </div>
          </div>
        </section>

        <!-- Features: Irregular Grid and Shapes -->
        <section class="py-32 px-6 relative bg-white dark:bg-[#0d0d0d]">
          <div class="max-w-[1400px] mx-auto">
            <div class="flex flex-col md:flex-row gap-12 items-end mb-24">
              <h2 class="text-6xl md:text-8xl font-black uppercase leading-tight">
                Why <br/> <span class="text-primary italic">Codelab?</span>
              </h2>
              <p class="text-xl font-bold max-w-md pb-4 border-b-4 border-primary">
                We don't do boring. Master engineering concepts in a space designed for creators, not just keyboard smashers.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
              <!-- Feature 1 -->
              <div class="md:col-span-5 bg-white dark:bg-black p-10 border-4 border-black dark:border-primary shadow-brutal dark:shadow-brutal-purple rotate-[-1deg] hover:rotate-0 transition-transform">
                <div class="w-16 h-16 bg-primary border-3 border-black dark:border-white mb-8 flex items-center justify-center text-white">
                  <span class="material-symbols-outlined text-4xl">code_blocks</span>
                </div>
                <h3 class="text-3xl font-black uppercase mb-4">Brutal Challenges</h3>
                <p class="text-lg font-bold text-slate-600 dark:text-slate-400">
                  Solve real-world problems in our low-latency IDE. No fluff, just pure architectural logic.
                </p>
              </div>
              <!-- Feature 2 -->
              <div class="md:col-span-7 bg-primary p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[1deg] hover:rotate-0 transition-transform md:mt-12">
                <div class="w-16 h-16 bg-white border-3 border-black mb-8 flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-4xl">groups</span>
                </div>
                <h3 class="text-3xl font-black uppercase mb-4 text-white">Cult of Code</h3>
                <p class="text-lg font-bold text-white/90">
                  A community that actually pushes you. High-signal discussions and peer reviews that don't pull punches.
                </p>
              </div>
              <!-- Feature 3 -->
              <div class="md:col-span-4 bg-yellow-400 p-10 border-4 border-black shadow-brutal hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all md:-mt-8">
                <h3 class="text-3xl font-black uppercase mb-4 text-black">Career Growth</h3>
                <p class="text-lg font-bold text-black/80">
                  Level up for the elite teams. Specialized tracks for system design and high-frequency algorithms.
                </p>
              </div>
              <!-- Decorative Element -->
              <div class="hidden md:flex md:col-span-8 h-48 border-4 border-dashed border-black/20 dark:border-primary/20 items-center justify-center">
                <span class="text-9xl font-black text-black/5 dark:text-white/5 uppercase">Experimental</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Problem Preview: Offset Layout -->
        <section class="py-32 px-6 bg-background-light dark:bg-black border-y-4 border-black dark:border-primary">
          <div class="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20">
            <div class="lg:w-1/3 flex flex-col gap-10">
              <h2 class="text-5xl font-black uppercase italic leading-none">
                Zero <br/> Friction <br/> <span class="text-primary not-italic">Coding</span>
              </h2>
              <div class="space-y-6">
                <div class="p-6 border-3 border-black dark:border-primary bg-white dark:bg-slate-900 shadow-brutal dark:shadow-brutal-purple">
                  <h4 class="font-black uppercase mb-2">20+ Languages</h4>
                  <p class="font-bold text-sm text-slate-500">Native performance across the stack.</p>
                </div>
                <div class="p-6 border-3 border-black dark:border-primary bg-white dark:bg-slate-900 shadow-brutal dark:shadow-brutal-purple translate-x-4">
                  <h4 class="font-black uppercase mb-2">Benchmarking</h4>
                  <p class="font-bold text-sm text-slate-500">Real-time memory and CPU metrics.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-2/3">
              <div class="relative">
                <div class="absolute -inset-4 bg-primary rotate-1 z-0"></div>
                <div class="relative z-10 border-4 border-black bg-[#1a1a1a] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div class="bg-black border-b-4 border-black px-6 py-4 flex items-center justify-between">
                    <div class="flex gap-3">
                      <div class="w-4 h-4 border-2 border-white bg-red-500"></div>
                      <div class="w-4 h-4 border-2 border-white bg-yellow-500"></div>
                      <div class="w-4 h-4 border-2 border-white bg-green-500"></div>
                    </div>
                    <div class="text-xs font-black text-white uppercase tracking-widest italic">solution.asm</div>
                  </div>
                  <div class="p-8 font-mono text-lg overflow-x-auto">
<pre class="text-white"><span class="text-primary">function</span> <span class="text-blue-400">optimize_life</span>() {{'{'}}
    <span class="text-primary">const</span> vision = <span class="text-yellow-400">"uncompromising"</span>;
    <span class="text-primary">const</span> code = <span class="text-yellow-400">"clean"</span>;

    <span class="text-slate-500">// Neo-Brutalism in every line</span>
    <span class="text-primary">return</span> vision + code;
{{'}'}}
</pre>
                  </div>
                  <div class="bg-white p-6 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="text-black font-black uppercase text-sm italic">Status: Breaking the Mold</span>
                    <a routerLink="/problems"
                       class="w-full sm:w-auto px-8 py-3 bg-primary text-white font-black uppercase border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all no-underline inline-block text-center">
                      Execute Logic
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA: Massive Poster CTA -->
        <section class="py-40 px-6 bg-white dark:bg-black">
          <div class="max-w-[1200px] mx-auto bg-black text-white p-12 md:p-24 relative overflow-hidden border-8 border-primary shadow-[24px_24px_0px_0px_#b90df2]">
            <div class="absolute top-0 right-0 p-8 vertical-text text-4xl font-black text-primary/30 uppercase leading-none">
              Uncompromising
            </div>
            <div class="relative z-10 space-y-12">
              <h2 class="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                Join the <br/> <span class="text-primary">Avant-Garde</span>
              </h2>
              <p class="text-2xl font-bold max-w-2xl text-slate-400">
                Stop practicing randomly. Use our curated paths to master the algorithms that matter in a design language that inspires.
              </p>
              @if (authService.currentUser()) {
                <a routerLink="/problems"
                   class="inline-block px-16 py-8 bg-white text-black text-3xl font-black uppercase border-4 border-primary shadow-[12px_12px_0px_0px_#b90df2] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all no-underline">
                  Start Journey
                </a>
              } @else {
                <a routerLink="/login"
                   class="inline-block px-16 py-8 bg-white text-black text-3xl font-black uppercase border-4 border-primary shadow-[12px_12px_0px_0px_#b90df2] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all no-underline">
                  Start Journey
                </a>
              }
            </div>
          </div>
        </section>

      </main>

      <!-- Footer: Industrial and Bold -->
      <footer class="bg-black text-white px-6 py-24 border-t-8 border-primary">
        <div class="max-w-[1400px] mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div class="md:col-span-4 space-y-8">
              <div class="flex items-center gap-4">
                <div class="bg-primary p-2 border-2 border-white">
                  <span class="material-symbols-outlined text-white text-3xl">terminal</span>
                </div>
                <h2 class="text-4xl font-black uppercase italic tracking-tighter">CodeLab</h2>
              </div>
              <p class="text-xl font-bold text-slate-500 leading-tight uppercase">
                The premier destination for high-performance engineers who give a damn about craft.
              </p>
              <div class="flex gap-6">
                <a href="#" class="w-14 h-14 border-3 border-white flex items-center justify-center hover:bg-primary transition-all shadow-[4px_4px_0px_0px_#fff]">
                  <span class="material-symbols-outlined">alternate_email</span>
                </a>
                <a href="#" class="w-14 h-14 border-3 border-white flex items-center justify-center hover:bg-primary transition-all shadow-[4px_4px_0px_0px_#fff]">
                  <span class="material-symbols-outlined">public</span>
                </a>
              </div>
            </div>
            <div class="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-12">
              <div class="space-y-6">
                <h4 class="text-primary font-black uppercase text-xl">Platform</h4>
                <ul class="space-y-4 font-bold text-lg uppercase list-none p-0">
                  <li><a routerLink="/problems" class="hover:underline text-white no-underline">Problems</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Challenges</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Tracks</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Interviews</a></li>
                </ul>
              </div>
              <div class="space-y-6">
                <h4 class="text-primary font-black uppercase text-xl">Identity</h4>
                <ul class="space-y-4 font-bold text-lg uppercase list-none p-0">
                  <li><a href="#" class="hover:underline text-white no-underline">The Manifesto</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Blog</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Community</a></li>
                  <li><a href="#" class="hover:underline text-white no-underline">Connect</a></li>
                </ul>
              </div>
              <div class="space-y-6">
                <h4 class="text-primary font-black uppercase text-xl">Legal</h4>
                <ul class="space-y-4 font-bold text-sm uppercase text-slate-500 list-none p-0">
                  <li><a href="#" class="hover:text-white transition-colors no-underline">Privacy Ops</a></li>
                  <li><a href="#" class="hover:text-white transition-colors no-underline">Service Terms</a></li>
                  <li><a href="#" class="hover:text-white transition-colors no-underline">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row justify-between items-end gap-8 pt-12 border-t-4 border-white/10 text-xs font-black uppercase tracking-[0.3em]">
            <p>© 2024 CODELAB / ESTABLISHED IN THE VOID.</p>
            <div class="flex flex-col items-end gap-2 text-primary">
              <span>SYSTEM_STATUS: RAW_AND_FUNCTIONAL</span>
              <span>DESIGNED_TO_BE_DIFFERENT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  authService = inject(AuthService);
}
