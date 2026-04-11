import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
@Component({
  selector: 'app-editor-codigo',
  imports: [MonacoEditorModule, CommonModule, FormsModule],
  templateUrl: './editor-codigo.html',
  styleUrl: './editor-codigo.css',
})
export class EditorCodigo {

  // configuracao para componente monaco-editor
  editorOptions = {
    theme: 'vs-dark', // ou 'vs' para tema claro
    language: 'python',
    minimap: { enabled: false },
    fontSize: 14
  };

  //codigo inicial para o usuario
  codigoUsuario = "def soma(a, b):\n    # escreva seu código aqui\n    pass";


}
