import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
})
export class AccessComponent { 

    constructor(private languageService: LanguageService, private translate: TranslateService) { 
        this.languageService.selectedLanguage$.subscribe((language) => {
            // this.selectedLanguage = { name: "Deutsch", code: language}
            // this.selectedLanguage = language;
            this.translate.use(language);
            // Aktualisiere Übersetzungen in dieser Komponente
          });
    }
}
