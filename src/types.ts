import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>
    req: Request & {session: any}
    res: Response
}