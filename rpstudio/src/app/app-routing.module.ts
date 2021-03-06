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
import { JobEditorComponent } from './jobs/job-editor/job-editor.component';
import { JobSubmitterComponent } from './jobs/job-submitter/job-submitter.component';
import { JobSchedulerComponent } from './jobs/job-scheduler/job-scheduler.component';
import { DatafileUploaderComponent } from './data/datafile-uploader/datafile-uploader.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { LogBrowserComponent } from './log-browser/log-browser.component';
import { OnlyLoggedInGuard } from './guards/only-logged-in.guard';
import { FilebrowserComponent } from './data/filebrowser/filebrowser.component';
import { CreateDatamapComponent } from './data/create-datamap/create-datamap.component';

const routes: Routes = [
 { path: '', component: HomeComponent },
 { path: 'home', component: HomeComponent },
 { path: 'profile', component: ProfileComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'model-create', component: ModelCreateComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'about', component: AboutComponent },
 { path: 'log', component: LogBrowserComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'models', component: ModelsComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'models/:id', component: ModelComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'jobs', component: JobsComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'job-editor', component: JobEditorComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'job-submitter', component: JobSubmitterComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'job-scheduler', component: JobSchedulerComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'help', component: HelpComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'data', component: FilebrowserComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'data-upload', component: DatafileUploaderComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'create-datamap', component: CreateDatamapComponent, canActivate: [OnlyLoggedInGuard] },
 { path: 'admin', component: AdminComponent, canActivate: [OnlyLoggedInGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
