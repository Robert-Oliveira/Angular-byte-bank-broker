import { merge } from 'rxjs';
import { AcoesService } from './acoes.service';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  tap,
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  // função que faz a requisição de todos os dados
  // o $ é uma forma de escrever o observable
  todaAcoes$ = this.acoesService.getAcoes().pipe(
    tap(() => {
      console.log('fluxo inicial');
    })
  );
  // função para fazer requisições conforme input do usuario
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO), // tempo de espera para fazer a requisição, evita fazer varias requisições desnecessarias
    tap(() => {
      console.log('fluxo do filtro');
    }),
    tap(console.log),
    filter(
      (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length // para otimizar a pesquisa foi adicionado uma condicional minima de 3 caracteres
    ),
    distinctUntilChanged(), // compara o valor digitado antigo com o novo, se for igual ele não faz outra requisição
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)) // manipula os fluxos de informação realizando a troca da digitação pela requisição do servidor
  );

  acoes$ = merge(this.todaAcoes$, this.filtroPeloInput$); // o merge junta 2 funções

  constructor(private acoesService: AcoesService) {}
}
