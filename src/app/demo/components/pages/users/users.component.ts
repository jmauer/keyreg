import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ItemService } from 'src/app/demo/service/item.service';
import { Item } from 'src/app/demo/api/item';
import { UserService } from 'src/app/demo/service/user.service';
import { ApiService } from 'src/app/demo/service/api.service';
import { User } from 'src/app/demo/api/user';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


@Component({
    templateUrl: './users.component.html',
    providers: [MessageService]
})
export class UsersComponent implements OnInit {

    productDialog: boolean = false;

    editDialog: boolean = false;

    addDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    items: Item[] = [];

    item: Item = {};

    selectedItems: Item[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    users: any[] = [];

    driverClasses: any[] = [];

    headerData: any;

    userd: User[] = [];

    user: User = {};

    date: Date[] | undefined;

    rowsPerPageOptions = [5, 10, 20];

    dateG: Date[] | undefined;

    exportColumns: any[];

    dateA: Date[] | undefined;

    exportData: any[];


    fuhrerscheinnummer: String;
    uploadedFiles: any[] = [];
    behorde: String;
    @ViewChild('dt') dataTable: Table;
    einschrankungen: String;
    globalFilter: string = '';
    companyName: string = '';

    constructor(private messageService: MessageService, private userService: UserService,private itemService: ItemService, private api: ApiService, private translate: TranslateService, private languageService: LanguageService) { 
      this.languageService.selectedLanguage$.subscribe((language) => {
        // this.selectedLanguage = { name: "Deutsch", code: language}
        // this.selectedLanguage = language;
        this.translate.use(language);
    });
  }

    ngOnInit() {
        // Retrieve the header data from the DataService
    
      this.loadUser()

      this.setCompanyName()



    
        this.driverClasses = [ 
          { label: 'B', value: 'B' },
          { label: 'BE', value: 'BE' },
          { label: 'B1', value: 'B1' },
          { label: 'C', value: 'C' },              
          { label: 'CE', value: 'CE' },
          { label: 'C1', value: 'C1' },
          { label: 'C1E', value: 'C1E' },
          { label: 'D', value: 'D' },
          { label: 'D1', value: 'D1' },
          
          
        ];
    
        this.cols = [
          { field: 'PersonalNummer', header: 'PersonalNummer' },
          { field: 'Firstname', header: 'Firstname' },
          { field: 'Lastname', header: 'Lastname' },
          { field: 'Role', header: 'Role' },
          { field: 'EMail', header: 'EMail' }
        ];

        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    
        this.users = [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'reader' }
          // { label: 'Writer', value: 'writer' }
        ];
    }

openNew() {
  this.user = {}
    this.submitted = false;
    this.productDialog = true;
}

@ViewChild('uploader') uploader!: FileUpload;

onUpload(event: any): void {

  // Handle successful upload event
  this.uploader.upload();
}

triggerUpload(): void {
  this.uploader.upload(); // Starte den Upload programmatisch
}

beforeUpload(event: any): void {

  // Ändere den Dateinamen, wenn ein benutzerdefinierter Name vorhanden ist
    // event.formData.set('file', new Blob([event.files[0]], { type: event.files[0].type }), name);
    event.files[0].name = this.user.PersonalNummer;
}

downloadData() {
  window.open(`https://keyreg.arfidex.de/exportUsers/${this.companyName}`, "_blank");
}

setCompanyName() {
  this.api.get('getCompanyName')
  .subscribe((payload: any) => {
      this.companyName = payload;

  })
}
generateUploadUrl(): string {
  // Annahme: this.user.Personalnummer enthält die Personalnummer des Benutzers
  const personalnummer = this.user.PersonalNummer || ''; // Hier Standardwert oder Handhabung fehlender Werte einfügen

  // Zusammensetzen der URL mit der Personalnummer
  const uploadUrl = `https://keyreg.arfidex.de/storeImage/v-${personalnummer}+h-${personalnummer}`;

  return uploadUrl;
}

createUser(item: User) {
  
  // this.fileUpload();
  item.Role = item.Role.toLocaleLowerCase()
    const payload = {
        PersonalNummer: item.PersonalNummer,
        FirstName: item.FirstName,
        LastName: item.LastName,
        Password: item.Password,
        Role: item.Role,
        EMail: item.EMail
      };

      if (this.validateForm()) {

    this.api.post('createUser', payload)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after user creation
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.newUserS, life: 3000 });
        })
        this.loadUser()
      },
      (error) => {
        console.error('Error creating user:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.newUserF, life: 3000 });
        })
        this.loadUser()
      }
    );
    
    this.submitted = true;
    this.hideDialog()
  } else {
    this.translate.get('toast').subscribe((translations: any) => {
      this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.missingInfo, life: 3000 });
    })
  }
}

loadUser() {
  this.api.get('getAllUsers')
  .subscribe((payload: any) => {
      this.userd = payload
      this.exportData = payload

  })
}

// Function to delete a user
deleteUser(email: string) {
    const payload = {
      EMail: email
    };

    this.api.post('deleteUser', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after user deletion
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.deleteUserS, life: 3000 });
          })
          this.loadUser()
        },
        (error) => {
          console.error('Error deleting user:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.deleteUserF, life: 3000 });
          })
          this.loadUser()
        }
      );
  }

  setIdToObject(item: Item) {
    const now = new Date();

    const payload = {
      ID: item.ID,
      Category: item.Category,
      Description: item.Description,
      Group: item.GroupName,
      ExaminationDate: this.date.toLocaleString().split(',')[0].split('.').reverse().join('.'),
      LastCheckedDate: now.toLocaleDateString().split('.').reverse().join('.'),
      Misc: item.Misc
  };

  this.api.post('setIdToObject', payload)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after setting ID to object
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.newObjectS, life: 3000 });
        })
        this.loadUser()
      },
      (error) => {
        console.error('Error setting ID to object:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.newObjectF, life: 3000 });
        })
      }
    );
}
  
  // Function to update user details
  updateUser(user: User) {
    user.Role = user.Role.toLocaleLowerCase()
    const payload = {
      PersonalNummer: user.PersonalNummer,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      EMail: user.EMail
    };

    if (user.Password != "") {
      this.changeUserPassword(user.EMail, user.Password)
    }


  
    this.api.post('updateUser', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after user update
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateUserS, life: 3000 });
          })
          this.loadUser()
        },
        (error) => {
          console.error('Error updating user:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateUserF, life: 3000 });
          })
          this.loadUser()
        }
      );
  }

  exportPdf() {
    const doc = new jsPDF();

    autoTable(doc, {head: [this.exportColumns], body: [[this.exportData, this.exportData]]})

    doc.save('table.pdf');
  }
  // Function to change user password
  changeUserPassword(email: string, newPassword: string) {
    const payload = {
      EMail: email,
      NewPassword: newPassword
    };
  
    this.api.post('changeUserPasswordAsAdmin', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after password change
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.pwChangeS, life: 3000 });
          })
          this.loadUser()
        },
        (error) => {
          console.error('Error changing password:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.pwChangeS, life: 3000 });
          })
          // this.translate.get('toast').subscribe((translations: any) => {
          //   this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.pwChangeF, life: 3000 });
          // })
          this.loadUser()
        }
      );
  }

  dealWithFiles(event) {

    this.uploadedFiles = event.files


}

fileUpload() {
  




  const payload = {
    image: this.uploadedFiles[0]
  };

  this.api.post('storeImage', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after password change
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.pwChangeS, life: 3000 });
          })
        },
        (error) => {
          console.error('Error uploading image:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.pwChangeS, life: 3000 });
          })
          // this.translate.get('toast').subscribe((translations: any) => {
          //   this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.pwChangeF, life: 3000 });
          // })
        }
      );
 }
  
editProduct(item: User) {
    this.user = { ...item };

    this.user.Password = "";
    this.editDialog = true;
}

addProduct(user: User) {
  this.user = { ...user };

  this.item.Misc = this.user.EMail
  this.item.Category = this.user.FirstName + " " + this.user.LastName
  this.item.GroupName = ""
  this.addDialog = true;
}


confirmDelete() {
    this.deleteProductDialog = false;

    this.deleteUser(this.user.EMail)
}
hideDialog() {
    this.productDialog = false;
    this.editDialog = false;
    this.submitted = false;
    this.addDialog = false;
}


deleteProduct(user: User) {
  this.deleteProductDialog = true;
  // this.product = { ...product };
  this.user = { ...user }
}



updateItem() {


  this.updateUser(this.user)
  this.hideDialog()
}

createItem() {
  for (let i = 0; i < this.userd.length; i++) {
    if (this.userd[i].FirstName + " " + this.userd[i].LastName == this.item.Category) this.item.Misc = this.userd[i].EMail
  }

  this.item.Description = `Gültigkeit: ${this.dateG.toLocaleString().split(',')[0]}\nFührerscheinnummer: ${this.fuhrerscheinnummer}\nAusstellungsdatum: ${this.dateA.toLocaleString().split(',')[0]}\nBehörde: ${this.behorde}\nEinschränkungen: ${this.einschrankungen}` 

    this.setIdToObject(this.item)

    this.addDialog = false;

            
}

onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

validateForm(): boolean {
  // Überprüfe, ob alle erforderlichen Felder ausgefüllt sind
  if (
    this.user.PersonalNummer &&
    this.user.Role &&
    this.user.FirstName &&
    this.user.LastName &&
    this.user.EMail &&
    this.user.Password
  ) { 
    return true 
  } else { 
    return false 
  };
}


}


