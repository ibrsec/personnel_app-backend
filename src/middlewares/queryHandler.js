"use strict";


module.exports = async (req, res, next) => {
  //filter
  //search
  //skip
  //limit
  //page
  //sort

  //url?filter[key]=value
  const filter = req.query?.filter || {};

  //url?search[key]=value
  const search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  //url?limit=value
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env.DEFAULT_PAGE_SIZE || 10);

  //url?page=value
  let page = Number(req.query?.page);
  page = page > 0 ? page : 1;

  //url?skip=value
  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : (page -1) * limit;

  //url?sort=asc or desc
  const sort = req.query?.sort || null;
//   if (sort && (sort !== "asc" || sort !== "desc")) {
//     res.errorStatusCode = 400;
//     throw new Error(
//       `Invalid sort type! -[${sort}], it should be one of -> [asc, desc]`
//     );
//   }

  res.getModelList = async (Model, customFilters = {}, populate = null) => {
    return await Model.find({ ...customFilters, ...search, ...filter })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  res.getModelListDetails = async (Model,customFilters
     = {}) => {
    const data = await Model.find({ ...filter, ...search, ...customFilters });
    let details = {
      customFilters,
      filter,
      search,
      limit,
      skip,
      page,
      sort,
      pages: {
        previous: page > 1 && page <= Math.ceil(data.length / limit) ? page -1 : false,
        current : page,
        next :  page < Math.ceil(data.length / limit) ? page + 1 :  false,
        totalPages : Math.ceil(data.length / limit),
      },
      totalRecords:data.length,
    };

if(details.totalRecords <= details.limit) details.pages  = false;
    return details;
  };


  next();
};
