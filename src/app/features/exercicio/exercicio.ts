import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../domain/question/services/question.service';
import { Question } from '../../domain/question/models/question.interface';
import { PainelInstrucao } from './components/painel-instrucao/painel-instrucao';
import { PainelEditor } from './components/painel-editor/painel-editor';
import { SubmissionService } from '../../domain/submission/services/submission.service';
import { Submission } from '../../domain/submission/models/submission.interface';
import { ToastService } from '../../shared/services/toast.service';
import { TrilhaService } from '../../domain/trilha/services/trilha.service';

@Component({
  selector: 'app-exercicio',
  imports: [PainelInstrucao, PainelEditor],
  templateUrl: './exercicio.html',
  styleUrl: './exercicio.css',
})
export class Exercicio implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private questionService = inject(QuestionService);
  private submissionService = inject(SubmissionService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private trilhaService = inject(TrilhaService);

  question = signal<Question | null>(null);
  playlistId = signal<number | null>(null);
  avaliando = signal(false);
  feedback = signal<Submission | null>(null);
  proximaQuestaoId = signal<number | null>(null);
  
  codigoSelecionado = '# Escreva sua solução aqui em Python\n\ndef solution():\n    pass';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log('[Exercicio] Carregando ID:', id);
      
      // Reseta estados para a nova questão
      this.question.set(null);
      this.playlistId.set(null);
      this.feedback.set(null);
      this.avaliando.set(false);
      this.proximaQuestaoId.set(null);
      this.codigoSelecionado = '# Escreva sua solução aqui em Python\n\ndef solution():\n    pass';
      
      if (id) {
        this.questionService.getById(id).subscribe({
          next: (q) => {
            console.log('[Exercicio] Questão carregada:', q.title);
            this.question.set(q);
            this.carregarProximaQuestao(q);
            this.validarAcessoQuestao(q);
          },
          error: (err) => {
            console.error('[Exercicio] Erro ao carregar questão:', err);
            this.toastService.showError('Erro', 'Não foi possível carregar os detalhes do exercício.');
          }
        });
      } else {
        console.warn('[Exercicio] ID inválido na rota:', params.get('id'));
      }
    });
  }

  carregarProximaQuestao(q: Question): void {
    const playlistIdStr = this.route.snapshot.queryParamMap.get('playlist_id');
    const playlistId = playlistIdStr ? Number(playlistIdStr) : null;
    
    if (playlistId) {
      this.playlistId.set(playlistId);
      // Método robusto: busca diretamente a trilha específica passada por query param
      this.trilhaService.getById(playlistId).subscribe({
        next: (playlist) => {
          const questions = playlist.questions || [];
          const indexAtual = questions.findIndex(quest => quest.id === q.id);
          
          let proximaId: number | null = null;
          if (indexAtual !== -1 && indexAtual < questions.length - 1) {
            proximaId = questions[indexAtual + 1].id;
          }
          
          console.log('[Exercicio] Próxima questão ID calculada na playlist ' + playlistId + ':', proximaId);
          this.proximaQuestaoId.set(proximaId);
        },
        error: (err) => {
          console.error('[Exercicio] Erro ao carregar playlist específica:', err);
          this.carregarProximaQuestaoFallback(q);
        }
      });
    } else {
      this.carregarProximaQuestaoFallback(q);
    }
  }

  private carregarProximaQuestaoFallback(q: Question): void {
    if (!q.classroom_id) {
      this.proximaQuestaoId.set(null);
      return;
    }
    
    this.trilhaService.list(q.classroom_id).subscribe({
      next: (playlists) => {
        let proximaId: number | null = null;
        
        // Encontra a primeira playlist que contém a questão atual
        const playlistDestaQuestao = playlists.find(playlist => 
          playlist.questions?.some(quest => quest.id === q.id)
        );
        
        if (playlistDestaQuestao && playlistDestaQuestao.questions) {
          this.playlistId.set(playlistDestaQuestao.id);
          const questions = playlistDestaQuestao.questions;
          const indexAtual = questions.findIndex(quest => quest.id === q.id);
          
          if (indexAtual !== -1 && indexAtual < questions.length - 1) {
            proximaId = questions[indexAtual + 1].id;
          }
          console.log('[Exercicio] Próxima questão ID calculada via Fallback (Playlist ' + playlistDestaQuestao.id + '):', proximaId);
        } else {
          console.log('[Exercicio] Questão atual não encontrada em nenhuma playlist.');
        }
        
        this.proximaQuestaoId.set(proximaId);
      },
      error: (err) => {
        console.error('[Exercicio] Erro no fallback de playlists:', err);
        this.proximaQuestaoId.set(null);
      }
    });
  }

  validarAcessoQuestao(q: Question): void {
    if (!q.classroom_id) return;

    this.trilhaService.list(q.classroom_id).subscribe({
      next: (playlists) => {
        const targetPlaylistId = this.playlistId() || playlists.find(p => p.questions?.some(quest => quest.id === q.id))?.id;

        if (targetPlaylistId) {
          const currentPlaylistIndex = playlists.findIndex(p => p.id === targetPlaylistId);

          if (currentPlaylistIndex !== -1) {
            let isBlocked = false;
            
            // Verifica se todas as playlists anteriores estão concluídas
            for (let i = 0; i < currentPlaylistIndex; i++) {
              const playlistAnterior = playlists[i];
              const todasRespondidas = playlistAnterior.questions?.every(quest => quest.answered) ?? false;

              if (!todasRespondidas) {
                isBlocked = true;
                break;
              }
            }

            if (isBlocked) {
              this.toastService.showError('Bloqueado', 'Você precisa concluir as trilhas anteriores para liberar este exercício!');
              this.router.navigate(['/aluno/trilhas']);
            }
          }
        }
      },
      error: (err) => {
        console.error('[Exercicio] Erro ao validar progressão:', err);
      }
    });
  }

  submitCodigo(): void {
    const questionVal = this.question();
    if (!questionVal) return;

    const pId = this.playlistId();
    if (!pId) {
      this.toastService.showError('Erro ao enviar', 'Não foi possível associar este exercício a uma trilha.');
      return;
    }

    this.avaliando.set(true);
    this.feedback.set(null); // Limpa o feedback anterior

    const req = {
      question_id: questionVal.id,
      code: this.codigoSelecionado,
      playlist_id: pId
    };

    this.submissionService.submit(req).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (sub) => {
        // Agora inicia o polling com o ID retornado
        this.pollSubmission(sub.id);
      },
      error: (err) => {
        this.avaliando.set(false);
        this.toastService.showError('Erro ao enviar solução', 'Ocorreu um erro de rede. Tente novamente.');
        console.error('Erro no envio da submissão:', err);
      }
    });
  }

  private pollSubmission(id: number): void {
    this.submissionService.pollResult(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (finalSubmission) => {
        this.avaliando.set(false);
        this.feedback.set(finalSubmission);
        
        if (finalSubmission.status === 'completed') {
          if (finalSubmission.is_correct) {
            this.toastService.showSuccess('Parabéns!', 'Sua solução está correta!');
          } else {
            this.toastService.showWarn('Ajustes necessários', 'Sua solução precisa ser revista, veja as orientações.');
          }
        } else if (finalSubmission.status === 'error') {
          this.toastService.showError('Erro na avaliação', 'Houve um problema ao processar seu código.');
        }
      },
      error: (err) => {
        this.avaliando.set(false);
        this.toastService.showError('Erro ao avaliar', 'Ocorreu um erro no processamento da AI.');
        console.error('Erro no polling:', err);
      }
    });
  }
}
