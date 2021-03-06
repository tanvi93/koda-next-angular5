import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodingModuleRoutingModule } from './coding-module-routing.module';
import { SharedModuleModule } from './../shared-module/shared-module.module';

import { SpriteService } from './services/sprite.service';
import { InterpreterService } from './services/interpreter.service';
import { GameStageService } from './services/game-stage.service';

import { CodingScreenComponent } from './coding-screen/coding-screen.component';
import { BlocklyZoneComponent } from './blockly-zone/blockly-zone.component';
import { GameZoneComponent } from './game-zone/game-zone.component';
import { GamePlayScreenComponent } from './game-play-screen/game-play-screen.component';
import { GameCanvasComponent } from './game-canvas/game-canvas.component';
import { AlgoModalComponent } from './coding-screen/algo-modal/algo-modal.component';
import { FeedbackAreaComponent } from './coding-screen/feedback-area/feedback-area.component';
import { TrayAreaComponent } from './coding-screen/tray-area/tray-area.component';
import { ImagetrayComponent } from './coding-screen/tray-area/imagetray/imagetray.component';
import { ImageInsideTrayComponent } from './coding-screen/tray-area/imagetray/image-inside-tray/image-inside-tray.component';
import { ActivityTrackerService } from '../shared-services/activity-tracker.service';

@NgModule({
  imports: [
    CommonModule,
    CodingModuleRoutingModule,
    SharedModuleModule
  ],
  declarations: [CodingScreenComponent, 
    BlocklyZoneComponent, 
    GameZoneComponent, 
    GamePlayScreenComponent, 
    GameCanvasComponent, 
    AlgoModalComponent, 
    FeedbackAreaComponent,
    TrayAreaComponent,
    ImagetrayComponent,
    ImageInsideTrayComponent
  ],
  providers: [SpriteService, InterpreterService, ActivityTrackerService, GameStageService],
  entryComponents: [
    AlgoModalComponent
  ],
  exports: [
    GameCanvasComponent,
    GamePlayScreenComponent
  ]
})
export class CodingModuleModule { }
