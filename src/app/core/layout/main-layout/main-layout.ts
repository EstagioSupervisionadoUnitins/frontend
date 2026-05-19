import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AuthService } from '../../../domain/auth/service/auth.service';
import { UsuarioResponse } from '../../../domain/auth/models/usuario-response.interface';
import { SidebarAluno } from "../sidebar-aluno/sidebar-aluno";
import { SidebarProfessor } from "../sidebar-professor/sidebar-professor";
import { SidebarAdmin } from "../sidebar-admin/sidebar-admin";
import { Header } from "../header/header";
import { ClassroomService } from '../../../domain/classroom/services/classroom.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarAluno, SidebarProfessor, SidebarAdmin, Header, BreadcrumbComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  private authService = inject(AuthService);
  private classroomService = inject(ClassroomService);
  usuario = signal<UsuarioResponse | null>(null);

  constructor(){
    this.authService.me().subscribe((usuario) => {
      this.usuario.set(usuario);
    });
  }

  canShowSidebar() {
    const user = this.usuario();
    if (!user) return false;
    if (user.role === 'teacher' || user.role === 'super_admin') return true;
    return !!this.classroomService.activeClassroom();
  }

  sidebarVisible = signal(false);


  toggleSidebar(): void {
    this.sidebarVisible.update(value => !value);
  }

}
