import "express";
import { PayloadTypes } from "../generateToken";

declare module "express" {
    export interface Request {
        user?: PayloadTypes;
    }
}