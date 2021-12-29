import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Constants } from 'src/app/utils/constants';
import { AppService } from 'src/app/utils/services/app.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  public user: any;
  public projectId = 0;
  constructor(public appService: AppService) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.USER));
    this.projectId = JSON.parse(sessionStorage.getItem(Constants.LOCAL_STORE_RESOURSES.PROJECT_ID));
    console.log(this.user);
    
  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }
}
