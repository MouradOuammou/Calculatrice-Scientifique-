import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-history-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Historique des calculs</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismissModal()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let item of history.slice().reverse()">
          <ion-item (click)="useCalculation(item)" button>
            <ion-label>
              <h2>{{ item.expression }}</h2>
              <p>{{ item.result }}</p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteItem(item)">
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-item *ngIf="history.length === 0">
          <ion-label class="ion-text-center">
            Aucun calcul dans l'historique
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" *ngIf="history.length > 0">
        <ion-fab-button color="danger" (click)="clearHistory()">
          <ion-icon name="trash-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    ion-item h2 {
      font-size: 1.1em;
      color: var(--ion-color-dark);
    }
    ion-item p {
      font-size: 1.3em;
      font-weight: 500;
      color: var(--ion-color-primary);
    }
    ion-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
    }
  `]
})
export class HistoryModalComponent {
  @Input() history: { expression: string, result: string }[] = [];

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  useCalculation(item: { expression: string, result: string }) {
    this.modalController.dismiss(item);
  }

  deleteItem(item: { expression: string, result: string }) {
    const index = this.history.findIndex(h =>
      h.expression === item.expression && h.result === item.result);

    if (index > -1) {
      this.history.splice(index, 1);
      localStorage.setItem('calculationHistory', JSON.stringify(this.history));
    }
  }

  clearHistory() {
    this.history = [];
    localStorage.setItem('calculationHistory', JSON.stringify(this.history));
  }
}
