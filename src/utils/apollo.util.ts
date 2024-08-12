import { isValidObjectId } from 'mongoose';

export function constructQuery(
  filterBy: any,
  sortBy: string | number,
  sortOrder: string
) {
  let query: any = {};
  if (filterBy) {
    if (filterBy.AND) {
      // Handle AND conditions
      query.$and = filterBy.AND.map((condition: any) => {
        return constructSubQuery(condition);
      });
    }

    if (filterBy.OR) {
      // Handle OR conditions
      query.$or = filterBy.OR.map((condition: any) => {
        return constructSubQuery(condition);
      });
    }

    // Handle individual column filters
    query = { ...query, ...constructSubQuery(filterBy) };
  }
  const sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'ASC' ? 1 : -1;
  }
  return { query, sortOptions };
}

export function constructSubQuery(condition: any) {
  const query: any = {};

  Object.entries(condition).forEach(([key, value]) => {
    if (key !== 'AND' && key !== 'OR' && isValueDefined(value)) {
      if (
        isNaN(value as any) &&
        typeof value != 'boolean' &&
        key != 'id' &&
        key != 'status' &&
        typeof value != 'object' &&
        !isValidObjectId(value)
      ) {
        query[key] = { $regex: value, $options: 'i' };
      } else if (key == 'id') {
        query['_id'] = value;
      } else {
        query[key] = value;
      }
    }
  });

  return query;
}

export function isValueDefined(value: any) {
  const res1 = value != null;
  const res2 = value != undefined;
  const res3 = typeof value == 'boolean' || value != '';
  const res4 = value != 'null';
  return res1 && res2 && res3 && res4;
}
