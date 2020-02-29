import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ChatComponent } from './components/chat/chat.component';
import { ChatStartComponent } from './components/chat/chat-start/chat-start.component';
import { LeftComponent } from './components/chat/sidenavs/left/left.component';
import { ChatsComponent } from './components/chat/sidenavs/left/chats/chats.component';
import { ChatViewComponent } from './components/chat/chat-view/chat-view.component';

import { FilterPipe } from './pipes/filter.pipe';
import { GetByIdPipe } from './pipes/getById.pipe';

import { FusePerfectScrollbarDirective } from './directives/fuse-perfect-scrollbar.directive';

import { ChatService } from './services/chat.service';
import { FuseConfigService } from './services/config.service';
import { GroupComponent } from './components/chat/sidenavs/left/group/group.component';

import { DetailGroupComponent } from './components/chat/chat-view/detail-group/detail-group.component';
import { ChatDeleteComponent } from './components/chat/chat-view/chat-delete/chat-delete.component';
import { SocketIoModule } from 'ng-socket-io';
import { environment } from 'environments/environment';
import { AuthService } from 'app/protected/services/auth.service';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthModule } from '@shared/auth/auth.module';

@NgModule({
  declarations: [
    ChatComponent,
    ChatStartComponent,
    LeftComponent,
    ChatsComponent,
    ChatViewComponent,
    FilterPipe,
    GetByIdPipe,
    FusePerfectScrollbarDirective,
    GroupComponent,
    DetailGroupComponent,
    ChatDeleteComponent,
  ],
  entryComponents: [
    GroupComponent,
    DetailGroupComponent,
    ChatDeleteComponent,
  ],
  imports: [
    SharedModule,
    ChatRoutingModule,
    SocketIoModule.forRoot({ url: environment.serverWebSocket }),
    ScrollingModule,
    AuthModule.forRoot()
  ],
  exports: [
  ],
  providers: [
    ChatService,
    FuseConfigService,
    AuthService
  ]
})
export class ChatModule { }
