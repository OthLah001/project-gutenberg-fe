import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IBookAnalysis } from '../../books.types';

@Component({
  selector: 'app-book-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-analysis.component.html',
  styleUrl: './book-analysis.component.scss',
})
export class BookAnalysisComponent {
  @Input() analysis: IBookAnalysis | null = null;
  @Input() title: string | null = null;
  @Input() authors: string[] | null = null;
  @Input() issuedDate: string | null = null;
  @Input() gutenbergId: number | null = null;

  coverLoadFailed = false;

  coverUrl(): string | null {
    if (!this.gutenbergId || this.coverLoadFailed) return null;
    return `https://www.gutenberg.org/cache/epub/${this.gutenbergId}/pg${this.gutenbergId}.cover.medium.jpg`;
  }

  metadataLine(): string {
    const parts: string[] = [];
    const authors = this.authors?.filter(Boolean) ?? [];
    if (authors.length) parts.push(authors.join(' • '));
    if (this.issuedDate) parts.push(this.issuedDate);
    return parts.join(' • ');
  }

  themeTags(): string[] {
    const themes = this.analysis?.themes ?? [];
    const topics = this.analysis?.topics ?? [];
    return [...themes, ...topics];
  }

  onCoverError(): void {
    this.coverLoadFailed = true;
  }
}
