import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirmacion-modal',
  templateUrl: './confirmacion-modal.component.html',
  styleUrls: ['./confirmacion-modal.component.css'],
})
export class ConfirmacionModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  onConfirm() {
    this.data.actionFunction();
  }
}
