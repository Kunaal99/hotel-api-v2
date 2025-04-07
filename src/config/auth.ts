import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
    auth: {
        ACCESS_SECRET_KEY: "9843ba29a60f38fcf07c8e759134b4dc7fba30369c3c18d7ee31aa8a2a22dd81",
        REFRESH_SECRET_KEY: "f7a9bd3a91ad2e0ea43434f0de2a4a189ab9292c878bd9a1a5f46c3e3c1e62cf",
        ACCESS_EXPIRES_IN: "15m",
        REFRESH_EXPIRES_IN: "2d",
        TOKEN_TYPE:"Bearer"
    },
};
