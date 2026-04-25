import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficulty',
  standalone: true
})
export class DifficultyPipe implements PipeTransform {
  private readonly map: Record<string, string> = {
    'easy': 'Fácil',
    'medium': 'Médio',
    'hard': 'Difícil'
  };

  transform(value: string | undefined): string {
    if (!value) return '';
    return this.map[value.toLowerCase()] || value;
  }
}
