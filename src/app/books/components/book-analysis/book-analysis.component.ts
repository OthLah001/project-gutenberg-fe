import { Component, Input } from '@angular/core';
import { IBookAnalysis } from '../../books.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-analysis.component.html',
  styleUrl: './book-analysis.component.scss',
})
export class BookAnalysisComponent {
  @Input() analysis: IBookAnalysis | null = null;
}
