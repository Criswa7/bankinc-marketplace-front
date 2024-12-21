import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardCreationComponent } from './components/card-creation/card-creation.component';
import { CardRechargeComponent } from './components/card-recharge/card-recharge.component';
import { CardListComponent } from './components/card-list/card-list.component';

@NgModule({
  declarations: [
    CardCreationComponent,
    CardRechargeComponent,
    CardListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CardCreationComponent,
    CardRechargeComponent,
    CardListComponent
  ]
})
export class CardModule { }