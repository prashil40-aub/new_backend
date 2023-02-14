import type { Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import type { WithRequired } from 'app/types';
import { IApiError } from './api_errors';

export interface IApiResponse<T = unknown, U = unknown> {
  type?: string;
  data?: T;
  message?: string;
  status?: number;
  statusCode?: number;
  moreInfo?: U;
  success?: boolean;
  error?: IApiError;
  responseType?: string;
}

export default class ApiResponse {
  /**
   ** Generate API Response
   * @param {IApiResponse} param0
   * @returns IApiResponse
   */
  public static newResponse({
    type,
    data,
    message,
    status,
    moreInfo,
  }: IApiResponse): WithRequired<IApiResponse, 'status'> {
    const r: WithRequired<IApiResponse, 'status'> = {
      type: type || 'OK_RESPONSE',
      data,
      status: status || HttpStatusCodes.OK,
    };

    if (message) {
      r.message = message;
    }

    if (moreInfo) {
      r.moreInfo = moreInfo;
    }

    return r;
  }

  /**
   ** sends Error
   * @param {Response} res
   * @returns res
   */
  public static sendResponse(res: Response, apiRes: WithRequired<IApiResponse, 'status'>) {
    res.status(apiRes.status);
    res.json(apiRes);
    return res;
  }

  public static billingApiResponse({
    data,
    status,
  }: IApiResponse): WithRequired<IApiResponse, 'statusCode'> {
    const r: WithRequired<IApiResponse, 'statusCode'> = {
      // type: type || 'OK_RESPONSE',
      data: (data as any).result,
      statusCode: status || HttpStatusCodes.OK,
      message: 'Success',
      success: true,
    };
    return r;
  }
}
