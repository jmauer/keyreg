import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LanguageService {
  private selectedLanguage = new BehaviorSubject<string>('de');
  selectedLanguage$ = this.selectedLanguage.asObservable();

  constructor(private translate: TranslateService, private cookieService: CookieService) {
    const savedLanguage = this.cookieService.get('selectedLanguage');
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  getLanguage(): string {
    return this.selectedLanguage.value;
  }

  setLanguage(language: string) {
    this.selectedLanguage.next(language);
    this.translate.use(language);

    this.cookieService.set('selectedLanguage', language);
  }
}
