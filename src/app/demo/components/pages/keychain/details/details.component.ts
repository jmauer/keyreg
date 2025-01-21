import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Item } from 'src/app/demo/api/item';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/demo/service/language.service';
import { Key } from '@fullcalendar/core/preact';
import { KeychainItem } from 'src/app/demo/api/keychainItem';
import { Keychain } from 'src/app/demo/api/keychain';
import { Location } from '@angular/common';

@Component({
    templateUrl: './details.component.html',
    providers: [MessageService],
})
export class DetailsComponent implements OnInit {
    itemId: string;

    itemds: MenuItem[] | undefined;

    items: Key[] = [];

    selectedItems: Key[] = [];

    notSelectedItems: Key[] = [];

    item: KeychainItem = {};

    keys: any[] = [];

    name: String;

    home: MenuItem | undefined;

    value: string;

    cols: any;
    productDialog: any;
    deleteKeychainDialog: any;
    editKeychainDialog: any;

    constructor(
        private _location: Location,
        private route: ActivatedRoute,
        private api: ApiService,
        private messageService: MessageService,
        private translate: TranslateService,
        private languageService: LanguageService
    ) {
        this.languageService.selectedLanguage$.subscribe((language) => {
            this.translate.use(language);
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.itemId = params.get('id'); // 'id' muss mit dem Parameter in deiner Route übereinstimmen
            // Jetzt kannst du this.itemId verwenden, um mit der übergebenen ID zu arbeiten.
        });

        this.loadProducts();

        this.loadKeys();
    }

    loadProducts() {
        const payload = {
            KeychainID: this.itemId,
        };
        this.api
            .post('getAllKeysFromKeychain', payload)
            .subscribe((response: any[]) => {
                this.keys = response;

                this.selectedItems = this.keysInKeychain(this.items, this.keys);

            });
    }

    loadKeys() {
        this.api.get('getAllFreeObjects').subscribe((payload: any) => {

            this.notSelectedItems = payload;

            // this.notSelectedItems = this.keysNotInKeychain(
            //     this.items,
            //     this.keys
            // );

            // this.selectedItems = this.keysInKeychain(this.items, this.keys);


        });
    }

    setKeyToKeychainRequest(item: Key) {
        const payload = {
            KeyID: item.ID,
            KeychainID: this.itemId,
        };

        this.api.post('setKeyToKeychain', payload).subscribe(
            (response: any) => {

                // Handle any additional logic after setting ID to object
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations.successful,
                        detail: translations.updateObjectS,
                        life: 3000,
                    });
                });
                this.loadProducts();

                this.loadKeys();
            },
            (error) => {
                console.error('Error setting ID to object:', error);
                // Handle error cases
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translations.failure,
                        detail: translations.updateObjectF,
                        life: 3000,
                    });
                });
            }
        );
    }

    removeKeyToKeychainRequest(item: Key) {
        const payload = {
            KeyID: item.ID,
        };

        this.api.post('removeKeyFromKeychain', payload).subscribe(
            (response: any) => {

                // Handle any additional logic after setting ID to object
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations.successful,
                        detail: translations.updateObjectS,
                        life: 3000,
                    });
                });
                this.loadProducts();

                this.loadKeys();
            },
            (error) => {
                console.error('Error setting ID to object:', error);
                // Handle error cases
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translations.failure,
                        detail: translations.updateObjectF,
                        life: 3000,
                    });
                });
            }
        );
    }

    keyBorrowed(item: Key): string {
        if (item.LoanPeriod) {
            return 'Ja';
        } else {
            return 'Nein';
        }
    }

    filterSelectedItems(allKeys: Key, keychainKeys: KeychainItem[]): boolean {
        
        const contains = keychainKeys.some(
            (key) => key.KeyNumber === allKeys.Number
        );

        return contains;
    }

    keysInKeychain(allKeys: Key[], keychainKeys: KeychainItem[]): Key[] {

        const filteredKeys = allKeys.filter((key) =>
            this.filterSelectedItems(key, keychainKeys)
        );
        return filteredKeys;
    }

    keysNotInKeychain(allKeys: Key[], keychainKeys: KeychainItem[]): Key[] {
        const filteredKeys = allKeys.filter((key) =>
            this.filterNotSelectedKeys(key, keychainKeys)
        );

        return filteredKeys;
    }

    filterNotSelectedKeys(allKeys: Key, keychainKeys: KeychainItem[]): boolean {
        const contains = keychainKeys.some(
            (key) => key.KeyNumber === allKeys.Number
        );

        return !contains;
    }

    isKeyBorrowed(key: Key, borrowedKeys: KeychainItem[]): boolean {

        return borrowedKeys.some(
            (borrowedKey) => borrowedKey.KeyNumber === key.Number
        );
    }
    setKeyToKeychain() {
        var keysInKeychain = ""


        this.keys.forEach((element) => {

            keysInKeychain = keysInKeychain + element.ID + ','

        });

        const payload = {
            KeychainID: this.itemId,
            Keys: keysInKeychain,
        };

        this.api.post('editKeychain', payload).subscribe(
            (response: any) => {

                // Handle any additional logic after setting ID to object
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations.successful,
                        detail: translations.updateObjectS,
                        life: 3000,
                    });
                });
                this.loadProducts();

                this.loadKeys();

                this.productDialog = false;
            },
            (error) => {
                console.error('Error setting ID to object:', error);
                // Handle error cases
                this.translate.get('toast').subscribe((translations: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translations.failure,
                        detail: translations.updateObjectF,
                        life: 3000,
                    });
                });
            }
        );

        
    }

    backClicked() {
        this._location.back();
    }

    openNew() {
        this.productDialog = true;
    }

    removeFromKeychain(item: Key) {

        this.removeKeyToKeychainRequest(item);
    }
}
