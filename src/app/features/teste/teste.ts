import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EditorCodigo } from "../editor-codigo/editor-codigo";

@Component({
  selector: 'app-teste',
  imports: [ButtonModule, EditorCodigo],
  templateUrl: './teste.html',
  styleUrl: './teste.css',
})
export class Teste {

}
