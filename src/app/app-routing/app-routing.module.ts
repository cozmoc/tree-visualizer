import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { VisualizerComponent } from '../visualizer/visualizer.component'

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'visualizer',
        component: VisualizerComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
