import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    ngOnInit(): void {
        this.items = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];

        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
}