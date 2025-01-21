import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadsRoutingModule } from './downloads-routing.module';
import { DownloadsComponent } from './downloads.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        DownloadsRoutingModule,
        TableModule,
        FormsModule,
        HttpClientModule,
        ButtonModule,
        InputTextareaModule,
        VirtualScrollerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ],
    declarations: [DownloadsComponent]
})
export class DownloadsModule { }
