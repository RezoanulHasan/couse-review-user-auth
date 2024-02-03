/* eslint-disable @typescript-eslint/no-explicit-any */

function buildFilter(
  minPrice: string | any,
  maxPrice: string | any,
  tags: string | any,
  startDate: string,
  endDate: string | undefined,
  language: string | undefined,
  provider: string | undefined,
  durationInWeeks: string | undefined,
  level: string | undefined,
): Record<string, any> {
  const filter: Record<string, any> = {};

  if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
  if (tags) filter['tags.name'] = tags;
  if (startDate) filter.startDate = { $gte: startDate };
  if (endDate) filter.endDate = { $lte: endDate };
  if (language) filter.language = language;
  if (provider) filter.provider = provider;
  if (durationInWeeks) filter.durationInWeeks = parseInt(durationInWeeks, 10);
  if (level) filter['details.level'] = level;

  return filter;
}

function extractSortingParams(
  sortBy: string | string[] | undefined,
  sortOrder: string | undefined,
) {
  const sort: Record<string, any> = {};

  if (sortBy && typeof sortBy !== 'undefined') {
    const sortByString = Array.isArray(sortBy) ? sortBy[0] : sortBy;
    sort[sortByString] = sortOrder === 'asc' ? 1 : -1;
  }

  return sort;
}

function extractPaginationParams(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: string | string[] | any,
  limit: string | string[] | any,
) {
  const parsedPage = parseInt(page as string, 10) || 1;
  const parsedLimit = parseInt(limit as string, 10) || 10;
  return { parsedPage, parsedLimit };
}

export { buildFilter, extractSortingParams, extractPaginationParams };
