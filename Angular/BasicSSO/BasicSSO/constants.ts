/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
export class Constants {

    public static readonly Host: string = process.env.WEBSITE_HOSTNAME as string;

    public static readonly ClientId: string = process.env.clientId as string;
    public static readonly ClientSecret: string = process.env.clientSecret as string;

    public static readonly AADInstance: string = "https://login.microsoftonline.com/";
    public static readonly Authority: string = Constants.AADInstance + "common/";
    public static readonly IdentityMetadata: string = Constants.Authority + '.well-known/openid-configuration';

    public static readonly MSGraphResource: string = "https://graph.microsoft.com";
    public static readonly AADGraphResource: string = "https://graph.windows.net";


    // Database 
    public static readonly SQLiteDB: string = process.env.SQLiteDB as string;
}

