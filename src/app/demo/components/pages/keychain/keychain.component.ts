import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ItemService } from 'src/app/demo/service/item.service';
import { Item } from 'src/app/demo/api/item';
import { ApiService } from 'src/app/demo/service/api.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';
import { User } from 'src/app/demo/api/user';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Key } from 'src/app/demo/api/key';
import { Keychain } from 'src/app/demo/api/keychain';
import { borrowedKeyItem } from 'src/app/demo/api/borrowedKeyItem';


@Component({
    templateUrl: './keychain.component.html',
    styleUrls: ['./keychain.component.scss'],
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    doc = new jsPDF()

    productDialog: boolean = false;

    editProductDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    items: Keychain[] = [];

    item: Keychain = {};

    borrowedKeys: borrowedKeyItem[]

    selectedItems: Item[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    users: any[] = [];

    selectedDriversLicenses: any[] = []

    userd: any[] = [];

    selectUser: any[] = [];

    headerData: any;

    rowsPerPageOptions = [5, 10, 20];

    date: Date[] | undefined;

    datePlaceholder: string;

    dateG: Date[] | undefined;

    dateGPlaceholder: string;

    dateA: Date[] | undefined;

    dateAPlaceholder: string;

    fuhrerscheinnummer: String;

    behorde: String;

    einschrankungen: String;

    placeholderItem: Item = {};

    groupPlaceholder: String;

    companyName: string = '';

    itemId: string = '';

    itemName: string = '';

    itemMisc: string = '';

    itemLoanPeriod: string = '';

    selectedGroupNames: SelectItem[];

    dropdownOptions: SelectItem[];

    globalFilterFields: string[];
    
    @ViewChild('mytable') mytable: Table;

    constructor(private messageService: MessageService, private itemService: ItemService, private api: ApiService, private translate: TranslateService, private languageService: LanguageService) { 
      this.languageService.selectedLanguage$.subscribe((language) => {

        this.translate.use(language);
    });
  }

        ngOnInit() {
        

          this.loadKeychain()

            this.api.get('getAllUsers')
                .subscribe((payload: any) => {
                    // this.items = payload;
                    this.userd = payload


                    



              
                      for (let i = 0; i < payload.length; i++) {
                        this.selectUser.push({ label: payload[i].FirstName + " " + payload[i].LastName, value: payload[i].FirstName + " " + payload[i].LastName });
                      }
                    
                })


        
                this.cols = [
                  { field: 'ID', header: 'ID' },




                  { field: 'Name', header: 'Name' }


                ];
            
                // Felder, die in der globalen Suche berücksichtigt werden
                this.globalFilterFields = ['ID', 'Number', 'City', 'Street', 'HouseNumber', 'Name', 'LoanPeriod', 'Timestamp'];
              }



  isKeyBorrowed(key: Key): boolean {
    return this.borrowedKeys.some(borrowedKey => borrowedKey.Keychain_ID  === key.ID);
}

  keyBorrowed(item: Key): string {
    
    if (this.isKeyBorrowed(item)) {
      return "Ja"
    } else {
      return "Nein"
    }
  }

  exportData() {
    window.open("https://keyreg.arfidex.de/exportObject", "_blank");

  }
  
  downloadData() {
    window.open(`https://keyreg.arfidex.de/exportObject/${this.companyName}`, "_blank");
  }
  
 
  deleteItemById(id: string) {
    this.api.get('deleteKeychain/'+ id)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after item deletion
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.deleteKeychainS, life: 3000 });
          })
          this.loadKeychain()
        },
        (error) => {
          console.error('Error deleting item:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.deleteKeychainF, life: 3000 });
          })
          this.loadKeychain()
        }
      );
  }
  
    openNew() {
        this.item = {};
        this.submitted = false;
        this.dropdownOptions = []
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    clearShit() {
      this.item = {};
        this.submitted = false;
        this.dropdownOptions = []
        this.fuhrerscheinnummer = ""
        this.behorde = ""
        this.einschrankungen = ""
        this.itemId = ""
        this.itemName = ""
    }

    editProduct(item: Keychain) {

      // this.item = {};
      this.item = { ...item };
      this.editProductDialog = true;
    }

    deleteProduct(item: Key) {
        this.deleteProductDialog = true;
        this.item = { ...item }
    }

    confirmDelete() {
        this.deleteProductDialog = false;

        this.deleteItemById(String(this.item.ID))
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    hideEditDialog() {
      this.editProductDialog = false;
      this.submitted = false;
  }

  loadProducts() {
    this.api.get('getAllObjects')
    .subscribe((payload: any) => {
        this.items = payload;


      
    })
  }

  createKeychain() {
    const payload = {
      ID: this.itemId ?? "",
      Name: this.itemName ?? "",
      Misc: this.itemMisc ?? "",
      LoanPeriod: this.itemLoanPeriod ?? ""
    }

    



    if (this.checkIfKeyExist(this.itemId) == false) {this.api.post('createKeychain', payload)
      .subscribe(
        (response: any) => {


          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateKeychainS, life: 3000 });
          })
          this.clearShit();
          this.loadKeychain();
        },
        (error) => {
          console.error('Error updating examination date:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateKeychainF, life: 3000 });
          })
          this.clearShit();
          this.loadKeychain();
        }
      );} else {
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateKeychainF, life: 3000 });
        })
      }
  }

  checkIfKeyExist(key: string): boolean {

    var exist = false
  
    this.api.get('checkIfIdExists/' + key)
    .subscribe((payload: boolean) => {
      exist = payload
    })

    return exist
  }

  updateKeychain(item: Keychain) {

    const payload = {
      ID: item.ID,
      Name: item.Name,
      Misc: item.misc,
      LoanPeriod: item.LoanPeriod
    }

    this.api.post('updateKeychain', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after updating examination date
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateKeychainS, life: 3000 });
          })
          this.clearShit();
          this.loadKeychain();
        },
        (error) => {
          console.error('Error updating examination date:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateKeychainF, life: 3000 });
          })
          this.clearShit();
          this.loadKeychain();
        }
      );
  }

  loadKeychain() {
    this.api.get('getKeychains')
    .subscribe((payload: any) => {

      this.items = payload
    })

    this.api.get('getAllBorrowedKeys')
        .subscribe((payload: any) => {

            this.borrowedKeys = payload

            // this.borrowedKeys = this.filterBorrowedKeychains(this.soonExpiredItems, this.items)

            // if (this.borrowedKeychains.length != 0) {
            //     this.emptyKeychain = false
            // }

        })
  }

    createItem() {
      this.createKeychain(),
      this.submitted = true;
      this.productDialog = false;
                
    }

    updateItem() {

      this.updateKeychain(this.item)
      this.editProductDialog = false;                
    }

  //   filterBorrowedKeychains(allKeychains: Keychain[], borrowedKeys: borrowedKeyItem[]): Key[] {

  //     const filteredKeys = allKeychains.filter(key => this.isKeychainBorrowed(key, borrowedKeys));
  //     return filteredKeys;
  // }

//   isKeychainBorrowed(key: Key, borrowedKeys: borrowedKeyItem[]): boolean {
//     return borrowedKeys.some(borrowedKey => borrowedKey.Keychain_ID === key.ID);
// }

onGlobalFilter(event: Event) {
  const value = (event.target as HTMLInputElement).value;
this.mytable.filterGlobal(value, 'contains');
}
}
