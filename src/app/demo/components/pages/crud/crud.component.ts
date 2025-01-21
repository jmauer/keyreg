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
// import { Key } from 'src/app/demo/api/key';
import { borrowedKeyItem } from 'src/app/demo/api/borrowedKeyItem';
import { Key } from '@fullcalendar/core/preact';
import { wholeKey } from 'src/app/demo/api/wholeKey';
import { ex } from '@fullcalendar/core/internal-common';


@Component({
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.scss'],
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

  @ViewChild('mytable') mytable: Table;
  
    doc = new jsPDF()

    productDialog: boolean = false;

    editProductDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    items: Key[] = [];

    item: Key = {};

    selectedItems: Item[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    users: any[] = [];

    borrowedKeys: borrowedKeyItem[] = [];

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

    firma: String;

    behorde: String;

    einschrankungen: String;

    placeholderItem: Item = {};

    groupPlaceholder: String;

    companyName: string = '';

    selectedGroupNames: SelectItem[];

    dropdownOptions: Key;

    globalFilterFields: string[]; 

    constructor(private messageService: MessageService, private itemService: ItemService, private api: ApiService, private translate: TranslateService, private languageService: LanguageService) { 
      this.languageService.selectedLanguage$.subscribe((language) => {
        // this.selectedLanguage = { name: "Deutsch", code: language}
        // this.selectedLanguage = language;
        this.translate.use(language);
    });
  }

        ngOnInit() {
        
          this.loadProducts()

          this.loadBorrowedKeys()

          this.loadKeychain()

          this.setCompanyName()

          // this.getAll()

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
                  { field: 'Number', header: 'Number' },
                  { field: 'City', header: 'City' },
                  { field: 'Street', header: 'Street' },
                  { field: 'HouseNumber', header: 'HouseNumber' },
                  { field: 'Name', header: 'Name' },
                  { field: 'LoanPeriod', header: 'LoanPeriod' },
                  { field: 'Batch', header: 'Batch' },
                  { field: 'Timestamp', header: 'Timestamp' }
                ];
            
                // Felder, die in der globalen Suche berücksichtigt werden
                this.globalFilterFields = ['ID', 'Batch', 'Number', 'City', 'Street', 'HouseNumber', 'Name', 'LoanPeriod', 'Timestamp'];
              }


    // Function to set ID to an object
    setIdToObject(item: Key) {
      const now = new Date();

      const payload = {
        ID: item.ID ?? "",
        Number: item.Number ?? "",
        Name: item.Name ?? "",
        City: item.City ?? "",
        Street: item.Street ?? "",
        HouseNumber: item.HouseNumber ?? "",
        LoanPeriod: item.LoanPeriod ?? "",
        KeychainID: "",
        Batch: item.Batch ?? "",
        Misc: item.Misc ?? ""
    };

    console.log(payload)

      if (this.checkIfKeyExist(item.ID) == false) {  

          this.api.post('setIdToObject', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after setting ID to object
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.newObjectS, life: 3000 });
          })

            this.loadProducts();
          
          
        },
        (error) => {
          console.error('Error setting ID to object:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.newObjectF, life: 3000 });
          })
        }
      );} else {
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.newObjectF, life: 3000 });
        })
      }
  }

  setKeyToKeychain(item: Key) {
    const payload = {
      KeyID: item.ID,
      KeychainID: this.dropdownOptions[0].ID
  };

  this.api.post('setKeyToKeychain', payload)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after setting ID to object
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateObjectS, life: 3000 });
        })
        this.loadProducts();
      },
      (error) => {
        console.error('Error setting ID to object:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateObjectF, life: 3000 });
        })
      }
    );
  }

  isKeyBorrowed(key: Key): boolean {
    return this.borrowedKeys.some(borrowedKey => borrowedKey.Object_ID === key.ID);
}

getAll() {
  this.api.get('getEverything')
    .subscribe((payload: any) => {
    console.log(payload)
                  
  })

}

checkIfKeyExist(key: string): boolean {

  var exist = false

  this.api.get('checkIfIdExists/' + key)
  .subscribe((payload: boolean) => {
    exist = payload
  })
  return exist
}

keyKeychain(key: Key): string {

  this.borrowedKeys.forEach(keychain => {
    if (key.ID == keychain.Keychain_ID) {
      console.log(key.Number, keychain.Keychain_ID)
    }})

  return " ";
}


  keyBorrowed(item: Key): string {
    
    if (this.isKeyBorrowed(item)) {
      return "Ja"
    } else {
      return "Nein"
    }
  }

  updateObject(item: Key) {
    const now = new Date();

    const payload = {
      ID: item.ID,
      Number: item.Number ?? "",
      Name: item.Name ?? "",
      City: item.City ?? "",
      Street: item.Street ?? "",
      HouseNumber: item.HouseNumber ?? "",
      LoanPeriod: item.LoanPeriod ?? "",
      KeychainID: "",
        Batch: item.Batch ?? "",
      Misc: item.Misc ?? ""
  };


  this.api.post('setIdToObject', payload)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after setting ID to object
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateObjectS, life: 3000 });
        })

        this.loadProducts();
      },
      (error) => {
        console.error('Error setting ID to object:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateObjectF, life: 3000 });
        })
      }
    );
}
  
  // Function to update examination date
  updateExaminationDate(id: number, quantity: number) {
    const payload = {
      ID: id,
      Quantity: quantity
    };
  
    this.api.post('updateExaminationDate', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after updating examination date
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateObjectS, life: 3000 });
          })
          this.loadProducts();
        },
        (error) => {
          console.error('Error updating examination date:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateObjectF, life: 3000 });
          })
          this.loadProducts();
        }
      );
  }

  exportData() {
    window.open("https://keyreg.arfidex.de/exportObject", "_blank");

  }
  
  downloadData() {
    window.open(`https://keyreg.arfidex.de/exportObject/${this.companyName}`, "_blank");
  }
  
  setCompanyName() {
    this.api.get('getCompanyName')
    .subscribe((payload: any) => {
        this.companyName = payload;
    })

  }

  // Function to get outdated examination dates
  getOutdatedExaminationDates() {
    this.api.get('getOutdatedExaminationDates')
      .subscribe(
        (response: any) => {

          // Handle the response containing outdated examination dates
        },
        (error) => {
          console.error('Error retrieving outdated examination dates:', error);
          // Handle error cases
          this.loadProducts();
        }
      );
  }
  
  // Function to delete an item by ID
  deleteItemById(id: string) {
    this.api.get('deleteItem/'+ id)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after item deletion
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.deleteObjectS, life: 3000 });
          })
          this.loadProducts();
        },
        (error) => {
          console.error('Error deleting item:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.deleteObjectF, life: 3000 });
          })
          this.loadProducts();
        }
      );
  }
  
    openNew() {
        this.item = {};
        this.submitted = false;
        // this.dropdownOptions = []
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    clearShit() {
      this.item = {};
        this.submitted = false;
        // this.dropdownOptions = []
        this.firma = ""
        this.behorde = ""
        this.einschrankungen = ""

    }

    editProduct(item: Key) {
      // this.item = {};

        this.item = { ...item };


        this.editProductDialog = true;
    }

    deleteProduct(item: Key) {
        this.deleteProductDialog = true;
        // this.product = { ...product };
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

  setSelectedGroupNames(data: any[]): void {
    // Filtern Sie die Gruppennamen aus den API-Daten, die bereits ausgewählt sein sollen
    const preselectedGroupNames = data.filter(item => item.GroupName === 'B' || item.GroupName === 'B1')
                                       .map(item => item.GroupName);

    // Setzen Sie die ausgewählten Gruppennamen in die selectedGroupNames-Variable
    this.selectedGroupNames = preselectedGroupNames;
}

loadProducts() {
  this.api.get('getEverything')
      .subscribe((payload: any) => {
          this.items = this.transformPayload(payload);
      });
}

  transformPayload(payload: any[]): wholeKey[] {
    return payload.map(item => ({
        AlertSent: item.AlertSent,
        Batch: item.Batch || "",
        City: item.City || "",
        EMail: item.EMail || "",
        FirstName: item.FirstName || "",
        HouseNumber: +item.HouseNumber || 0,
        ID: item.ID,
        LastName: item.LastName || "",
        LoanPeriod: item.LoanPeriod || 0,
        Misc: item.Misc || "",
        Name: item.Name || "",
        Number: +item.Number || 0,
        Street: item.Street || "",
        Timestamp: item.Timestamp || "",
        kAlertSent: item["k.AlertSent"] || 0,
        kID: item["k.ID"] || "",
        kLoanPeriod: item["k.LoanPeriod"] || 0,
        kName: item["k.Name"] || "",
        kTimestamp: item["k.Timestamp"] || "",
        misc: item["k.Misc"] || ""
    }));
}

  loadBorrowedKeys() {
    this.api.get('getAllBorrowedKeys')
    .subscribe((payload: any) => {
      
      this.borrowedKeys = payload

    })
  }

  loadKeychain() {
    this.api.get('getKeychains')
    .subscribe((payload: any) => {
      
      this.users = payload

    })
  }

    createItem() {   
      
        this.setIdToObject(this.item)
      
        this.productDialog = false;          
    }

    updateItem() {      

      this.updateObject(this.item)
      this.editProductDialog = false;                
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

    validateForm(): boolean {
      // Überprüfe, ob alle erforderlichen Felder ausgefüllt sind
      // if (
      //   this.item.ID &&
      //   this.item.Category &&
      //   this.item.ExaminationDate &&
      //   this.item.GroupName &&
      //   this.item.LastCheckedDate &&
      //   this.item.Misc
      // ) { 
      //   return true 
      // } else { 
      //   return false 
      // };

      return true
    }

    formatClass(input) {
      var newString = input.replace(/\"/g, "")
      return newString
    }

    onGlobalFilter(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      
    this.mytable.filterGlobal(value, 'contains');
    }
}
