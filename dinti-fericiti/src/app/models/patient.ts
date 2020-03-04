import { PlanManopera } from './planManopera';
import { Files } from './files';

export interface Patient {
  name: string;
  title: string;
  cnp?: string;
  boli?: string;
  alergi?: string;
  phonePacient: number;
  medic: string;
  start?: Date;
  emailPacient: string;
  files: Files[];
  consimtamant?: boolean;
}
