import { Component, inject, OnInit } from '@angular/core';
import { HeroProgresso } from './components/hero-progresso/hero-progresso';
import { InsightIa } from './components/insight-ia/insight-ia';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../../domain/aluno/services/aluno.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeroProgresso, InsightIa, RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private alunoService = inject(AlunoService);

  ngOnInit(): void {
    this.alunoService.getStats().subscribe();
  }
}
