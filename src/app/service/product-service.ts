import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient:HttpClient = inject(HttpClient)
  URL:string = "https://script.google.com/macros/s/AKfycbyrF3Lsj0_sC0dbPeAGOFXbJLjJdUPahYD5InlBjVEdKxnf3mec4kjfH55aXXohULh8mw/exec"

  getProducts() {
    return this.httpClient.get(this.URL)
  }
}
