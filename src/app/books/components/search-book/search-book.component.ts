import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('bookDetailsContainer') private bookDetailsContainer?: ElementRef<HTMLDivElement>;

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
  public isCoverImageLoaded: boolean = false;

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.onGetSearchHistory();

    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.inputGutenbergId = Number(idParam);
      if (this.inputGutenbergId) {
        this.onSearchBook();
      }
    }
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
    this.isCoverImageLoaded = false;

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
        this.scrollToContentStart();
      });
  }

  onAnalyzeBook(): void {
    if (!this.gutenbergId) return;

    this.isLoadingAnalysis = true;
    this.showBookContent = false;

    const intervalId = setInterval(() => {
      this.booksService
        .getBookAnalysis(this.gutenbergId as number)
        .subscribe((analysisResp) => {
          if (analysisResp.status === 'completed') {
            // If the status is no longer 202, stop polling
            clearInterval(intervalId);
            this.analysis = analysisResp;
            this.isLoadingAnalysis = false;
          }
        });
    }, 3000); // Poll every 3 seconds
  }

  resetData(): void {
    this.content = '';
    this.metadata = null;
    this.analysis = null;
    this.showBookContent = false;
  }

  private scrollToContentStart(): void {
    setTimeout(() => {
      this.bookDetailsContainer?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  onCoverImageLoaded(): void {
    this.isCoverImageLoaded = true;
  }

  onCoverImageError(): void {
    this.isCoverImageLoaded = true;
  }
}
