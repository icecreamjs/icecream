import iceCreamPlease from "../src/icecream";
import appModel from "../__mock__/appModel.mock";

describe("iceCreamPlease...", () => {
  test("should throw error if the object configuration miss the models key", () => {
    const mockConfig = {};
    expect(() => iceCreamPlease(mockConfig)).toThrow();
  });
  test("should throw error if the object configuration have no element in array models", () => {
    const mockConfig = { models: [] };
    expect(() => iceCreamPlease(mockConfig)).toThrow();
  });
  test('should create the key "middlewares" in object configuration if doesn\'t exist', () => {
    const mockConfig = { models: [appModel] };
    expect(mockConfig.middlewares).toBeUndefined();
    iceCreamPlease(mockConfig);
    expect(mockConfig.middlewares).toEqual([]);
  });
  test('should create the key "enhancers" in object configuration if doesn\'t exist', () => {
    const mockConfig = { models: [appModel] };
    expect(mockConfig.enhancers).toBeUndefined();
    iceCreamPlease(mockConfig);
    expect(mockConfig.enhancers).toEqual([]);
  });
  test("should return the redux store", () => {
    const mockConfig = { models: [appModel] };
    const store = iceCreamPlease(mockConfig);
    expect(typeof store).toBe("object");
  });
});
