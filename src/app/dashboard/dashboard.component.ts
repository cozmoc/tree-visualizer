import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../data-store.service'
import {Router} from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[DataStoreService]
})
export class DashboardComponent implements OnInit {
  w;
  private local:any;
  private previewName:string = "";
  private previewData:string = "";
  private saved=[];
	constructor(private domSanitizer:DomSanitizer,private router:Router,private DataService:DataStoreService) { this.w = window}
	private readSingleFile(e) {
    var fileName = e.target.files[0];
    if(!fileName || fileName.name.split(".")[1].toLowerCase() != 'json'){
    	alert("Choose a JSON file");
    	return;
    }
    var reader = new FileReader();
    reader.onload = file => {
      var contents: any = file.target;
      this.local = JSON.stringify({
      	"data": JSON.parse(contents.result),
      	"name": fileName.name
      })
      this.previewData = contents.result;
      this.previewName = fileName.name;
    };
    reader.readAsText(fileName);
	}
	ngOnInit() {
		this.DataService.getData((d)=>{
			this.saved = d;
		})	
  }
  private choose(i){
  	this.DataService.setLocalData(i,()=>{
			this.router.navigateByUrl('/visualizer');
  	});
  }
  private strings(d){
  	return JSON.stringify(d);
  }
  private upload(){
  	this.DataService.addData(JSON.parse(this.local),()=>{
			this.DataService.setLocalData(JSON.parse(this.local),()=>{
				this.router.navigateByUrl('/visualizer');
	  	});
  	})
  }
  private remove(i,id){
    this.DataService.remove(id,(a)=>{
      if(a){
        this.saved.splice(i,1);
      }
    });
  }
  private down(i){
    return this.domSanitizer.bypassSecurityTrustResourceUrl("data:application/json,"+encodeURIComponent(i));
  }
}
