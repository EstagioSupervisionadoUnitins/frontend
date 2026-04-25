import { Component, computed, inject, output, signal } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { AuthService } from '../../../domain/auth/service/auth.service';
import { UsuarioResponse } from '../../../domain/auth/models/usuario-response.interface';
import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private authService = inject(AuthService);
  classroomService = inject(ClassroomService);
  
  toggleSidebar = output<void>();

  private user = signal<UsuarioResponse | null>(null);

  constructor() {
    this.authService.me().subscribe(u => this.user.set(u));
  }

  canShowMenu = computed(() => {
    const u = this.user();
    if (!u) return false;
    if (u.role === 'teacher') return true;
    return !!this.classroomService.activeClassroom();
  });

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }
}
