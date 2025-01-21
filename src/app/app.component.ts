import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LanguageService } from './demo/service/language.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [LanguageService]
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private languageService: LanguageService, private translate: TranslateService) { }

    
    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
