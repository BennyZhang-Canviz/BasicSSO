/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHelper } from "../helper/authHelper";
import { CookieHelper } from "../helper/cookieHelper";

@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: 'header.component.template.html',
})

export class Header implements OnInit {

    @Input() isAuthenticated: boolean;

    ifShowContextMenu: boolean;
    fullName: string;

    constructor(
        private router: Router,
        private authService: AuthHelper) {
    }

    ngOnInit() {
        this.ifShowContextMenu = false;
        this.initFullName();

    }

    urlParts() {
        var parts = window.location.pathname.split('/');
        var result = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] != '')
                result.push(parts[i]);
        }
        return result;
    }

    showContextMenu() {
        let isLogin = false;
        let urlParts = this.urlParts();
        for (var i = 0; i < urlParts.length; i++) {
            if (urlParts[i].toLowerCase() == "login")
                isLogin = true;
        }
        if (isLogin)
            return;
        this.ifShowContextMenu = !(this.ifShowContextMenu);
    }

    initFullName() {
        if (this.authService.IsLogin()) {
            this.authService.getCurrentUser()
                .subscribe((user) => {
                    this.fullName = user.email;
                });
        }
    }


    doLogOff(): void {
        console.log('logOff');
        window.location.href = '/logout';
    }
}