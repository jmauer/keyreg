import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Item } from 'src/app/demo/api/item';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './details.component.html',
  providers: [MessageService]
})
export class DetailsComponent implements OnInit, OnDestroy {

  itemId: string | null = null;

  productDialog: boolean = false;

    editProductDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

  itemds: MenuItem[] | undefined;

  items: any[] = [];

  item: Item = {};

  name: string = '';

  home: MenuItem | undefined;

  value: string = '';

  keyIsBorrowed = false

  private subscription: Subscription = new Subscription();

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private api: ApiService,
    private messageService: MessageService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.subscription.add(
      this.languageService.selectedLanguage$.subscribe((language) => {
        this.translate.use(language);
      })
    );
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) {
        this.fetchItemDetails(this.itemId);
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No item ID provided' });
      }
    });
  }

  fetchItemDetails(itemId: string) {
    this.subscription.add(
      this.api.get('getID/' + itemId).subscribe(
        (payload: any) => {
          this.items = payload;
          this.itemId = this.items[0].Name

          if (this.items[0].Timestamp) {
            this.keyIsBorrowed = true
          } else {
            this.keyIsBorrowed = false
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data retrieval failed' });
        }
      )
    );
  }

  getName(key: any): String {

    if (key.LastName) {
      return key.FirstName + " " + key.LastName
    } else {
      return ""
    }

    return ""
  }

  returnKey() {
    const payload = {
      KeyID: this.items[0].ID,
    };
  this.api.post('returnKey', payload).subscribe((response: any) => {

      this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'success', summary: translations.successful, detail: translations.controllS, life: 3000 });
        })
        this.fetchItemDetails(this.items[0].ID);
  }, (error) => {

      this.translate.get('toast').subscribe((translations: any) => {
          this.messageService.add({ severity: 'error', summary: translations.failure, detail: translations.controllF, life: 3000 });
        })
        this.fetchItemDetails(this.items[0].ID);

  })
  }

  backClicked() {
    this._location.back();
  }

  openNew() {
    this.productDialog = true
  }

  deleteItem() {
    this.deleteProductDialog = true
  }


  ngOnDestroy() {
    this.subscription.unsubscribe(); // Clean up the subscription
  }

}
