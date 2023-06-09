import type { Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { WithRequired } from 'app/types';

export enum apiErrorTypes {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  INVALID_ID = 'INVALID_ID',
}

export interface IApiError {
  type: apiErrorTypes;
  message: string;
  status: number;
  success: boolean;
}

export interface IApiBillingError<T = unknown> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: IApiError | any;
  responseType?: string;
}
export default class ApiErrors extends Error {
  /**
   ** Throws new InternalServerError
   * @param {string} message
   * @returns  IApiError
   */
  public static newInternalServerError(message: string): IApiError {
    return {
      type: apiErrorTypes.INTERNAL_SERVER_ERROR,
      message,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
    };
  }

  /**
   ** Throws new BadRequestError
   * @param {string} message
   * @returns  IApiError
   */
  public static newBadRequestError(message: string): IApiError {
    return {
      type: apiErrorTypes.BAD_REQUEST,
      message,
      status: HttpStatusCodes.BAD_REQUEST,
      success: false,
    };
  }

  /**
   ** Throws new NotFoundError
   * @param {string} message
   * @returns  IApiError
   */
  public static newNotFoundError(message: string): IApiError {
    return {
      type: apiErrorTypes.NOT_FOUND,
      message,
      status: HttpStatusCodes.NOT_FOUND,
      success: false,
    };
  }

  /**
   ** Throws new NotAuthorizedError
   * @param {string} message
   * @returns  IApiError
   */
  public static newNotAuthorizedError(message: string): IApiError {
    return {
      type: apiErrorTypes.UNAUTHORIZED,
      message,
      status: HttpStatusCodes.UNAUTHORIZED,
      success: false,
    };
  }

  /**
   ** Throws new NoAccessError
   * @param {string} message
   * @returns  IApiError
   */
  public static newNoAccessError(message: string): IApiError {
    return {
      type: apiErrorTypes.NOT_AUTHENTICATED,
      message,
      status: HttpStatusCodes.UNAUTHORIZED,
      success: false,
    };
  }

  /**
   ** sends Error
   * @param {Response} res
   * @returns res
   */
  public static sendError(res: Response, error: IApiError) {
    res.status(error.status);
    res.json(error);
    return res;
  }

  public static billingApiErrorResponse(res: Response, error: IApiError) {
    const r: WithRequired<IApiBillingError, 'statusCode'> = {
      statusCode: error.status,
      error: 'Bad Request',
      message: error.message,
      responseType: error.type,
    };

    res.status(r.statusCode);
    res.json(r);
    return res;
  }
}
