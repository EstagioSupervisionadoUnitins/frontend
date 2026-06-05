import { Component, input } from '@angular/core';

@Component({
  selector: 'app-trilha-header',
  imports: [],
  templateUrl: './trilha-header.html',
  styleUrl: './trilha-header.css',
})
export class TrilhaHeader {
  titulo = input.required<string>();
  descricao = input.required<string>();
  progresso = input.required<number>();
}
