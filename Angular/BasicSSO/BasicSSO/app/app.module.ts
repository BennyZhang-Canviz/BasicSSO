/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { routing } from './app.routing';
import { AuthHelper } from "./helper/authHelper";

@NgModule({
    imports: [BrowserModule, FormsModule, routing, HttpModule],
    declarations: [AppComponent, Login, Header],
    bootstrap: [AppComponent],
    providers: [
        AuthHelper
    ]
})

export class AppModule {
}