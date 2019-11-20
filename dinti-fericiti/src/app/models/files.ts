import { Observable } from 'rxjs';

export interface Files {
  url: Observable<string | null>;
  filename: string;
}
