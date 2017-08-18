import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataStoreService {
	public w;
  constructor(private http: HttpClient) {this.w = window; }
  

  getData(callback) {
    this.http.get('/api/data').subscribe(data => {
      return callback(data);
    });
  }
  addData(d,callback){
  	this.http.post('/api/data',d).subscribe(data => {
      return callback(data);
    });
  }
  setLocalData(data,callback) {
    return callback(this.w.localStorage.setItem('visualizer',JSON.stringify(data)));
  }
  getLocalData(callback){
  	return callback(JSON.parse(this.w.localStorage.getItem('visualizer')));
  }
  remove(id,callback){
    return this.http.post('/api/remove',{id:id}).subscribe(data => {
      return callback(data);
    });
  }
}
