import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/demo/service/api.service';
import { LanguageService } from 'src/app/demo/service/language.service';

@Component({
    templateUrl: './downloads.component.html'
})
export class DownloadsComponent implements OnInit { 

    items = [
        { name: 'arfidex flex-App Software Bedingungen2023.pdf'},
        { name: 'EULA_arfidex_Flex_Apps_2023.pdf'},
        { name: 'DSGVO.pdf'}
    ]

    downloadable = []

    companyName: string = '';

    constructor(private languageService: LanguageService, private translate: TranslateService, private api: ApiService) {
        this.languageService.selectedLanguage$.subscribe((language) => {

        this.translate.use(language);
        });    
      }

      ngOnInit() {

        this.setCompanyName()

        this.downloadPDFs()
      }

    downloadFile(name: string) {

        const pdfPath = 'assets/demo/data/' + name; 
        const a = document.createElement('a');
        a.href = pdfPath;
        a.download = name; 
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }  

    downloadPDF(name: string) {
      const newName = name.split(".")
      const pdfPath = 'https://keyreg.arfidex.de/getPdfFile/' + this.companyName + '/' + newName[0]; // Pfad zum vorhandenen PDF
      window.open(pdfPath, "_blank")
  }  

    downloadHistory() {
        window.open("https://keyreg.arfidex.de/exportHistory", "_blank");
    }

    downloadData() {
        window.open(`https://keyreg.arfidex.de/exportHistory/${this.companyName}`, "_blank");
      }

      downloadPDFs() {
        this.api.get('/getPdfList')
        .subscribe((payload: any) => {
          this.downloadable = payload

        })
      }
      
      setCompanyName() {
        this.api.get('getCompanyName')
        .subscribe((payload: any) => {
            this.companyName = payload;

        })
    
      }
}


