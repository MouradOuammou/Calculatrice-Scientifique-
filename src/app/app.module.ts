import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    CalculatorComponent,
    AppRoutingModule,
    HistoryModalComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
