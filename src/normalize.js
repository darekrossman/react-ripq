export default (query, schema, _results) => {
  const schemaQuery = schema[query];
  const results = schemaQuery.rootKey ? _results[schemaQuery.rootKey] : _results;

  let entities;

  if (Array.isArray(results)) {
    entities = results.reduce((acc, result, index) => {
      return {
        ...acc,
        [`${schemaQuery.entity}.${result[schemaQuery.idField || 'id']}`]: result
      };
    }, {});
  } else {
    entities = {
      [`${schemaQuery.entity}.${results[schemaQuery.idField || 'id']}`]: results
    };
  }

  const entityIds = Object.keys(entities);
  const resultIds = Array.isArray(results) ? entityIds : entityIds[0];

  return { entities, resultIds };
};
