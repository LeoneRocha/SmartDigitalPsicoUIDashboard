
//Metadata
export interface RouteInfo {
    path: string;
    id: string;
    title: string;
    type: string;
    icontype: string;
    roleaccess: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/administrative/dashboard',
    title: 'navbar.dashboard',//Inicio
    id: "dashboard",
    type: 'link',
    roleaccess: 'Medical',
    icontype: 'pe-7s-home'
},
{
    path: '/medical',
    id: "medical",
    title: 'navbar.medicals',
    type: 'sub',
    icontype: 'pe-7s-users',
    roleaccess: 'Admin',
    children: [
        { path: 'manage', title: 'navbar.medicals', ab: 'M' },
    ]
},
{
    path: '/medical/calendar',
    id: "medical-calendar",
    title: 'general.calendar.title',
    type: 'link',
    icontype: 'pe-7s-date',
    roleaccess: 'Medical' ,
}, 
{
    path: '/medical',
    id: "medical-file",
    title: 'general.file.title',
    type: 'sub',
    icontype: 'pe-7s-folder',
    roleaccess: 'Medical',
    children: [
        { path: 'managefiles', title: 'general.file.title', ab: 'F' },
    ]
},
{
    path: '/patient',
    id: "patient",
    title: 'navbar.patient',
    type: 'sub',
    icontype: 'pe-7s-users',
    roleaccess: 'Medical',
    children: [
        { path: 'manage', title: 'navbar.patient', ab: 'P' },
    ]
},
{
    path: '/administrative',
    id: "users",
    title: 'navbar.users',
    type: 'sub',
    icontype: 'pe-7s-users',
    roleaccess: 'Admin',
    children: [
        { path: 'usermanagement', title: 'navbar.users', ab: 'U' }
    ]
}, {
    path: '/administrative',
    id: "administrative",
    title: 'navbar.configurations', //'Configurações',
    type: 'sub',
    icontype: 'pe-7s-tools',
    roleaccess: 'Admin',
    children: [
        { path: 'gender', title: 'navbar.gender', ab: 'G' },
        { path: 'office', title: 'navbar.office', ab: 'O' },
        { path: 'rolegroup', title: 'navbar.rolegroup', ab: 'RG' },
        { path: 'specialty', title: 'navbar.specialty', ab: 'S' },
        { path: 'applicationsetting', title: 'navbar.applicationsetting', ab: 'CS' },
        { path: 'applicationlanguage', title: 'navbar.applicationlanguage', ab: 'I' },
    ]
} /*{
    path: '/pages',
    id: "pages",
    title: 'navbar.registers',//'Cadastros',
    type: 'sub',
    icontype: 'pe-7s-gift',
    roleaccess: 'Read',
    children: [
        { path: 'user', title: 'navbar.userpage', ab: 'UM' },
        { path: 'userprofile', title: 'navbar.userpage', ab: 'UP' },
    ]
}, */
];