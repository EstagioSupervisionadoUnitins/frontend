import { Component } from '@angular/core';
import { HeroProgresso } from './components/hero-progresso/hero-progresso';
import { InsightIa } from './components/insight-ia/insight-ia';

@Component({
  selector: 'app-dashboard',
  imports: [HeroProgresso, InsightIa],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
}
