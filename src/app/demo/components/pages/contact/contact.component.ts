import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';
import { CourierClient } from '@trycourier/courier';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './contact.component.html',
    providers: [MessageService]
})
export class ContactComponent implements OnInit { 

    currentEmail: string 

    currentContext: string = ''

    selectedEmail: { name: string }

    courier = CourierClient({ authorizationToken: "pk_prod_TMN8ZJRTQJMX01MDX0R234JVWXFC" });

    email: string = ''

    emails = [
        { name: 'Technische Probleme' },
        { name: 'Fragen zum Produkt' },
        { name: 'Fragen zur Rechnung' },
        { name: 'Feedback' },
        { name: 'Sonstiges' }
    ]

    constructor(private languageService: LanguageService, private messageService: MessageService, private translate: TranslateService, private api: ApiService, private cookieService: CookieService) {
        
      this.email = this.cookieService.get('cooler_username')
      
      this.languageService.selectedLanguage$.subscribe((language) => {

        this.translate.use(language);
        });    
      }

      ngOnInit() {


      }

      setEmail(email: string) {
        this.currentEmail = email
      }

      sendEmail() {

    
        const payload = {
          Betreff: this.currentEmail,
          Inhalt: this.currentContext,
          From: this.email,
      };

      this.api.post('sendEmail', payload)
        .subscribe(
          (response: any) => {

            // Handle any additional logic after setting ID to object
            this.translate.get('toast').subscribe((translations: any) => {
              this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.mailSendS, life: 3000 });
            })
            this.currentContext = ""
            this.currentEmail = ""
          },
          (error) => {
            console.error('Error sendin Mail:', error);
            this.translate.get('toast').subscribe((translations: any) => {
              this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.mailSendF, life: 3000 });
            })
            this.currentContext = ""
            this.currentEmail = ""

          }
        );
    }
}
