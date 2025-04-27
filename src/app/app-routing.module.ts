import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CalculatorComponent } from './components/calculator/calculator.component';

const routes: Routes = [
  {
    path: '',  // Route par défaut
    component: CalculatorComponent  // La page calculatrice est directement affichée
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
