import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'crud/:id', loadChildren: () => import('./crud/details/details.module').then(m => m.DetailsModule) },
        { path: 'keychain', loadChildren: () => import('./keychain/keychain.module').then(m => m.CrudModule) },
        { path: 'keychain/:id', loadChildren: () => import('./keychain/details/details.module').then(m => m.DetailsModule) },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
        { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)},
        { path: 'downloads', loadChildren: () => import('./downloads/downloads.module').then(m => m.DownloadsModule)},
        { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)},
        { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
        { path: 'admin', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
        { path: 'checks', loadChildren: () => import('./../utilities/icons/icons.module').then(m => m.IconsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
