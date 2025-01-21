import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/demo/service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {

  email: string;
  password: string;
  responseData: string;
  rememberMe: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: ApiService,
    private cookieService: CookieService,
    private languageService: LanguageService, 
    private translate: TranslateService,
    private messageService: MessageService
  ) { 
    this.languageService.selectedLanguage$.subscribe((language) => {
      this.translate.use(language);
    });
  }

  login() {
    this.api.post('authentication', {

      EMail: this.email,
      Password: this.password,
      Web: true
    })
      .subscribe((payload: any) => {

        //if (response.error) this.responseMessage = response.msg;

        sessionStorage.setItem('cooler_cookie_name', payload.api_key);
        sessionStorage.setItem('coole_rolle', payload.role)
        sessionStorage.setItem('cooler_username', this.email)
        // sessionStorage.setItem('cooler_cookie_name', this.username);
        this.api.setUsername(this.email)
        this.api.setApiKey(payload.api_key)
        if (this.rememberMe)
          this.cookieService.set('cooler_cookie_name', payload.api_key);
          this.cookieService.set('cooler_username', this.email);
          this.cookieService.set('coole_rolle', payload.role)
        this.router.navigate(['/']);
        // this.responseData = response; // gibt wohl eine Service Klasse mit der man die Variable global erreichbar macht...
        // this.dataService.setResponseData(response);  //da es ja keine Print Statements gibt, hab ich keine Ahnung ob das funkt
        //this.loading = false;
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.loginS, life: 3000 });
        })
        
      },
      (error) => {
        console.error('Error logging in:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.loginF, life: 3000 });
        })
      });
  }
}
