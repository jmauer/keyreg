import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { Table } from 'jspdf-autotable';
import { CalendarModule } from 'primeng/calendar';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        DropdownModule,
        FormsModule,
        HttpClientModule,
        ButtonModule,
        CalendarModule,
        InputTextModule,
        DialogModule,
        PasswordModule,
        ToastModule,
        TableModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule { }