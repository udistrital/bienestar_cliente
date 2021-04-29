import { Injectable } from '@angular/core';
import { RequestManager } from '../../@core/managers/requestManager';

@Injectable({
  providedIn: 'root'
})
export class CustomLoginService {

  constructor(private readonly rqManager: RequestManager) { 
  }

  getRolesUser(user: any): Promise<any> {
    this.rqManager.setPath('INFO_USER');
    const userBody: any = {
      user: (user.email.split('@')).shift(),
    }
    let data = this.rqManager.post('token/userRol',userBody).toPromise();
    return data;
  }
}
