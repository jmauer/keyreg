import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrudComponent } from './crud.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CrudComponent },
		{ path: ':id', component: DetailsComponent }
	])],
	exports: [RouterModule]
})
export class CrudRoutingModule { }
