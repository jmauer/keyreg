import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ItemService } from './demo/service/item.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            }
        })
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        ItemService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
