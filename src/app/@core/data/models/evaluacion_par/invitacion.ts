import { InvitacionTemplate } from './invitacionTemplate';

export class Invitacion {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  templateName: string;
  templateData: InvitacionTemplate;
}
