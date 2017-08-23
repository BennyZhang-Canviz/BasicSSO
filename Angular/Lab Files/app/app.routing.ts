/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Login } from './login/login.component';
import { Header } from './header/header.component';

export const appRoutes: Routes = [
    { path: 'login', component: Login },
    { path: 'header', component: Header },
    { path: '**', component: Login }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);