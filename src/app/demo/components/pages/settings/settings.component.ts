import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/demo/api/companies';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [MessageService]
})
export class SettingsComponent implements OnInit {
  countries: any[] | undefined;

  selectedCountry: 'Germany'

  date: Date[] | undefined;

  isButtonDisabled: boolean = true;

  selectedLanguage: { name: string, code: string };

  appVersion = '2.0.0'

  apiVersion = ''

  companyName = ''

  companies: Company[] = [];

  company: Company = {};

  meCompany: Company =  {}

  companyDialog = false

  updateDialog = false

  emptyTable = true

  username = ''

  firstName = ''

  lastName = ''

  password = ''

  adminEmail = ''

  infoEmail = ''

  examinationDate = ''


  languages = [
    { name: 'Deutsch', code: 'de' },
    { name: 'English', code: 'en' },
    { name: 'Espanol', code: 'es' },
    { name: 'Dansk', code: 'da' },
    { name: 'French', code: 'fr' },
    // Füge hier weitere unterstützte Sprachen hinzu
  ];
  deleteDialog: boolean;

  constructor(private messageService: MessageService,private languageService: LanguageService, private translate: TranslateService, private api: ApiService) {
    this.languageService.selectedLanguage$.subscribe((language) => {
      // this.selectedLanguage = { name: "Deutsch", code: language}
      // this.selectedLanguage = language;
      this.translate.use(language);
    });    
  }

  setLanguage(language: string) {
    this.languageService.setLanguage(language);
    this.translate.use(language);
  }

  showDialog() {
    this.companyDialog = true
  }

  hideUpdateDialog() {
    this.updateDialog = false
  }

  showMeUpdate() {
    this.company = this.meCompany
    this.updateDialog = true
  }

  showUpdate(company: Company) {
    this.company = { ...company }
    this.updateDialog = true
  }

  deleteCompany(company: Company) {
    this.company = { ...company }
    this.deleteDialog = true
  }

  confirmDelete() {
    const payload = {
      Company: this.company.Name
    }

    this.api.post('deleteCompanyExaminationDate', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after user update
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.deleteCompanyS, life: 3000 });
          })
          this.deleteDialog = false
          this.getCustomers()
        },
        (error) => {
          console.error('Error updating user:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.deleteCompanyF, life: 3000 });
          })
          this.deleteDialog = false
          this.getCustomers()
        }
      );
  }

  updateCompany() {
    const payload = {
      Date: this.date.toLocaleString().split(',')[0].split('.').reverse().join('.'),
      Company: this.company.Name
    }

    this.api.post('updateCompanyExaminationDate', payload)
      .subscribe(
        (response: any) => {

          // Handle any additional logic after user update
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.updateCompanyS, life: 3000 });
          })
          this.hideUpdateDialog()
          this.getCustomers()
        },
        (error) => {
          console.error('Error updating user:', error);
          // Handle error cases
          this.translate.get('toast').subscribe((translations: any) => {
            this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.updateCompanyF, life: 3000 });
          })
          this.getCustomers()
        }
      );
  }

  hideDialog() {
    this.companyName = ''
    this.username = ''
    this.firstName = ''
    this.lastName = ''
    this.adminEmail = ''
    this.infoEmail = ''
    this.password = ''
    this.companyDialog = false
  }

  getCustomers() {
    this.api.get('getCompanies').subscribe(data => {
      this.companies = data;

  
      if (this.companies.length != 0) {
        this.emptyTable = false;
        // Sort the companies by ExaminationDate


      } else {
        this.emptyTable = true;
      }
    }, error => {
      console.error('Error fetching companies:', error);
      this.emptyTable = true;
    });
  }

  getInfo() {
    this.api.get('getCompanyExaminationDate').subscribe(data => {

      this.meCompany = data
      this.examinationDate = this.formatDate(data[0].ExaminationDate);

    })
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

  createCompany() {
    const payloadInitDatabase = {
      CompanyName: this.companyName
    }

    const payloadInitAdmin = {
      PersonalNummer: this.username,
      FirstName: this.firstName,
      LastName: this.lastName,
      Password: this.password,
      Database: this.companyName,
      EMail: this.adminEmail
    };

    if (this.validateForm()) {
      this.api.post('createNewDatabase', payloadInitDatabase)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after user creation
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.dbS, life: 3000 });
        })
        this.api.post('initiateAdmin', payloadInitAdmin)
    .subscribe(
      (response: any) => {

        // Handle any additional logic after user creation
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.adminS, life: 3000 });
        })
        this.getCustomers()
        this.hideDialog()
      },
      (error) => {
        console.error('Error creating user:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.adminF, life: 3000 });
        })
      }
    );
      },
      (error) => {
        console.error('Error creating user:', error);
        // Handle error cases
        this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.dbF, life: 3000 });
        })
      }
    );

    } else {
      this.translate.get('toast').subscribe((translations: any) => {
        this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.missingInfo, life: 3000 });
      })
    }
  }

  checkInput() {
    // Überprüfe, ob das Textfeld leer ist
    if (this.companyName.trim() === '') {
      // Wenn das Textfeld leer ist, deaktiviere den Button
      this.isButtonDisabled = true;
    } else {
      // Wenn das Textfeld nicht leer ist, aktiviere den Button
      this.isButtonDisabled = false;
    }
  }


  validateForm(): boolean {
    if (this.companyName == '' && this.username == '' && this.firstName == '' &&
    this.lastName == '' &&
    this.adminEmail == '' &&
    this.password == '') {
      return false;
    } else {
      return true;
    }
  }

  // ){}
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {

    this.api.get('getApiVersion').subscribe(data => {
      this.apiVersion = data.api_key
    })

    this.getCustomers()

    this.getInfo()

    
  }
}
