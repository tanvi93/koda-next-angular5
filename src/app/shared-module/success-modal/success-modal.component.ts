import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { UtilitiesService } from './../../shared-services/utilities.service';
import { AudioService } from './../../shared-services/audio.service';
import { assetsLink } from './../../shared-services/config';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit {

  private data;
  private successmascot: string;
  private successAudio: any;
  @Input() modalData;
  @Input() gameElementModalObj;
  private scoreValue = '0';
  private gameDetails;

  constructor(public successDialog: MatDialogRef<SuccessModalComponent>, private router: Router,
    private utility: UtilitiesService, private audio: AudioService) {
    this.gameDetails = localStorage.getItem('gameProgress');
    this.gameDetails = JSON.parse(this.gameDetails);
    if (this.gameDetails) {
      this.scoreValue = this.gameDetails.pointsEarned;
    }
  }

  ngOnInit() {
    if (this.modalData) {
      this.data = this.modalData;
    } else {
      this.data = this.gameElementModalObj;
    }
    if (!this.data.popupMascotImage) {
      this.data.popupMascotImage = `${assetsLink}monkey_menace/mascot_thumbs_up_head.png`;
    }
    if (!this.data.actionButtonText) {
      this.data.actionButtonText = 'Continue';
    }
    this.audio.successSound.play();
    this.scoreValue = this.utility.getPointsForPage(this.router.url.substr(1));

  }

  buttonClicked() {
    this.successDialog.close();
    this.utility.nextPage(this.router.url.substr(1));
  }

}
