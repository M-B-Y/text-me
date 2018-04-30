import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthenticationService {

  url: string = 'http://localhost:3000/auth/login';

  constructor(private _service: HttpClient) { }

}
