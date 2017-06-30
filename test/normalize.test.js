import normalize from '../src/normalize';

const schema = {
  animals: {
    entity: 'animal'
  }
};

const animalsList = [{ id: 1, name: 'Tiger' }, { id: 2, name: 'Bear' }];

const normalizedAnimalsList = {
  entities: { 'animal.1': { id: 1, name: 'Tiger' }, 'animal.2': { id: 2, name: 'Bear' } },
  resultIds: ['animal.1', 'animal.2']
};

test('normalizes arrays according to schema', () => {
  const result = normalize('animals', schema, animalsList);
  expect(result).toEqual({
    entities: { 'animal.1': animalsList[0], 'animal.2': animalsList[1] },
    resultIds: ['animal.1', 'animal.2']
  });
});

test('normalizes single object according to schema', () => {
  const result = normalize('animals', schema, animalsList[0]);
  expect(result).toEqual({
    entities: { 'animal.1': animalsList[0] },
    resultIds: 'animal.1'
  });
});
