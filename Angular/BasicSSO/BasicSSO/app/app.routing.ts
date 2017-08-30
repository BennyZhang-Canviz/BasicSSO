/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Login } from './login.component';

export const appRoutes: Routes = [
    { path: '**', component: Login }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);