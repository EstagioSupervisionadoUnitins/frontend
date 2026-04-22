import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AuthService } from '../../../domain/auth/service/auth.service';
import { UsuarioResponse } from '../../../domain/auth/models/usuario-response.interface';
import { SidebarAluno } from "../sidebar-aluno/sidebar-aluno";
import { SidebarProfessor } from "../sidebar-professor/sidebar-professor";
import { Header } from "../header/header";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarAluno, SidebarProfessor, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  private authService = inject(AuthService);
  usuario = signal<UsuarioResponse | null>(null);

  constructor(){
    this.authService.me().subscribe((usuario) => {
      this.usuario.set(usuario);
    });
  }
  sidebarVisible = signal(false);


  toggleSidebar(): void {
    this.sidebarVisible.update(value => !value);
  }

}
