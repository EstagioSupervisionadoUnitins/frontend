import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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

  // Se for estudante e tiver turma ativa, permite
  if (classroomService.activeClassroom()) {
    return true;
  }

  // Se não tiver turma ativa, redireciona para onboarding
  router.navigate(['/onboarding']);
  return false;
};
