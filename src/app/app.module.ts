import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { VariantManagerComponent } from './variant-manager/variant-manager.component';
import { AppRoutingModule } from './/app-routing.module';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';
import { VariantService } from './variant.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';

import { KeysPipe } from './keys.pipe';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { ChessUiComponent } from './chess-ui/chess-ui.component';
import { DemoComponent } from './demo/demo.component';
import { ChessNotationViewerComponent } from './chess-notation-viewer/chess-notation-viewer.component';
import { RepertoireManagerComponent } from './repertoire-manager/repertoire-manager.component';
import { TrainingComponent } from './training/training.component';
import { TrainingSessionService } from './training-session.service';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    VariantManagerComponent,
    MessagesComponent,
    KeysPipe,
    ChessboardComponent,
    ChessUiComponent,
    DemoComponent,
    ChessNotationViewerComponent,
    RepertoireManagerComponent,
    TrainingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    FileUploadModule
  ],
  providers: [AuthService, AuthGuardService, UserService, VariantService, MessageService, TrainingSessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
