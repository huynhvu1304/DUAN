import { Component, Input } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-listcard',
  imports: [CommonModule, RouterModule],
  templateUrl: './listcard.component.html',
  styleUrl: './listcard.component.css'
})
export class ListcardComponent {
  @Input() title ="";
  @Input() data:ProductInterface[] = [];
  apiUrl: string = environment.apiUrl;
}
