import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ItemService } from '../../service/item.service';
import { Item } from '../../api/item';
import { ApiService } from '../../service/api.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { borrowedKeyItem } from '../../api/borrowedKeyItem';
import { Key } from '@fullcalendar/core/preact';
import { User } from '../../api/user';
import { Keychain } from 'src/app/demo/api/keychain';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {

    itemds!: MenuItem[];

    items: Key[] = [];

    outdatedItems: borrowedKeyItem[] = [];
    soonExpiredItems: Keychain[] = [];
    pieData: any;

    pieOptions: any;

    subscription!: Subscription;
    month: string = "";
    objects = 0;

    neededObjects = 0;

    allUsers: User[]

    outdatedObjects = 0;

    users: Number = 0;

    headerData: any;

    username = '';

    fullname = ''

    email = ''

    showDsgvo: boolean = false;

    checkedItems: Key[] = [];

    emptyKeys: boolean;

    missedKeys: boolean;

    missedItems: any[] = []

    missedKeychains: boolean;

    missedKeychainItems: any[] = []

    borrowedKeychains: any[] = []

    emptyKeychain = true

    constructor(private itemService: ItemService, private router: Router, public layoutService: LayoutService, private api: ApiService, private languageService: LanguageService, private translate: TranslateService, private cookieService: CookieService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });

        this.languageService.selectedLanguage$.subscribe((language) => {
            // this.selectedLanguage = { name: "Deutsch", code: language}
            // this.selectedLanguage = language;
            this.translate.use(language);
            // Aktualisiere Übersetzungen in dieser Komponente
          });

          this.username = this.cookieService.get('cooler_username')
    }

    ngOnInit() {

        this.checkDsgvo()

        this.getAllKeys()

        this.getAllExpiredObjects()

        

        this.api.get('getAllUsers').subscribe(data => {
            this.allUsers = data;
            this.users = data.length
        })

        this.api.get('getUser/' + this.username).subscribe(data => {
            this.email = data.EMail
            this.fullname = data.FirstName + " " + data.LastName
        })
        
        
    }

    getAllMissingKeys() {
        this.api.get('getAllExpiredObjects')
        .subscribe((payload: any) => {
            this.missedItems = this.items.filter(item => payload.includes(item.ID));
            this.missedKeychainItems = this.soonExpiredItems.filter(item => payload.includes(item.ID))

            if (this.missedItems.length != 0) {
                this.missedKeys = true
            } else {
                this.missedKeys = false
            }

            if (this.missedKeychainItems.length != 0) {
                this.missedKeychains = true
            } else {
                this.missedKeychains = false
            }
        })
    }

    getAllKeys() {
        this.api.get('getAllObjects')
        .subscribe((payload: any) => {
            this.items = payload;
            this.objects = payload.length;
            
            this.getAllBorrowedKeys()

            
        })
    }

    getAllExpiredObjects() {
        this.api.get('getAllExpiredObjects').subscribe((payload: any) => {


            this.neededObjects = payload.length

            this.initChart()
        })
    }

    getAllBorrowedKeys() {
        this.api.get('getAllBorrowedKeys')
        .subscribe((payload: any) => {
            this.outdatedItems = payload
            this.outdatedObjects = payload.length;
            this.checkedItems = this.filterBorrowedKeys(this.items, this.outdatedItems, this.allUsers)

            if (this.checkedItems.length != 0) {
                this.emptyKeys = false
            }

            this.api.get('getKeychains')
        .subscribe((payload: any) => {

            this.soonExpiredItems = payload;


            this.borrowedKeychains = this.filterBorrowedKeychains(this.soonExpiredItems, this.outdatedItems,this.allUsers)

            if (this.borrowedKeychains.length != 0) {
                this.emptyKeychain = false
            }
        })

        this.getAllMissingKeys()
        })
    }

    filterBorrowedKeys(allKeys: Key[], borrowedKeys: borrowedKeyItem[], allUsers: User[]): Key[] {

        const filteredKeys = allKeys.filter(key => this.isKeyBorrowed(key, borrowedKeys));
        filteredKeys.forEach(filteredKey => {
            const borrowedKey = borrowedKeys.find(borrowedKey => borrowedKey.Object_ID === filteredKey.ID);
            if (borrowedKey) {
                filteredKey.Timestamp = borrowedKey.LoanDate;
            }

            const user = allUsers.find(user => user.ID === borrowedKey.User_ID);
            if (user) {
                filteredKey.User = `${user.FirstName} ${user.LastName}`;
            }
        });
        return filteredKeys;
    }

    filterBorrowedKeychains(allKeychains: Keychain[], borrowedKeys: borrowedKeyItem[], allUsers: User[]): any[] {


        this.initChart()

        const filteredKeys = allKeychains.filter(key => this.isKeychainBorrowed(key, borrowedKeys));

        filteredKeys.forEach(filteredKeychain => {
            const borrowedKey = borrowedKeys.find(borrowedKey => borrowedKey.Keychain_ID === filteredKeychain.ID);
            const user = allUsers.find(user => user.ID === borrowedKey.User_ID);
            if (user) {
                filteredKeychain.User = `${user.FirstName} ${user.LastName}`;
            }
        })
        return filteredKeys;
    }

    isKeychainBorrowed(key: Key, borrowedKeys: borrowedKeyItem[]): boolean {
        return borrowedKeys.some(borrowedKey => borrowedKey.Keychain_ID === key.ID);
    }

    isKeyBorrowed(key: Key, borrowedKeys: borrowedKeyItem[]): boolean {
        return borrowedKeys.some(borrowedKey => borrowedKey.Object_ID === key.ID);
    }

    checkDsgvo() {

        this.api.get("getOwnDsgvoStatus").subscribe(response => {


            if (response.DSGVO_Accepted == 1) {

            } else {
                this.showDsgvo = true;

            }
        })

    }

    downloadFile(name: string) {

        const pdfPath = 'assets/demo/data/' + name; // Pfad zum vorhandenen PDF
        const a = document.createElement('a');
        a.href = pdfPath;
        a.download = name; // Der Dateiname, den der Benutzer beim Speichern auswählen kann
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }  

    dsgvoRead() {

        this.api.setDsgvo(this.email);
        this.showDsgvo = false;
    }

    dsgvoNotRead() {

            this.cookieService.delete('cooler_cookie_name');
            this.cookieService.delete('cooler_username');
            this.cookieService.delete('coole_rolle');
  
          this.router.navigate(['/landing']);
      
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.languageService.selectedLanguage$.subscribe((language) => {
            this.translate.get('dashboard').subscribe((translations: any) => {
                this.pieData = {

                    labels: [translations.inTotalDesc, translations.examinatedDesc, translations.neededDesc],
                    datasets: [
                        {
                            
                            data: [this.objects, this.outdatedObjects, this.neededObjects],
                            backgroundColor: [
                                documentStyle.getPropertyValue('--green-500'),
                                documentStyle.getPropertyValue('--indigo-500'),
                                documentStyle.getPropertyValue('--purple-500')
                            ],
                            hoverBackgroundColor: [
                                documentStyle.getPropertyValue('--green-400'),
                                documentStyle.getPropertyValue('--indigo-400'),
                                documentStyle.getPropertyValue('--purple-400')
                            ]
                        }]
                };
            })
        })
        
        

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // getMonthExpression() {
    //     this.translate.get('controll').subscribe((translations: any) => {
    //         if (this.checkedItems == "1") {
    //             this.month = translations.month
    //         } else {
    //             this.month = translations.months
    //         }
    //     })
        
    // }
}
