import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../domain/auth/service/auth.service';
import { UsuarioResponse } from '../../../domain/auth/models/usuario-response.interface';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  template: `
    <div class="breadcrumb-container" *ngIf="items.length > 0">
      <p-breadcrumb [model]="items" [home]="home"></p-breadcrumb>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-breadcrumb {
      background: transparent;
      border: none;
      padding: 0;
    }
    :host ::ng-deep .p-breadcrumb ul {
      padding: 0;
      margin: 0;
    }
    .breadcrumb-container {
      margin-bottom: 1.5rem;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  ngOnInit() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.items = this.createBreadcrumbs(this.activatedRoute.root);
      this.updateHomeLink();
    });

    // Initial build
    this.items = this.createBreadcrumbs(this.activatedRoute.root);
    this.updateHomeLink();
  }

  private updateHomeLink() {
    this.authService.me().subscribe((user: UsuarioResponse | null) => {
      if (user) {
        this.home.routerLink = user.role === 'teacher' ? '/professor/dashboard' : '/aluno/dashboard';
      }
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      // Only process the primary outlet
      if (child.outlet !== 'primary') {
        continue;
      }

      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label && (breadcrumbs.length === 0 || breadcrumbs[breadcrumbs.length - 1].label !== label)) {
        breadcrumbs.push({ label, routerLink: url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
