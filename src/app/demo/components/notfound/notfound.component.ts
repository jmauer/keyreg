import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../service/language.service';


@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
})
export class NotfoundComponent { 
    currentUrl: string;

    constructor(private router: Router,private languageService: LanguageService, private translate: TranslateService) {
      this.currentUrl = this.router.url;

      this.languageService.selectedLanguage$.subscribe((language) => {
        // this.selectedLanguage = { name: "Deutsch", code: language}
        // this.selectedLanguage = language;
        this.translate.use(language);
        // Aktualisiere Übersetzungen in dieser Komponente
      });
      
    }
}