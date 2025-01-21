import { RouterModule } from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ApiService } from './demo/service/api.service';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                canActivate: [() => {
                    const oauthService: ApiService = inject(ApiService);
                    return oauthService.authGuard()
                }],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    // { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    // { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },

            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload', useHash: false })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
