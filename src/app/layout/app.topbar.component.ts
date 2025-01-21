import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../demo/service/language.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;


    constructor(public layoutService: LayoutService, private router: Router,
        private cookieService: CookieService,
        private languageService: LanguageService) { }

    logout() {
          this.cookieService.delete('cooler_cookie_name');
          this.cookieService.delete('cooler_username');
          this.cookieService.delete('coole_rolle');

        this.router.navigate(['/auth/login']);
    }
    
    email(arg0: string, email: any) {
        throw new Error('Method not implemented.');
    }
}
