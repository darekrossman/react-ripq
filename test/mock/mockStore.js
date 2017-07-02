export default initialState => {
  return {
    getState: () => initialState || {},
    dispatch: jest.fn(action => Promise.resolve(action)),
    subscribe: () => null
  };
};
