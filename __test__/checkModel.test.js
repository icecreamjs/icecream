import checkModel from "../src/checkModel";
import appModel from "../__mock__/appModel.mock";

describe("Model object...", () => {
  it("should not be empty", () => {
    const mockModel = {};
    expect(() => checkModel(mockModel)).toThrow(
      'Model don\'t have any key. The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}'
    );
  });
  it("should have the right structure", () => {
    const mockModel0 = {
      modelname: ""
    };
    expect(() => checkModel(mockModel0)).toThrow(
      'Model missing the key "state". The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}'
    );
    const mockModel1 = {
      modelname: "",
      state: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      'Model missing the key "reducers". The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}'
    );
    const mockModel2 = {
      modelname: "",
      state: {},
      reducers: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      'Model missing the key "effects". The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}'
    );
    const mockModel3 = {
      modelname: "",
      state: {},
      reducers: {},
      effects: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      'Model missing the key "listeners". The model must have this structure: {modelname: "", state: {}, reducers: {}, effects: {}, listeners: {}}'
    );
    expect(checkModel(appModel)).toBeTruthy();
  });
});

describe("Model Structure: modelname...", () => {
  it("should be string", () => {
    const mockModel0 = {
      modelname: 5,
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      "modelname of model must be of string type."
    );
    const mockModel1 = {
      modelname: {},
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      "modelname of model must be of string type."
    );
    const mockModel2 = {
      modelname: () => {},
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      "modelname of model must be of string type."
    );
    const mockModel3 = {
      modelname: [],
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      "modelname of model must be of string type."
    );
  });

  it("shouldn't be empty or white space", () => {
    const mockModel0 = {
      modelname: "",
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      "modelname should be a regular word, no special character, not white space and not empty"
    );
    const mockModel1 = {
      modelname: " ",
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      "modelname should be a regular word, no special character, not white space and not empty"
    );
  });
  it("should be a regular word", () => {
    const mockModel = {
      modelname: "djh3'é&$€Model",
      state: {},
      reducers: {},
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel)).toThrow(
      "modelname should be a regular word, no special character, not white space and not empty"
    );
  });
});

describe("Model Structure: State and Reducers...", () => {
  it("state can exist without a reducer", () => {
    const mockModel = {
      modelname: "app",
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
      listeners: {}
    };
    expect(checkModel(mockModel)).toBeTruthy();
  });
});

describe("Model Structure: Type of elements in object...", () => {
  it("reducers elements should be only Function", () => {
    const mockModel0 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: function*() {}
      },
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel1 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: "true"
      },
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel2 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: true
      },
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel3 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: {}
      },
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel4 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: []
      },
      effects: {},
      listeners: {}
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"active" in model "app" is not a Function.'
    );
    const mockModel5 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {}
    };
    expect(checkModel(mockModel5)).toBeTruthy();
  });
  it("effects elements should be only GeneratorFunction or speical object of GeneratorFunction", () => {
    const mockModel0 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: () => {}
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"fetch" in model "app" is not a GeneratorFunction.'
    );
    const mockModel1 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: true
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"fetch" in model "app" is not recognized as a valid value.'
    );
    const mockModel2 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: "true"
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"fetch" in model "app" is not recognized as a valid value.'
    );
    const mockModel3 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: {}
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"fetch" in model "app" is not recognized as a valid value.'
    );
    const mockModel4 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        fetch: []
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"fetch" in model "app" is not recognized as a valid value.'
    );
    const mockModel5 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        takeLatst: {}
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel5)).toThrow(
      '"takeLatst" in model "app" is not recognized as a valid value.'
    );
    const mockModel6 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        *fetch() {},
        takeLatest: {
          send() {}
        }
      },
      listeners: {}
    };
    expect(() => checkModel(mockModel6)).toThrow(
      '"send" in model "app" is not a GeneratorFunction.'
    );
    const mockModel7 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {
        *fetch() {},
        takeLatest: {
          *send() {}
        }
      },
      listeners: {}
    };
    expect(checkModel(mockModel7)).toBeTruthy();
  });
  it("listeners elements should be only Function", () => {
    const mockModel0 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        listen: true
      }
    };
    expect(() => checkModel(mockModel0)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel1 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        listen: "true"
      }
    };
    expect(() => checkModel(mockModel1)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel2 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        *listen() {}
      }
    };
    expect(() => checkModel(mockModel2)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel3 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        listen: {}
      }
    };
    expect(() => checkModel(mockModel3)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel4 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        listen: []
      }
    };
    expect(() => checkModel(mockModel4)).toThrow(
      '"listen" in model "app" is not a Function.'
    );
    const mockModel5 = {
      modelname: "app",
      state: {
        active: true
      },
      reducers: {
        active: () => {}
      },
      effects: {},
      listeners: {
        listen: () => {}
      }
    };
    expect(checkModel(mockModel5)).toBeTruthy();
  });
});
