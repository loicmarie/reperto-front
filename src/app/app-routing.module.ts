import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent }      from './demo/demo.component';
import { VariantManagerComponent }      from './variant-manager/variant-manager.component';
import { TrainingComponent }      from './training/training.component';
import { RepertoireManagerComponent }      from './repertoire-manager/repertoire-manager.component';
import {
  AuthGuardService as AuthGuard
} from './auth-guard.service';

const routes: Routes = [
  { path: '', component: DemoComponent },
  {
    path: 'variants',
    component: VariantManagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'training',
    component: TrainingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'repertoires',
    component: RepertoireManagerComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
