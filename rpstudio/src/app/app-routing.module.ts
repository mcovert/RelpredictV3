import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ModelCreateComponent } from './models/model-create/model-create.component';
import { ModelsComponent } from './models/models.component';
import { ModelComponent } from './models/model/model.component';
import { JobsComponent } from './jobs/jobs.component';
import { DataComponent } from './data/data.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { LogBrowserComponent } from './log-browser/log-browser.component';

const routes: Routes = [
 { path: '', component: HomeComponent },
 { path: 'home', component: HomeComponent },
 { path: 'profile', component: ProfileComponent },
 { path: 'model-create', component: ModelCreateComponent },
 { path: 'about', component: AboutComponent },
 { path: 'log', component: LogBrowserComponent },
 { path: 'models', component: ModelsComponent },
 { path: 'models/:id', component: ModelComponent },
 { path: 'jobs', component: JobsComponent },
 { path: 'help', component: HelpComponent },
 { path: 'data', component: DataComponent },
 { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
