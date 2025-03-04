import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book-content',
  standalone: true,
  imports: [],
  templateUrl: './book-content.component.html',
  styleUrl: './book-content.component.scss',
})
export class BookContentComponent {
  @Input() content: string = '';
}
