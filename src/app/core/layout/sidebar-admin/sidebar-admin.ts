import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, model, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule, Drawer } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { UsuarioResponse } from '../../../domain/auth/models/usuario-response.interface';
import { AuthService } from '../../../domain/auth/service/auth.service';
import { sidebarDataAdmin } from './sidebar-data';
import { ClassroomService } from '../../../domain/classroom/services/classroom.service';

@Component({
  selector: 'app-sidebar-admin',
  imports: [ButtonModule, DrawerModule, RippleModule, AvatarModule, RouterLink, AsyncPipe, TooltipModule],
  templateUrl: '../sidebar-aluno/sidebar-aluno.html',
  styleUrl: '../sidebar-aluno/sidebar-aluno.css',
})
export class SidebarAdmin {
  authService = inject(AuthService);
  classroomService = inject(ClassroomService);
  usuario = signal<UsuarioResponse | null>(null);
  
  sidebarData = sidebarDataAdmin;
  constructor(){
    this.authService.me().subscribe((usuario) => {
      this.usuario.set(usuario);
    });
  }

  labelForAvatarIcon = computed(() => {
    const username = this.usuario()?.username;
    return username ? username.charAt(0).toUpperCase() : 'A';
  });

  visible = model<boolean>(false);
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.visible.set(false);
    this.drawerRef.close(e);
  }

  logout(): void {
    this.authService.logout();
  }

  onMenuItemClick(): void {
    this.visible.set(false);
  }
}
