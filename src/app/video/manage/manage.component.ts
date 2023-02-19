import { ClipService } from './../../services/clip.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ClipService: ClipService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
    })
    this.ClipService.getUserClips().subscribe(clips => {    
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
}
