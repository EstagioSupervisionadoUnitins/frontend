import { Component, inject, OnInit, signal } from '@angular/core';
import { HeroProgresso } from './components/hero-progresso/hero-progresso';
import { InsightIa } from './components/insight-ia/insight-ia';
import { QuestionService } from '../../domain/question/services/question.service';
import { Question } from '../../domain/question/models/question.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeroProgresso, InsightIa, RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private questionService = inject(QuestionService);
  questions = signal<Question[]>([]);

  ngOnInit(): void {
    this.questionService.list().subscribe(data => {
      this.questions.set(data);
    });
  }
}
