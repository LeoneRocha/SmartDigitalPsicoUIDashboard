import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminAuthGuard, AdminOrMedicalAuthGuard } from './services/auth/admin-auth-guard.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MedicalAuthGuard } from './services/auth/medical-auth-guard.service';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'authpages/login',
        pathMatch: 'full',
    },

    {
        path: 'administrative',
        component: AdminLayoutComponent,
        children: [{
            path: 'dashboard',
            canActivate: [AuthGuard],
            loadChildren: () => import('./dashboard/dashboard.module').then(x => x.DashboardModule)
        }, {
            path: 'gender',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/gender/gender.module').then(x => x.GenderModule)
        }, {
            path: 'office',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/office/office.module').then(x => x.OfficeModule)
        }, {
            path: 'rolegroup',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/rolegroup/rolegroup.module').then(x => x.RoleGroupModule)
        }, {
            path: 'specialty',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/specialty/specialty.module').then(x => x.SpecialtyModule)
        }, {
            path: 'applicationsetting',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/applicationconfigsetting/applicationconfigsetting.module').then(x => x.ApplicationConfigSettingModule)
        }, {
            path: 'applicationlanguage',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/applicationlanguage/applicationlanguage.module').then(x => x.ApplicationLanguageModule)
        }, 
        {
            path: 'notificationtemplate',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/notificationtemplate/notificationtemplate.module').then(x => x.EmailTemplateModule)
        }, {
            path: 'usermanagement',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/usermanagement/usermanagement.module').then(x => x.UserManagementModule)
        }
        ]
    },
    {
        path: 'medical',
        component: AdminLayoutComponent,
        children: [{
            path: 'manage',
            canActivate: [AuthGuard, AdminAuthGuard],
            loadChildren: () => import('./custompages/medical/medical.module').then(x => x.MedicalModule)
        }, {
            path: 'managefiles',
            canActivate: [AuthGuard, MedicalAuthGuard],
            loadChildren: () => import('./custompages/medical/medicalaccess.module').then(x => x.MedicalAccessModule)
        }
        , {
            path: 'calendar',//http://localhost:4200/medical/calendar
            canActivate: [AuthGuard, MedicalAuthGuard],
            //title: 'Calendar',//Alterar titulo da pagina
            loadChildren: () => import('./custompages/calendar/calendar.module').then(x => x.CalendarModule)
        }
        ]
    },
    {
        path: 'patient',
        component: AdminLayoutComponent,
        children: [{
            path: 'manage',
            canActivate: [AuthGuard, MedicalAuthGuard],
            loadChildren: () => import('./custompages/patient/patient.module').then(x => x.PatientModule)
        }/*, {
            path: 'usermanagement',
            canActivate: [AuthGuard],
            loadChildren: () => import('./custompages/patient/usermanagement.module').then(x => x.UserManagementModule)
        }*/
        ]
    },
    {
        path: 'pages',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'user',
                canActivate: [AuthGuard],
                loadChildren: () => import('./userpage/user.module').then(x => x.UserModule)
            }, {
                path: 'userprofile',
                //title: 'userprofile.title',
                canActivate: [AuthGuard],
                loadChildren: () => import('./custompages/userprofile/userprofile.module').then(x => x.UserProfileModule)
            }, {
                path: 'testecalendar',//http://localhost:4200/pages/testecalendar
                //title: 'userprofile.title',
                canActivate: [AuthGuard],
                loadChildren: () => import('./testpages/medicalcalendar/medical-calendar-test.module').then(x => x.MedicalCalendarTestModule)
            }
        ]
    },
    {
        path: 'authpages',
        component: AuthLayoutComponent,
        children: [{
            path: '',
            loadChildren: () => import('./pages/pages.module').then(x => x.PagesModule)
        }]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
