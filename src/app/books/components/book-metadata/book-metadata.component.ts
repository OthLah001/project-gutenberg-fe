import { Component, Input } from '@angular/core';
import { IBookMetadata } from '../../books.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-metadata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-metadata.component.html',
  styleUrl: './book-metadata.component.scss',
})
export class BookMetadataComponent {
  @Input() metadata: IBookMetadata | null = null;
}
