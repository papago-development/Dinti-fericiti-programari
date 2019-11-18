import { Interventie } from './interventie';
import { Files } from './files';

export class Patient {
  name: string;
  title: string;
  phonePacient: number;
  medic: string;
  start?: Date;
  emailPacient: string;
  files: Files[] = [];
}
