import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./books/components/home-search/home-search.component').then(
        (m) => m.HomeSearchComponent
      ),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'books/view',
    loadComponent: () =>
      import('./books/components/book-view/book-view.component').then(
        (m) => m.BookViewComponent
      ),
    canActivate: [AuthenticatedGuard],
  },
];
