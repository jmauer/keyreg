import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { DetailsRoutingModule } from './details-routing.module';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { createTranslateLoader } from '../keychain.module';
import { ListboxModule } from 'primeng/listbox';
import { PickListModule } from 'primeng/picklist';


@NgModule({
    imports: [
        CommonModule,
        DetailsRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        CalendarModule,
        PasswordModule,
        BreadcrumbModule,
        HttpClientModule,
        MultiSelectModule,
        ListboxModule,
        PickListModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ],
    declarations: [DetailsComponent]
})
export class DetailsModule { }