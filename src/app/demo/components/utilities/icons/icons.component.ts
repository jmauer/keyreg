import { Component, OnInit, ViewChild } from '@angular/core';
import { Key } from '@fullcalendar/core/preact';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { borrowedKeyItem } from 'src/app/demo/api/borrowedKeyItem';
import { Item } from 'src/app/demo/api/item';
import { Keychain } from 'src/app/demo/api/keychain';
import { User } from 'src/app/demo/api/user';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';

@Component({
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
    providers: [MessageService]
})
export class IconsComponent implements OnInit {

    @ViewChild('dt') mytable: Table;

    @ViewChild('dd') keychaintable: Table;

    icons: any[] = [];

    filteredIcons: any[] = [];

    items: borrowedKeyItem[] = [];

    allKeys: Key[] = [];

    soonExpiredItems: Keychain[] = [];

    checkedItems: Key[] = [];

    borrowedKeychains: any[] = []

    item: Key = {};

    keychain: Keychain = {}

    cols: any[] = [];

    users: User[] = [];

    selectUser: any[] = [];
    
    selectedPerson: User;

    itemID: string = "";

    checkIntervall: string = "6";

    month: string = "";

    updateDateDialog: boolean = false

    updateDateKeychainDialog: boolean = false

    returnKeyDialog: boolean = false

    returnKeychainDialog: boolean = false

    uvvLeiter: string = ""

    emptyKeys = true

    emptyKeychain = true

    globalFilterFields: string[]; 

    globalKeychainFilterFields: string[]; 

    constructor(private messageService: MessageService, private api: ApiService, private translate: TranslateService, private languageService: LanguageService) { 
        this.languageService.selectedLanguage$.subscribe((language) => {
            // this.selectedLanguage = { name: "Deutsch", code: language}
            // this.selectedLanguage = language;
            this.translate.use(language);
        });

        this.api.get('getUvvLeiter').subscribe((payload: any) => {
            this.uvvLeiter = payload.uvvLeiter
        })
    }

    ngOnInit() {

        this.getAllKeys()

        this.api.get('getAllUsers')
        .subscribe((payload: any) => {

            this.users = payload;

      
              for (let i = 0; i < payload.length; i++) {
                this.selectUser.push({ label: payload[i].FirstName + " " + payload[i].LastName, value: payload[i].FirstName + " " + payload[i].LastName });
              }
            
        })

        

    this.cols = [
      //{ field: 'ID', header: 'ID' },
      { field: 'ExaminationDate', header: 'Ablaufdatum' },
      { field: 'LastCheckedDate', header: 'Zuletzt Überprüft' },
      { field: 'Category', header: 'Beschreibung' },
      { field: 'Description', header: 'Kategorie' },
      { field: 'GroupName', header: 'Gruppen' },
      
      // You can use this.headerData to access the header data here
    ];

    this.globalFilterFields = ['ID', 'Batch', 'Number', 'City', 'Street', 'HouseNumber', 'Name', 'LoanPeriod', 'Timestamp', 'FirstName', 'LastName'];

    this.globalKeychainFilterFields = ['ID', 'Name', 'LoanPeriod', 'Timestamp', 'FirstName', 'LastName'];

        this.getMonthExpression()
    }

    openDateDialog(item: Key) {
        this.itemID = String(item.ID ?? "")
        this.updateDateDialog = true;
        
    }

    openDateKeychainDialog(item: Key) {
        this.itemID = String(item.ID)
        this.updateDateKeychainDialog = true;
        
    }

    replaceQuotesWithNothin(category: string): string {
        // Führe die Ersetzung der doppelten Anführungszeichen durch
        return category.replace('"', '');
      }

    controllID() {
        this.updateDateDialog = false;
        const payload = {
            KeyID: this.itemID,
            UserID: this.selectedPerson.ID,
          };
        this.api.post('giveKeyToUserAdmin', payload).subscribe((response: any) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.controllS, life: 3000 });
              })
            this.itemID = ''
            this.loadItems();
        }, (error) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.controllF, life: 3000 });
              })
              this.itemID = ''
            this.loadItems();
    
        })
    }

    returnKey() {
        this.updateDateDialog = false;
        const payload = {
            KeyID: this.itemID,
          };
        this.api.post('returnKey', payload).subscribe((response: any) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.controllS, life: 3000 });
              })
            this.itemID = ''
            this.loadItems();
        }, (error) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.controllF, life: 3000 });
              })
              this.itemID = ''
            this.loadItems();
    
        })
    }

    returnKeychain() {
        this.updateDateKeychainDialog = false;
        const payload = {
            KeychainID: this.itemID,
          };
        this.api.post('returnKeychain', payload).subscribe((response: any) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.controllS, life: 3000 });
              })
            this.itemID = ''
            this.loadItems();
        }, (error) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.controllF, life: 3000 });
              })
              this.itemID = ''
            this.loadItems();
    
        })
    }

    controllKeychain() {
        this.updateDateDialog = false;
        const payload = {
            KeychainID: this.itemID,
            UserID: this.selectedPerson.ID
          };
        this.api.post('giveKeychainToUserAdmin', payload).subscribe((response: any) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.controllS, life: 3000 });
              })
            this.itemID = ''
            this.loadItems();
            this.getAllKeys()
        }, (error) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.controllF, life: 3000 });
              })
              this.itemID = ''
            this.loadItems();
    
        })
    }

    getAllKeys() {
        this.api.get('getEverything')
        .subscribe((payload: any) => {
            this.allKeys = payload;

            this.loadItems();

        })
    }

    setIntervall() {
        const payload = {
            Intervall: this.checkIntervall,
          };
        this.api.post('setIntervall', payload).subscribe((response: any) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.intervalS, life: 3000 });
              })
            this.loadItems();
        }, (error) => {

            this.translate.get('toast').subscribe((translations: any) => {
                this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.intervalF, life: 3000 });
              })
            this.loadItems();
    
        })
    }

    cancelUpdate() {
        this.itemID = ""
    }

    onFilter(event: Event): void {
        const searchText = (event.target as HTMLInputElement).value;

        if (!searchText) {
            this.filteredIcons = this.icons;
        }
        else {
            this.filteredIcons = this.icons.filter(it => {
                return it.icon.tags[0].includes(searchText);
            });
        }
    }

    filterBorrowedKeychains(allKeychains: Keychain[], borrowedKeys: borrowedKeyItem[], allUsers: User[]): any[] {



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

    isKeychainBorrowed(key: Key, borrowedKeys: borrowedKeyItem[]): boolean {
        return borrowedKeys.some(borrowedKey => borrowedKey.Keychain_ID === key.ID);
    }
    
    isKeyBorrowed(key: Key, borrowedKeys: borrowedKeyItem[]): boolean {
        return borrowedKeys.some(borrowedKey => borrowedKey.Object_ID === key.ID);
    }

    loadItems() {

        



        this.api.get('getAllBorrowedKeys')
        .subscribe((payload: any) => {
            this.items = payload

            this.checkedItems = this.filterBorrowedKeys(this.allKeys, this.items, this.users)
            
            if (this.checkedItems.length != 0) {
                this.emptyKeys = false
            }

            this.api.get('getKeychains')
            .subscribe((payload: any) => {
    
                this.soonExpiredItems = payload;
    
    
                this.borrowedKeychains = this.filterBorrowedKeychains(this.soonExpiredItems, this.items, this.users)
    
                if (this.borrowedKeychains.length != 0) {
                    this.emptyKeychain = false
                }
    
            })

        })

        

        

        

    }

    

    getMonthExpression() {
        this.translate.get('controll').subscribe((translations: any) => {
            if (this.checkIntervall == "1") {
                this.month = translations.month
            } else {
                this.month = translations.months
            }
        })
        
    }

    getUvvLeiter() {
        this.api.get('getUvvLeiter').subscribe((payload: any) => {
            this.uvvLeiter = payload.uvvLeiter
        })
    }

    setUvvLeiter(uvvLeiter: string) {
        const payload = {
            UvvLeiter: uvvLeiter
        };

        this.api.post('setUvvLeiter', payload).subscribe(
        (response: any) => {

          // Handle any additional logic after setting ID to object
        },
        (error) => {
            // window.location.reload();
          console.error('Error:', error);
          // Handle error cases
        }
      );
    }

    formatDate (input) {
        if (input) {
            var datePart = input.match(/\d+/g),
            year = datePart[0], // get only two digits
            month = datePart[1], day = datePart[2];
          
            return day+'.'+month+'.'+year;
        } else {
            return ""
        }
        
      }

      formatClass(input) {
        var newString = input.replace(/\"/g, "")
        return newString
      }

      onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        
      this.mytable.filterGlobal(value, 'contains');
      }

      keychainGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        
      this.keychaintable.filterGlobal(value, 'contains');
      }

      openKeyDialog(item: Item) {
        this.itemID = String(item.ID)
        this.updateDateDialog = true;
      }

      openKeychainDialog(item: Item) {
        this.itemID = String(item.ID)
        this.updateDateKeychainDialog = true;
      }
}
