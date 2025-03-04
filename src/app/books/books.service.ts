import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBookAnalysis, IBookMetadata, ISearchHistory } from './books.types';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  getBookMetadata(gutenberg_id: number): Observable<IBookMetadata> {
    return this.http.get<IBookMetadata>(`books/${gutenberg_id}/metadata/`);
  }

  getBookContent(gutenberg_id: number): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`books/${gutenberg_id}/content/`);
  }

  getBookAnalysis(gutenberg_id: number): Observable<IBookAnalysis> {
    return this.http.get<IBookAnalysis>(`books/${gutenberg_id}/analysis/`);
  }

  getSearchHistory(): Observable<Array<ISearchHistory>> {
    return this.http.get<Array<ISearchHistory>>('books/history/');
  }
}
