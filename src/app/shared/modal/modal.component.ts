import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  
  constructor(public modal: ModalService) {
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.toggleModal();
  }

}
