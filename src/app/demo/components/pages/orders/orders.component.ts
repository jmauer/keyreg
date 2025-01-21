import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './orders.component.html'
})
export class OrdersComponent { 

    items: MenuItem[] | undefined;

    firstname: string = ''

    lastname: string = ''

    email: string = ''

    submitted: boolean = false;

    constructor(private languageService: LanguageService, private translate: TranslateService, private api: ApiService, private cookieService: CookieService, private router: Router) {
        this.languageService.selectedLanguage$.subscribe((language) => {

        this.translate.use(language);
        });    

        this.email = this.cookieService.get('cooler_username')
      }

      ngOnInit() {

        this.api.get('getUser/' + this.email).subscribe(data => {
            this.firstname = data.FirstName
            this.lastname = data.LastName
        })

        this.items = [
            {
                label: 'Personal',
                routerLink: 'personal'
            },
            {
                label: 'Tags',
                routerLink: 'tags'
            },
            {
                label: 'Confirmation',
                routerLink: 'confirmation'
            }
        ];

      }

      nextPage() {
        if (this.firstname && this.lastname && this.email) {
            
            this.router.navigate(['steps/seat']);

            return;
        }

        this.submitted = true;
      }
}
