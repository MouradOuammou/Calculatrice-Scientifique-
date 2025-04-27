import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private memory: number = 0;

  constructor() { }

  basicCalculate(firstOperand: number, secondOperand: number, operator: string): number {
    switch(operator) {
      case '+':
        return this.roundResult(firstOperand + secondOperand);
      case '-':
        return this.roundResult(firstOperand - secondOperand);
      case '*':
        return this.roundResult(firstOperand * secondOperand);
      case '/':
        if (secondOperand === 0) {
          return NaN; // Gérer la division par zéro
        }
        return this.roundResult(firstOperand / secondOperand);
      default:
        return secondOperand;
    }
  }

  scientificCalculate(value: number, func: string): number {
    switch(func) {
      case 'sqrt':
        if (value < 0) return NaN; // Erreur pour racine carrée de nombre négatif
        return this.roundResult(Math.sqrt(value));
      case 'sin':
        return this.roundResult(Math.sin(value));
      case 'cos':
        return this.roundResult(Math.cos(value));
      case 'tan':
        return this.roundResult(Math.tan(value));
      case 'log':
        if (value <= 0) return NaN; // Erreur pour logarithme de nombre négatif ou zéro
        return this.roundResult(Math.log10(value));
      case 'ln':
        if (value <= 0) return NaN; // Erreur pour logarithme naturel de nombre négatif ou zéro
        return this.roundResult(Math.log(value));
      case 'e^x':
        return this.roundResult(Math.exp(value));
      case '10^x':
        return this.roundResult(Math.pow(10, value));
      case 'x^2':
        return this.roundResult(Math.pow(value, 2));
      case 'x^3':
        return this.roundResult(Math.pow(value, 3));
      default:
        return value;
    }
  }

  memoryOperation(value: number, action: string): void {
    switch(action) {
      case 'add':
        this.memory += value;
        break;
      case 'subtract':
        this.memory -= value;
        break;
      case 'clear':
        this.memory = 0;
        break;
    }
  }

  getMemory(): number {
    return this.memory;
  }

  // Arrondir les résultats pour éviter les problèmes de calcul à virgule flottante
  private roundResult(value: number): number {
    // Si le nombre est très grand ou très petit, retourner la valeur scientifique
    if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-7 && value !== 0)) {
      return value;
    }

    // Sinon, arrondir à 12 décimales maximum pour éviter les erreurs de précision
    return Number(value.toFixed(12).replace(/\.?0+$/, ''));
  }

  // Évaluer une expression mathématique complexe
  evaluateExpression(expression: string): number {
    try {
      // Sécurité: cette fonction devrait être implémentée avec une bibliothèque
      // d'analyse mathématique sûre comme math.js pour éviter les injections

      // Pour l'instant, retourner une valeur factice
      return 0;
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return NaN;
    }
  }
}
