import checkModel from "../src/checkModel";
import appModel from "../__mock__/appModel.mock";

const baseModel = {
  namespace: "",
  reducers: {},
  effects: {},
  subscriptions: {}
};

describe("Model object...", () => {
  it("should not be empty", () => {
    const mockModel = {};
    expect(() => checkModel(mockModel)).toThrow(
      'Model don\'t have any key. The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}'
    );
  });
  it("should have the right structure", () => {
    const mockModel0 = {
      namespace: ""
    };
    expect(() => checkModel(mockModel0)).toThrow(
      'Model missing the key "state". The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}'
    );
    const mockModel1 = {
      namespace: "",
      state: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      'Model missing the key "reducers". The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}'
    );
    const mockModel2 = {
      namespace: "",
      state: {},
      reducers: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      'Model missing the key "effects". The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}'
    );
    const mockModel3 = {
      namespace: "",
      state: {},
      reducers: {},
      effects: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      'Model missing the key "subscriptions". The model must have this structure: {namespace: "", state: {}, reducers: {}, effects: {}, subscriptions: {}}'
    );
    expect(checkModel(appModel)).toBeTruthy();
  });
});

describe("Model Structure: Namespace...", () => {
  it("should be string", () => {
    const mockModel0 = {
      namespace: 5,
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      "Namespace of model must be of string type."
    );
    const mockModel1 = {
      namespace: {},
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      "Namespace of model must be of string type."
    );
    const mockModel2 = {
      namespace: () => {},
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      "Namespace of model must be of string type."
    );
    const mockModel3 = {
      namespace: [],
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      "Namespace of model must be of string type."
    );
  });

  it("shouldn't be empty or white space", () => {
    const mockModel0 = {
      namespace: "",
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      "Namespace should be a regular word, no special character, not white space and not empty"
    );
    const mockModel1 = {
      namespace: " ",
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      "Namespace should be a regular word, no special character, not white space and not empty"
    );
  });
  it("should be a regular word", () => {
    const mockModel = {
      namespace: "djh3'é&$€Model",
      state: {},
      reducers: {},
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel)).toThrow(
      "Namespace should be a regular word, no special character, not white space and not empty"
    );
  });
});

describe("Model Structure: State and Reducers...", () => {
  it("state can exist without a reducer", () => {
    const mockModel = {
      namespace: "app",
      state: {
        active: true,
        nbUser: 150,
        notifications: 5,
        version: "1.3.5"
      },
      reducers: {
        active: (state, action) => action.active,
        nbUser: (state, action) => action.nb,
        notifications: (state, action) => state + 1
      },
      effects: {},
      subscriptions: {}
    };
    expect(checkModel(mockModel)).toBeTruthy();
  });
});

describe("Model Structure: Type of elements in object...", () => {
  it("reducers elements should be only Function", () => {
    const mockModel0 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: function*() {}
      },
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel1 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: "true"
      },
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel2 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: true
      },
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel3 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: {}
      },
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel4 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: []
      },
      effects: {},
      subscriptions: {}
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel5 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {}
    };
    expect(checkModel(mockModel5)).toBeTruthy();
  });
  it("effects elements should be only GeneratorFunction", () => {
    const mockModel0 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: () => {}
      },
      subscriptions: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel1 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: true
      },
      subscriptions: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel2 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: "true"
      },
      subscriptions: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel3 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: {}
      },
      subscriptions: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel4 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: []
      },
      subscriptions: {}
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel5 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        *fetch() {}
      },
      subscriptions: {}
    };
    expect(checkModel(mockModel5)).toBeTruthy();
  });
  it("subscriptions elements should be only Function", () => {
    const mockModel0 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        listen: true
      }
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel1 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        listen: "true"
      }
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel2 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        *listen() {}
      }
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel3 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        listen: {}
      }
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel4 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        listen: []
      }
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel5 = {
      namespace: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      subscriptions: {
        listen: () => {}
      }
    };
    expect(checkModel(mockModel5)).toBeTruthy();
  });
});
