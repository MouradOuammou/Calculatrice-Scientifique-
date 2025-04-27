import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController, AnimationController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CalculatorService } from '../../services/calculator.service';
// Assurez-vous que le chemin d'importation est correct
import { HistoryModalComponent } from '../history-modal/history-modal.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  display = '0';
  historyDisplay = '';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitForSecondNumber = false;
  isScientificMode = false;
  angle: 'DEG' | 'RAD' = 'DEG';
  memoryValue = 0;
  calculationHistory: { expression: string, result: string }[] = [];
  parenthesesOpen = 0;

  constructor(
    private calculatorService: CalculatorService,
    private modalController: ModalController,
    private toastController: ToastController,
    private animationController: AnimationController
  ) {}

  ngOnInit() {
    // Charger les derniers réglages depuis le stockage local
    this.loadSettings();
    // Charger l'historique des calculs
    this.loadHistory();
  }

  loadSettings() {
    const settings = localStorage.getItem('calculatorSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      this.isScientificMode = parsedSettings.isScientificMode || false;
      this.angle = parsedSettings.angle || 'DEG';
      this.memoryValue = parsedSettings.memoryValue || 0;
    }
  }

  saveSettings() {
    const settings = {
      isScientificMode: this.isScientificMode,
      angle: this.angle,
      memoryValue: this.memoryValue
    };
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
  }

  loadHistory() {
    const history = localStorage.getItem('calculationHistory');
    if (history) {
      this.calculationHistory = JSON.parse(history);
    }
  }

  saveHistory() {
    // Limiter l'historique à 50 entrées
    if (this.calculationHistory.length > 50) {
      this.calculationHistory = this.calculationHistory.slice(-50);
    }
    localStorage.setItem('calculationHistory', JSON.stringify(this.calculationHistory));
  }

  addToHistory(expression: string, result: string) {
    this.calculationHistory.push({ expression, result });
    this.saveHistory();
  }

  async openHistoryModal() {
    const modal = await this.modalController.create({
      component: HistoryModalComponent,
      componentProps: {
        history: this.calculationHistory
      },
      cssClass: 'history-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.expression) {
      this.display = data.result;
      this.historyDisplay = data.expression;
    }
  }

  toggleMode() {
    this.isScientificMode = !this.isScientificMode;
    this.saveSettings();
    this.presentToast(`Mode ${this.isScientificMode ? 'scientifique' : 'standard'} activé`);
  }

  toggleAngle() {
    this.angle = this.angle === 'DEG' ? 'RAD' : 'DEG';
    this.saveSettings();
    this.presentToast(`Angle en ${this.angle}`);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      cssClass: 'calculator-toast',
      color: 'tertiary'
    });
    await toast.present();
  }

  getDecimal() {
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  inputDigit(digit: string) {
    // Utiliser un index signature pour résoudre l'erreur
    const specialDigits: { [key: string]: string } = {
      'π': Math.PI.toString()
    };

    if (this.waitForSecondNumber) {
      this.display = specialDigits[digit] || digit;
      this.waitForSecondNumber = false;
    } else {
      this.display = this.display === '0'
        ? (specialDigits[digit] || digit)
        : this.display + (specialDigits[digit] || digit);
    }
  }

  clear() {
    this.display = '0';
    this.historyDisplay = '';
    this.firstOperand = null;
    this.operator = null;
    this.waitForSecondNumber = false;
    this.parenthesesOpen = 0;
  }

  backspace() {
    if (this.display.length > 1) {
      this.display = this.display.substring(0, this.display.length - 1);
    } else {
      this.display = '0';
    }
  }

  toggleSign() {
    const currentValue = parseFloat(this.display);
    if (currentValue !== 0) {
      this.display = (-currentValue).toString();
    }
  }

  percentage() {
    const value = parseFloat(this.display);

    if (this.firstOperand !== null && this.operator) {
      // Si nous sommes en train de calculer, applique le pourcentage au deuxième opérande
      const percentValue = (value / 100) * this.firstOperand;
      this.display = percentValue.toString();
    } else {
      // Sinon, simplement diviser par 100
      this.display = (value / 100).toString();
    }
  }

  openParentheses() {
    if (this.display === '0' || this.waitForSecondNumber) {
      this.display = '(';
      this.parenthesesOpen++;
    } else if (this.parenthesesOpen > 0) {
      this.display += ')';
      this.parenthesesOpen--;
    } else {
      this.display += '(';
      this.parenthesesOpen++;
    }
    this.waitForSecondNumber = false;
  }

  performOperation(op: string) {
    const input = parseFloat(this.display);

    if (this.firstOperand === null) {
      this.firstOperand = input;
      this.historyDisplay = `${this.display} ${op} `;
    } else if (this.operator) {
      const result = this.calculatorService.basicCalculate(
        this.firstOperand,
        input,
        this.operator
      );
      this.historyDisplay = `${result} ${op} `;
      this.display = result.toString();
      this.firstOperand = result;
    }

    this.operator = op;
    this.waitForSecondNumber = true;
  }

  calculate() {
    if (this.operator && this.firstOperand !== null) {
      const input = parseFloat(this.display);
      const fullExpression = `${this.historyDisplay}${this.display}`;

      const result = this.calculatorService.basicCalculate(
        this.firstOperand,
        input,
        this.operator
      );

      // Ajouter à l'historique
      this.addToHistory(fullExpression, result.toString());

      // Afficher le résultat et le calcul complet
      this.historyDisplay = fullExpression + ' =';
      this.display = result.toString();

      this.firstOperand = result;
      this.operator = null;
      this.waitForSecondNumber = false;
    }
  }

  scientificFunction(func: string) {
    const value = parseFloat(this.display);
    const originalDisplay = this.display;

    // Utiliser l'angle correct pour les fonctions trigonométriques
    let result: number;

    if (this.angle === 'DEG' && ['sin', 'cos', 'tan'].includes(func)) {
      // Convertir les degrés en radians pour les calculs
      const radians = (value * Math.PI) / 180;
      result = this.calculatorService.scientificCalculate(radians, func);
    } else {
      result = this.calculatorService.scientificCalculate(value, func);
    }

    // Afficher l'expression et le résultat
    this.historyDisplay = `${func}(${originalDisplay}) =`;
    this.display = result.toString();

    // Ajouter à l'historique
    this.addToHistory(`${func}(${originalDisplay})`, result.toString());
  }

  memoryAction(action: string) {
    const value = parseFloat(this.display);

    switch (action) {
      case 'clear':
        this.memoryValue = 0;
        break;
      case 'add':
        this.memoryValue += value;
        break;
      case 'subtract':
        this.memoryValue -= value;
        break;
    }

    this.saveSettings();
    this.presentToast(`Mémoire: ${this.memoryValue}`);
  }

  recallMemory() {
    this.display = this.memoryValue.toString();
  }
}
