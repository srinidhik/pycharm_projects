import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCompetitorPage } from './add-competitor.page';

const routes: Routes = [
  {
    path: '',
    component: AddCompetitorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCompetitorPage]
})
export class AddCompetitorPageModule {}
