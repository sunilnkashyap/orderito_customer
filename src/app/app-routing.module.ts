import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './splash/splash.module#SplashPageModule' },
    { path: 'h', loadChildren: './tabs/tabs.module#TabsPageModule' },
    {
        path: 'givereview',
        loadChildren: './givereview/givereview.module#GivereviewPageModule'
    },
  { path: 'skdash', loadChildren: './dashboard/dashboard.module#DashboardPageModule' }


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
