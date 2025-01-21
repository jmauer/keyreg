import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ]
})
export class AuthModule { }
