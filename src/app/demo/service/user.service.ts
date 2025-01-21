import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../api/item';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/demo/service/api.service';

@Injectable()
export class UserService {
  
  headerData: string;

    constructor(private http: HttpClient, private apiService: ApiService) { }

}
