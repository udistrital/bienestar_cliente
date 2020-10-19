import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeEstudianteComponent} from './home-estudiante/home-estudiante.component';
import {ReliquidacionMatriculaComponent} from './reliquidacion-matricula/reliquidacion-matricula.component';
import {DescuentoElectoralComponent} from './descuento-electoral/descuento-electoral.component';
import {DocumentosComponent} from './documentos/documentos.component';
import {ListaEstudiantesReliquidacionComponent} from './lista-estudiantes-reliquidacion/lista-estudiantes-reliquidacion.component';
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';

let routes: Routes;
routes = [
    {
        path: 'home-estudiante',
        canActivate: [AuthGuard, AdminGuard],
        component: HomeEstudianteComponent,
    },
    {
        path: 'reliquidacion-matricula',
        canActivate: [AuthGuard, AdminGuard],
        component: ReliquidacionMatriculaComponent,
    },
    {
        path: 'descuento-electoral',
        canActivate: [AuthGuard, AdminGuard],
        component: DescuentoElectoralComponent,
    },
    {
        path: 'documentos',
        canActivate: [AuthGuard, AdminGuard],
        component: DocumentosComponent,
    },
    {
        path: 'lista-estudiantes-reliquidacion',
        canActivate: [AdminGuard],
        component: ListaEstudiantesReliquidacionComponent,
    },
    {
        path: '',
        redirectTo: 'home-estudiante',
        canActivate: [AuthGuard, AdminGuard],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReliquidacionRoutingModule {
}

export const routedComponents = [
    ListaEstudiantesReliquidacionComponent,
];

