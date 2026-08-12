import type { Request, Response } from "express"
import { catchAsync } from "../../shared/error/catchAsync.js"
import { ContactService } from "./contact.service.js"
import { AppError } from "../../shared/error/appError.js";


export class ContactController {

    //SENT
    static sentRequest = catchAsync(async (req: Request, res: Response) => {

        const data = await ContactService.sendRequest(req.body);

        return res.status(201).json({ succses: true, message: "Request sent successfully", data });
    });



    //FETCH ALL
    static getAllRequests = catchAsync(async (req: Request, res: Response) => {

        const data = await ContactService.fetchAllRequests(req.query);

        return res.status(200).json({ success: true, message: "Requests fetched successfully", data });
    });


    //FETCH BY ID
    static getById = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await ContactService.fetchById(id.toString());

        return res.status(200).json({ success: true, message: "Fetched successfully", data });
    });



    //UPDATE STATUS
    static updateStatus = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const { status } = req.body;

        const data = await ContactService.updateStatus(id.toString(), status);

        return res.status(200).json({ success: true, message: "Contact updated successfully", data });
    });


    //DELETE
    static deleteContact = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await ContactService.removeMessage(id.toString());

        return res.status(200).json({ success: true, message: "Contact removed successfully", data });
    })


}