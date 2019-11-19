import { Observable } from 'rxjs';

export interface Files {
  url: Observable<string>;
  filename: string;
}
