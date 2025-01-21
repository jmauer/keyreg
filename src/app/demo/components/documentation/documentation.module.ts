import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    imports: [
        CommonModule,
        DocumentationRoutingModule,
        BreadcrumbModule
    ],
    declarations: [DocumentationComponent]
})
export class DocumentationModule { }
