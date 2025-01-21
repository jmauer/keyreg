import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../demo/service/language.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    labelAdministration: string

    selectedLanguage: string;

    constructor(public layoutService: LayoutService, private translate: TranslateService, private languageService: LanguageService) {
        this.languageService.selectedLanguage$.subscribe((language) => {
            this.selectedLanguage = language;
            this.translate.use(language);
            // Aktualisiere Übersetzungen in dieser Komponente
          });
     }

    ngOnInit() {
        this.languageService.selectedLanguage$.subscribe((language) => {
            this.translate.get('menu').subscribe((translations: any) => {
            this.model = [
                {
                items: [
                    { label: translations.dashboard, icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
                },
                {
                label: translations.administration,
                items: [
                    
                    { label: translations.key, icon: 'pi pi-fw pi-key', routerLink: ['/pages/crud'] },
                    { label: translations.keychain, icon: 'pi pi-fw pi-tags', routerLink: ['/pages/keychain'] },
                    { label: translations.users, icon: 'pi pi-fw pi-users', routerLink: ['/pages/users'] },
                    
                ]
                },
                    {
                        label: translations.products,
                        items: [
                            { label: translations.controlls, icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/pages/checks'] }
                        ]
                    },
                    {
                        label: translations.service,
                        items: [
                            // { label: translations.support, icon: 'pi pi-fw pi-question-circle', routerLink: ['/documentation'] },
                            { label: translations.downloads, icon: 'pi pi-fw pi-cloud-download', routerLink: ['/pages/downloads'] },
                            // { label: translations.orders, icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/orders'] },
                            { label: translations.contact, icon: 'pi pi-fw pi-at', routerLink: ['/pages/contact'] }
                        ]
                    },
                


                ];
            });
        });
}
}
