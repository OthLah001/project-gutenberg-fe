import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../books.service';
import {
  IBookAnalysis,
  IBookMetadata,
  ISearchHistory,
} from '../../books.types';
import { BookMetadataComponent } from '../book-metadata/book-metadata.component';
import { BookAnalysisComponent } from '../book-analysis/book-analysis.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { BookContentComponent } from '../book-content/book-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkScrollableModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-search-book',
  standalone: true,
  imports: [
    BookMetadataComponent,
    BookAnalysisComponent,
    FormsModule,
    CommonModule,
    BookContentComponent,
    MatSidenavModule,
  ],
  templateUrl: './search-book.component.html',
  styleUrl: './search-book.component.scss',
})
export class SearchBookComponent implements OnInit {
  public gutenbergId: number | null = null;
  public openedSidenav: boolean = false;

  public inputGutenbergId: number | null = null;
  public readBook: boolean = false;

  public content: string = '';
  public metadata: IBookMetadata | null = null;
  public analysis: IBookAnalysis | null = null;
  public history: Array<ISearchHistory> = [];

  public isLoading: boolean = false;
  public isLoadingContent: boolean = false;
  public isLoadingAnalysis: boolean = false;
  public showBookContent: boolean = false;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.onGetSearchHistory();
  }

  onGetSearchHistory(): void {
    this.booksService.getSearchHistory().subscribe((history) => {
      this.history = history;
    });
  }

  onCheckHistory(gutenbergId: number): void {
    this.inputGutenbergId = gutenbergId;
    this.onSearchBook();
  }

  onSearchBook(): void {
    if (!this.inputGutenbergId) return;

    this.resetData();
    this.gutenbergId = this.inputGutenbergId;
    this.isLoading = true;

    this.booksService
      .getBookMetadata(this.gutenbergId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((metadataResp) => {
        this.metadata = metadataResp;
        this.onGetSearchHistory();
      });
  }

  onReadBook(): void {
    if (!this.gutenbergId) return;

    this.isLoadingContent = true;
    this.booksService
      .getBookContent(this.gutenbergId)
      .pipe(finalize(() => (this.isLoadingContent = false)))
      .subscribe((contentResp) => {
        this.content = contentResp.content;
        this.showBookContent = true;
      });
  }

  onAnalyzeBook(): void {
    if (!this.gutenbergId) return;

    this.isLoadingAnalysis = true;
    this.showBookContent = false;
    this.booksService
      .getBookAnalysis(this.gutenbergId)
      .pipe(finalize(() => (this.isLoadingAnalysis = false)))
      .subscribe((analysisResp) => {
        this.analysis = analysisResp;
      });
  }

  resetData(): void {
    this.content = '';
    this.metadata = null;
    this.analysis = null;
    this.showBookContent = false;
  }
}
