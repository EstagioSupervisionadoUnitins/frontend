import { Component, input, output, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-painel-editor',
  imports: [FormsModule, MonacoEditorModule],
  templateUrl: './painel-editor.html',
  styleUrl: './painel-editor.css',
})
export class PainelEditor implements OnInit {
  codigo = model.required<string>();
  linguagem = input<string>('python');
  avaliando = input<boolean>(false);
  
  onEnviar = output<void>();

  editorOptions: any = {
    theme: 'vs', // Light theme as requested
    language: 'python',
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    roundedSelection: false,
    padding: { top: 16 }
  };

  ngOnInit(): void {
    this.editorOptions = {
        ...this.editorOptions,
        language: this.linguagem()
    };
  }

  submeter(): void {
    if (!this.avaliando()) {
      this.onEnviar.emit();
    }
  }
}
