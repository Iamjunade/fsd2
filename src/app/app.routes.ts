import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { AdminComponent } from './components/admin/admin.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { IdentityComponent } from './components/identity/identity.component';
import { ManifestoComponent } from './components/manifesto/manifesto.component';
import { BlogComponent } from './components/blog/blog.component';
import { CommunityComponent } from './components/community/community.component';
import { ConnectComponent } from './components/connect/connect.component';
import { DocComponent } from './components/doc/doc.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'problems', component: ProblemListComponent },
  { path: 'problems/:id', component: ProblemDetailComponent },
  { path: 'submissions', component: SubmissionsComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'identity', component: IdentityComponent },
  { path: 'manifesto', component: ManifestoComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'connect', component: ConnectComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'docs', component: DocComponent },
  { path: '**', redirectTo: '' }
];
