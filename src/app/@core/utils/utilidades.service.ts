import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';


@Injectable({
    providedIn: 'root',
})
export class UtilidadesService {

    static userArray: any[];
    static jsonArray: any[];

    constructor() {
    }

    static getSumArray(array): any {
        let sum = 0;
        array.forEach(element => {
            sum += element;
        });
        return sum;
    }

    translateTree(tree: any) {
        const trans = tree.map((n: any) => {
            let node = {};
            node = {
                id: n.Id,
                name: n.Nombre,
            }
            if (n.hasOwnProperty('Opciones')) {
                if (n.Opciones !== null) {
                    const children = this.translateTree(n.Opciones);
                    node = { ...node, ...{ children: children } };
                }
                return node;
            } else {
                return node;
            }
        });
        return trans;
    }

}
