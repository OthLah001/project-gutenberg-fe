import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../books.service';
import { ISearchHistory } from '../../books.types';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss',
})
export class HomeSearchComponent implements OnInit {
  public bookIdInput = '';
  public history: ISearchHistory[] = [];
  private loadedCoverIds = new Set<number>();

  constructor(
    private booksService: BooksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.booksService.getSearchHistory().subscribe((history) => {
      this.loadedCoverIds.clear();
      this.history = history;
    });
  }

  isCoverLoaded(gutenbergId: number): boolean {
    return this.loadedCoverIds.has(gutenbergId);
  }

  onCoverLoaded(gutenbergId: number): void {
    this.loadedCoverIds.add(gutenbergId);
  }

  onCoverError(gutenbergId: number): void {
    this.loadedCoverIds.add(gutenbergId);
  }

  onSearch(): void {
    const id = parseInt(this.bookIdInput.trim(), 10);
    if (!id || Number.isNaN(id)) return;
    this.router.navigate(['/books/view'], {
      queryParams: { id },
    });
  }

  onHistorySelect(gutenbergId: number): void {
    this.router.navigate(['/books/view'], {
      queryParams: { id: gutenbergId },
    });
  }

  coverUrl(gutenbergId: number): string {
    return `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.cover.medium.jpg`;
  }

  formatRelativeTime(searchedAt: string): string {
    const date = new Date(searchedAt);
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
