import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        ButtonModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ],
    declarations: [AccessComponent]
})
export class AccessModule { }
