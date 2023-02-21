import { ClipService } from './../../services/clip.service';
import IClip from 'src/app/models/clip.model';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() activeClip: IClip | null = null 
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating clip...'
  @Output() update = new EventEmitter()

  clipID = new FormControl('', {
    nonNullable: true,
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  });

  constructor(
    private modal: ModalService,
    private clipService: ClipService
    ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(): void {
    if(!this.activeClip) {
      return
    }
    
    this.showAlert = false
    this.inSubmission = false
    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
    if(!this.activeClip){
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip...'

    try {
      await this.clipService.updateClip(
      this.clipID.value, this.title.value
      )
    } catch (error) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Please, try again later'
      return
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'
  }
}
