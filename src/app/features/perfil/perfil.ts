import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AlunoService } from '../../domain/aluno/services/aluno.service';
import { InsightIa } from '../dashboard/components/insight-ia/insight-ia';
import { AuthService } from '../../domain/auth/service/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, AvatarModule, InsightIa],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private alunoService = inject(AlunoService);
  public authService = inject(AuthService);
  
  stats = this.alunoService.stats;

  accuracy = computed(() => {
    const s = this.stats();
    if (!s || s.questions_attempted === 0) return 0;
    return Math.round((s.questions_solved / s.questions_attempted) * 100);
  });

  initial = computed(() => {
    const username = this.stats()?.username || 'U';
    return username.charAt(0).toUpperCase();
  });

  ngOnInit(): void {
    this.alunoService.getStats().subscribe();
  }
}
