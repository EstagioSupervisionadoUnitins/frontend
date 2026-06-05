import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-editor-codigo',
  imports: [MonacoEditorModule, CommonModule, FormsModule],
  templateUrl: './editor-codigo.html',
  styleUrl: './editor-codigo.css',
})
export class EditorCodigo {
  private toastService = inject(ToastService);

  // configuracao para componente monaco-editor
  editorOptions = {
    theme: 'vs-dark', // ou 'vs' para tema claro
    language: 'python',
    minimap: { enabled: false },
    fontSize: 14,
    contextmenu: false // Desabilita o clique direito para copiar/colar nativo do editor
  };

  //codigo inicial para o usuario
  codigoUsuario = "def soma(a, b):\n    # escreva seu código aqui\n    pass";

  private mensagensColar = [
    'Detectamos preguiça extrema! Escreva seu próprio código. 🤨💻',
    'Burlar o exercício? Seus professores foram notificados! (Brincadeira... ou não) 🕵️‍♂️🏫',
    'Nenhum StackOverflow foi ferido, mas você acaba de falhar ao tentar colar! ❌🚫',
    'Erro 403: Copiar e colar é proibido neste recinto de aprendizado! 🚫🧠',
    'Tentar colar é feio! Que tal exercitar esses dedos e digitar? 🎹💨',
    'Um desenvolvedor de verdade digita o código. Vamos lá, digite! 👨‍💻🚀'
  ];

  private mensagensCopiar = [
    'Querendo passar cola para os amiguinhos? Sem chance! 🤫🤐',
    'Copiar o código? O que você vai fazer com isso? Escreva e pratique! 🙅‍♂️',
    'Você não pode copiar este código sagrado! Guarde em sua mente, não no Ctrl+C. 🧙‍♂️✨',
    'Tentar copiar para guardar na gaveta? Não faça isso, digite e aprenda! 📚'
  ];

  onEditorInit(editor: any) {
    // 1. Bloquear atalhos de teclado (Ctrl+C, Ctrl+V, Ctrl+X e versões Cmd no Mac)
    editor.onKeyDown((event: any) => {
      const { ctrlKey, metaKey, code } = event;
      
      if (ctrlKey || metaKey) {
        if (code === 'KeyV') {
          event.preventDefault();
          event.stopPropagation();
          this.mostrarMensagemAleatoria(this.mensagensColar);
        } else if (code === 'KeyC' || code === 'KeyX') {
          event.preventDefault();
          event.stopPropagation();
          this.mostrarMensagemAleatoria(this.mensagensCopiar);
        }
      }
    });

    // 2. Bloquear eventos nativos de clipboard no DOM (garante cobertura para cliques, arrastar, etc.)
    const domNode = editor.getDomNode();
    if (domNode) {
      const blockClipboard = (e: ClipboardEvent, mensagens: string[]) => {
        e.preventDefault();
        e.stopPropagation();
        this.mostrarMensagemAleatoria(mensagens);
      };

      domNode.addEventListener('copy', (e: ClipboardEvent) => blockClipboard(e, this.mensagensCopiar), true);
      domNode.addEventListener('paste', (e: ClipboardEvent) => blockClipboard(e, this.mensagensColar), true);
      domNode.addEventListener('cut', (e: ClipboardEvent) => blockClipboard(e, this.mensagensCopiar), true);
    }
  }

  private mostrarMensagemAleatoria(lista: string[]) {
    const indice = Math.floor(Math.random() * lista.length);
    const mensagem = lista[indice];
    this.toastService.showWarn('Tentativa de Fraude!', mensagem);
  }
}

