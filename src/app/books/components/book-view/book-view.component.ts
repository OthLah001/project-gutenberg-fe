import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { BooksService } from '../../books.service';
import { IBookAnalysis, IBookMetadata } from '../../books.types';
import { BookAnalysisComponent } from '../book-analysis/book-analysis.component';
import { BookContentComponent } from '../book-content/book-content.component';

type BookViewMode = 'details' | 'content' | 'analysis';

@Component({
  selector: 'app-book-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BookContentComponent,
    BookAnalysisComponent,
  ],
  templateUrl: './book-view.component.html',
  styleUrl: './book-view.component.scss',
})
export class BookViewComponent implements OnInit, OnDestroy {
  public gutenbergId: number | null = null;
  public metadata: IBookMetadata | null = null;
  public content = '';
  public analysis: IBookAnalysis | null = null;
  public viewMode: BookViewMode = 'details';

  public isLoadingMetadata = false;
  public isLoadingContent = false;
  public isLoadingAnalysis = false;
  public isCoverLoaded = false;

  private analysisPollId: ReturnType<typeof setInterval> | null = null;
  private routeSub?: Subscription;

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;

      if (!id || Number.isNaN(id)) {
        this.router.navigate(['/books']);
        return;
      }

      if (this.gutenbergId === id) return;

      this.gutenbergId = id;
      this.resetState();
      this.loadMetadata();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.stopAnalysisPolling();
  }

  coverUrl(): string {
    return `https://www.gutenberg.org/cache/epub/${this.gutenbergId}/pg${this.gutenbergId}.cover.medium.jpg`;
  }

  authorLine(): string {
    const authors = this.metadata?.authors ?? [];
    if (!authors.length) return 'Unknown author';
    return `by ${authors.join(' • ')}`;
  }

  heroDescription(): string {
    if (this.analysis?.summary) return this.analysis.summary;
    const subjects = this.metadata?.subjects ?? [];
    if (!subjects.length) return '';
    return subjects.slice(0, 4).join(' • ');
  }

  metadataValue(items: string[] | undefined): string {
    if (!items?.length) return '—';
    return items.join(' • ');
  }

  onCoverLoaded(): void {
    this.isCoverLoaded = true;
  }

  onCoverError(): void {
    this.isCoverLoaded = true;
  }

  onReadBook(): void {
    if (!this.gutenbergId || this.isLoadingContent) return;

    if (this.content) {
      this.viewMode = 'content';
      return;
    }

    this.isLoadingContent = true;
    this.booksService
      .getBookContent(this.gutenbergId)
      .pipe(finalize(() => (this.isLoadingContent = false)))
      .subscribe({
        next: (resp) => {
          this.content = resp.content;
          this.viewMode = 'content';
        },
        error: () => {
          this.viewMode = 'details';
        },
      });
  }

  onAnalyzeBook(): void {
    if (!this.gutenbergId || this.isLoadingAnalysis) return;

    this.viewMode = 'analysis';
    this.isLoadingAnalysis = true;
    this.stopAnalysisPolling();

    const poll = () => {
      this.booksService.getBookAnalysis(this.gutenbergId as number).subscribe({
        next: (analysisResp) => {
          if (analysisResp.status === 'completed') {
            this.stopAnalysisPolling();
            this.analysis = analysisResp;
            this.isLoadingAnalysis = false;
            return;
          }

          if (
            analysisResp.status &&
            analysisResp.status !== 'in_progress' &&
            analysisResp.status !== 'pending'
          ) {
            this.stopAnalysisPolling();
            this.isLoadingAnalysis = false;
          }
        },
        error: () => {
          this.stopAnalysisPolling();
          this.isLoadingAnalysis = false;
        },
      });
    };

    poll();
    this.analysisPollId = setInterval(poll, 3000);
  }

  onShowDetails(): void {
    this.viewMode = 'details';
  }

  isReadActive(): boolean {
    return this.viewMode === 'content';
  }

  isAnalyzeActive(): boolean {
    return this.viewMode === 'analysis';
  }

  private loadMetadata(): void {
    if (!this.gutenbergId) return;

    this.isLoadingMetadata = true;
    this.booksService
      .getBookMetadata(this.gutenbergId)
      .pipe(finalize(() => (this.isLoadingMetadata = false)))
      .subscribe({
        next: (metadata) => {
          this.metadata = metadata;
        },
        error: () => {
          this.router.navigate(['/books']);
        },
      });
  }

  private resetState(): void {
    this.stopAnalysisPolling();
    this.metadata = null;
    this.content = '';
    this.analysis = null;
    this.viewMode = 'details';
    this.isCoverLoaded = false;
    this.isLoadingContent = false;
    this.isLoadingAnalysis = false;
  }

  private stopAnalysisPolling(): void {
    if (this.analysisPollId) {
      clearInterval(this.analysisPollId);
      this.analysisPollId = null;
    }
  }
}
