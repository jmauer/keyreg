import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from '../pages/crud/details/details.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        { path: ':id', component: DetailsComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
