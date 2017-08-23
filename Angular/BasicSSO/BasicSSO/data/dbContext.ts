import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import { Constants } from '../constants';


export interface TokenCacheAttributes {
    userId: string;
    refreshToken: string;
    accessTokens: string;
}
export interface TokenCacheInstance extends Sequelize.Instance<TokenCacheAttributes>, TokenCacheAttributes {
}
export interface TokenCacheModel extends Sequelize.Model<TokenCacheInstance, TokenCacheAttributes> { }

export class DbContext {
    public sequelize: Sequelize.Sequelize;
    public TokenCache: TokenCacheModel;

    constructor() {
        this.init();
    }

    public sync(options?: Sequelize.SyncOptions): Promise<any> {
        return this.sequelize.sync(options);
    }

    private init() {
        this.sequelize = new Sequelize("", "", "", {
            dialect: 'sqlite',
            storage: Constants.SQLiteDB
        });


        this.TokenCache = this.sequelize.define<TokenCacheInstance, TokenCacheAttributes>('TokenCache',
            {
                userId: Sequelize.STRING,
                refreshToken: Sequelize.TEXT,
                accessTokens: Sequelize.TEXT,
            },
            {
                timestamps: false,
                tableName: "TokenCache"
            });
    }
}