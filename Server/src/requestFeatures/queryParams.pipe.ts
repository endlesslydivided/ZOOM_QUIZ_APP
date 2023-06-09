import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import DBQueryParameters from './dbquery.params';
import QueryParameters from './query.params';

@Injectable()
export class QueryParamsPipe
  implements PipeTransform<QueryParameters, DBQueryParameters>
{
  transform(
    value: QueryParameters,
    metadata: ArgumentMetadata,
  ): DBQueryParameters {
    const queryObject: DBQueryParameters = {};

    if (value.limit) {
      Object.defineProperty(queryObject, 'limit', {
        value: value.limit,
        enumerable: true,
      });
    }

    if (value.page) {
      Object.defineProperty(queryObject, 'offset', {
        value: value.page * value.limit - value.limit,
        enumerable: true,
      });
    }

    return queryObject;
  }
}
