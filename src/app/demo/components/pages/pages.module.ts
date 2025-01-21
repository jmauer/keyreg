import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
  
@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        HttpClientModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ]
})
export class PagesModule { }
