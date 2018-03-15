import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule  } from './app-routing.module';

import { ArchwizardModule } from 'ng2-archwizard';

import { AuthService} from './services/auth.service';
import { DataService} from './services/data.service';
import { JobService} from './services/job.service';
import { ModelService} from './services/model.service';
import { AdminService} from './services/admin.service';
import { OnlyLoggedInGuard } from './guards/only-logged-in.guard';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ModelCreateComponent } from './models/model-create/model-create.component';
import { ModelsComponent } from './models/models.component';
import { ModelComponent } from './models/model/model.component';
import { JobsComponent } from './jobs/jobs.component';
import { DataComponent } from './data/data.component';
import { AdminComponent } from './admin/admin.component';
import { LogBrowserComponent } from './log-browser/log-browser.component';
import { FeatureListComponent } from './models/feature-list/feature-list.component';
import { FeatureComponent } from './models/feature/feature.component';
import { TargetListComponent } from './models/target-list/target-list.component';
import { TargetComponent } from './models/target/target.component';
import { AlgorithmListComponent } from './models/algorithm-list/algorithm-list.component';
import { AlgorithmComponent } from './models/algorithm/algorithm.component';
import { ParameterListComponent } from './models/parameter-list/parameter-list.component';
import { ParameterComponent } from './models/parameter/parameter.component';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { UsersComponent } from './admin/users/users.component';
import { AccountListComponent } from './admin/accounts/account-list/account-list.component';
import { AccountComponent } from './admin/accounts/account/account.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { UserComponent } from './admin/users/user/user.component';
import { TrainedmodelListComponent } from './trainedmodel-list/trainedmodel-list.component';

import { ModelClassPipe } from './models/model-class.pipe';
import { HelpComponent } from './help/help.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { AlgEditorComponent } from './models/alg-editor/alg-editor.component';
import { ParmEditorComponent } from './parm-editor/parm-editor.component';
import { DatamapEditorComponent } from './data/datamap-editor/datamap-editor.component';
import { JobSchedulerComponent } from './jobs/job-scheduler/job-scheduler.component';
import { JobSubmitterComponent } from './jobs/job-submitter/job-submitter.component';
import { JobEditorComponent } from './jobs/job-editor/job-editor.component';
import { JobStatusComponent } from './jobs/job-status/job-status.component';
import { DatafileUploaderComponent } from './data/datafile-uploader/datafile-uploader.component';
import { DatafileViewerComponent } from './data/datafile-viewer/datafile-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UserLoginComponent,
    AboutComponent,
    ProfileComponent,
    ModelCreateComponent,
    ModelsComponent, 
    ModelComponent,
    JobsComponent,
    DataComponent,
    AdminComponent,
    LogBrowserComponent,
    FeatureListComponent,
    FeatureComponent,
    TargetListComponent,
    TargetComponent,
    AlgorithmListComponent,
    AlgorithmComponent,
    ParameterListComponent,
    ParameterComponent,
    ModelClassPipe,
    LogBrowserComponent,
    DataComponent,
    TrainedmodelListComponent,
    ModelClassPipe,
    HelpComponent,
    ModalDialogComponent,
    AlgEditorComponent,
    ParmEditorComponent,
    DatamapEditorComponent,
    JobSchedulerComponent,
    JobSubmitterComponent,
    JobEditorComponent,
    JobStatusComponent,
    DatafileUploaderComponent,
    DatafileViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ArchwizardModule
  ],
  exports: [
    RouterModule
  ],
  providers: [ AuthService, DataService, JobService, ModelService, AdminService, OnlyLoggedInGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
