import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../../domain/auth/service/auth.service';
import { ClassroomService } from '../../domain/classroom/services/classroom.service';

export const classroomGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const classroomService = inject(ClassroomService);
  const router = inject(Router);

  // Se não for estudante, permite passar (professor não tem obrigatoriedade de uma única turma ativa via guard global)
  if (!authService.hasRole('student')) {
    return true;
  }

  // Se já carregou e tem turma ativa, permite
  if (classroomService.loaded() && classroomService.activeClassroom()) {
    return true;
  }

  // Se já carregou e NÃO tem turma, redireciona para onboarding
  if (classroomService.loaded() && !classroomService.activeClassroom()) {
    router.navigate(['/onboarding']);
    return false;
  }

  // Ainda não carregou — busca da API
  return classroomService.loadActiveClassroom().pipe(
    map(classroom => {
      if (classroom) {
        return true;
      }
      
      router.navigate(['/onboarding']);
      return false;
    })
  );
};
