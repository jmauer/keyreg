import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/demo/api/user';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
})

export class ProfileComponent implements OnInit {

  username = '';

  user: User = {};

  showPWDialog: boolean = false;

  newPassword: string = '';
  
  confirmPassword: string = '';


  constructor(private api: ApiService, private messageService: MessageService, private languageService: LanguageService, private translate: TranslateService, private cookieService: CookieService) {
    this.languageService.selectedLanguage$.subscribe((language) => {
      // this.selectedLanguage = { name: "Deutsch", code: language}
      // this.selectedLanguage = language;
      this.translate.use(language);
      // Aktualisiere Übersetzungen in dieser Komponente
    });

    this.username = this.cookieService.get('cooler_username')
  }

  ngOnInit() {
    this.api.get('getUser/' + this.username).subscribe(data => {
      this.user = data

  })
  }

  changePW() {
    
    this.showPWDialog = true
  }

  hideDialog() {
    this.showPWDialog = false
  }

  confirmPW() {

    const payload = {
      Username: this.username,
      Password: this.user.Password,
      NewPassword: this.confirmPassword
    }
    if(this.newPassword == this.confirmPassword) {
      this.api.post('changeUserPassword', payload).subscribe((response: any) => {

        // Handle any additional logic after updating examination date
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.pwChangeS, life: 3000 });
        })
      },
      (error) => {
        console.error('Error changing pw:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.pwChangeF, life: 3000 });
        })
      })
      this.hideDialog()
    }
  }

}
