// import moment from 'moment';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { IPowerplant, PowerPlant } from '@/models';
import { ApiErrors } from '@/response_builder';
import { Query } from 'app/utils/query';

class PowerPlantService {
  // * Get Power Plant Details
  public static getPlantDetails = async (
    data: IPowerplant | any
  ): Promise<IResultAndError<IPowerplant | any | null>> => {
    try {
      logger.info('==> 1:: Fetching Power plant Details');

      const criteria: any = {
        // _id: powerPlantData.powerPlantId,
        isHide: false,
        isDeleted: false,
      };

      if (data.powerPlantIds) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        criteria._id = { $in: data.powerPlantIds.split(',') };
      }

      const projection = {
        plantName: 1,
        state: 1,
        district: 1,
        city: 1,
        plantCapacity: 1,
      };

      const options = {
        lean: true,
      };
      // * query helper
      // TODO: make getOne query in query helper and replave here.
      const powerPlant = await Query.find(PowerPlant, criteria, projection, options);

      // * Check if Power plant Details fetched successfully
      if (!powerPlant) {
        logger.info('==> 2:: No Plants Found');
        return {
          result: null,
          error: ApiErrors.newNotFoundError('No Plants Found'),
        };
      }

      // * Return Response
      logger.info('==> 2:: Power Plant Details fetched Successfully');
      return { result: powerPlant, error: null };
    } catch (error) {
      logger.err(
        '# Error while fetching Power plant Details PowerPlantService.getPlantDetails()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  //   public static getPlantDateArray = (
  //     powerPlantData: IPowerPlant | any
  //   ): IResultAndError<IPowerPlant | any> => {
  //     try {
  //       let res;
  //       let err;
  //       logger.info('==> 1: fetching date strings array');
  //       const dateArr = this.getDateArrForIssueAndCommentHelper(powerPlantData);
  //       // logger.info('date array', dateArr);
  //       if (dateArr === undefined) {
  //         res = null;
  //         err = 'Reports can only be generated for 31 days.';
  //       } else if (dateArr.length) {
  //         res = dateArr;
  //         err = null;
  //         logger.info('==> 2: Date String array fetched successfully.');
  //       } else {
  //         res = null;
  //         err = 'No date string found.';
  //       }

  //       return {
  //         result: res,
  //         error: err,
  //       };
  //     } catch (error) {
  //       logger.err(
  //         '# Error while fetching plant date array PowerPlantService.getPlantDateArray()',
  //         error
  //       );
  //       const er = ApiErrors.newInternalServerError('Something went wrong');
  //       return { result: null, error: er };
  //     }
  //   };

  //   public static getDateArrForIssueAndCommentHelper = (data) => {
  //     const currentTime = new Date();
  //     let currentTimestamp: number;

  //     if (data.toDate) {
  //       const toDate = new Date(data.toDate);
  //       currentTime.setDate(toDate.getDate());
  //       currentTime.setMonth(toDate.getMonth());
  //       currentTime.setMinutes(toDate.getMinutes() + 330);
  //       currentTimestamp = currentTime.getTime();
  //     } else {
  //       currentTime.setMinutes(currentTime.getMinutes() + 330);
  //       currentTimestamp = currentTime.getTime();
  //     }

  //     const bufferTime = new Date();
  //     let bufferTimestamp: number;

  //     if (data.fromDate) {
  //       const fromDate = new Date(data.fromDate);
  //       bufferTime.setDate(fromDate.getDate());
  //       bufferTime.setMonth(fromDate.getMonth());
  //       bufferTime.setMinutes(fromDate.getMinutes() + 330);
  //       bufferTimestamp = bufferTime.getTime();
  //     } else {
  //       bufferTime.setDate(currentTime.getDate() - 5);
  //       bufferTime.setMinutes(currentTime.getMinutes());
  //       bufferTimestamp = bufferTime.getTime();
  //     }
  //     // logger.info('current', currentTime);
  //     // logger.info('current', currentTimestamp);
  //     // logger.info('buffer', bufferTime);
  //     // logger.info('buffer', bufferTimestamp);

  //     const Arr: number[] = [];
  //     const Arr2: string[] = [];

  //     const dateDiff = moment(currentTimestamp).diff(moment(bufferTimestamp), 'days');

  //     if (dateDiff < 31 && dateDiff >= 0) {
  //       for (
  //         let i = new Date(bufferTimestamp);
  //         i <= new Date(currentTimestamp);
  //         i.setDate(i.getDate() + 1)
  //       ) {
  //         const st = new Date(i);

  //         Arr.push(st.getTime());
  //         Arr2.push(this.dateString(st.getTime()));
  //       }
  //     }
  //     return [Arr, Arr2];
  //   };

  //   public static dateString = (date: number) => {
  //     const monthNames = [
  //       'Jan',
  //       'Feb',
  //       'Mar',
  //       'Apr',
  //       'May',
  //       'Jun',
  //       'Jul',
  //       'Aug',
  //       'Sep',
  //       'Oct',
  //       'Nov',
  //       'Dec',
  //     ];

  //     const newDate = new Date(date);
  //     const day = newDate.getDate();
  //     const monthIndex = newDate.getMonth();
  //     const year = newDate.getFullYear();

  //     const string = `${day}-${monthNames[monthIndex]}-${year}`;

  //     return string;
  //   };
}

export default PowerPlantService;
