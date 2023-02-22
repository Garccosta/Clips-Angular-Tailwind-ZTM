import { ClipService } from './../../services/clip.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ClipService: ClipService,
    private modal: ModalService
  ) { 
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryMap: Params) => {
      this.videoOrder = queryMap.params.sort === '2' ? queryMap.params.sort : '1'
      this.sort$.next(this.videoOrder)
    })
    this.ClipService.getUserClips(this.sort$).subscribe(clips => {    
      this.clips = []

      clips.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement)

    this.router.navigateByUrl(`/manage?sort=${value}`)
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()

    this.activeClip = clip

    this.modal.toggleModal('editClip')
  }

  update($event: IClip){
    this.clips.forEach((element, index) => {
      if(element.docID == $event.docID) {
        this.clips[index].title = $event.title
      }
    })
  }

  deleteClip($event: Event, clip: IClip){
    $event.preventDefault()

    this.ClipService.deleteClip(clip)

    this.clips.forEach((element, index) => {
      if(element.docID == clip.docID) {
        this.clips.splice(index, 1)
      }
    })
  }

}
