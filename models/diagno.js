module.exports = {
  namespace: "diagno",
  state: {
    complaints: [],
    complaintsSelection: [], // [2,3,56, ...]
    symptoms: [],
    symptomsSelection: [], // [{complain: id, symptoms: [id, id, ...]}, {...}]
    symptomsToBeDisplayed: {}, // {[complainId]: 'always'/false/true}
    choicesSelection: [], // [ { complain: id, symptom: id, choice: { curative: false, preventive: true}}, {...}]
    choicesOrganic: [], // [{complain: id, choice: { curative: false, preventive: true}}, {...}]
    prescriptions: []
  },
  reducers: {
    reset(state) {
      return {
        complaints: state.complaints,
        complaintsSelection: [],
        symptoms: [],
        symptomsSelection: [],
        symptomsToBeDisplayed: {},
        choicesSelection: [],
        choicesOrganic: [],
        prescriptions: []
      };
    },
    complaints(state, { complaints }) {
      return { ...state, complaints: complaints };
    },
    addComplaint(state, { id }) {
      const tab = JSON.parse(JSON.stringify(state.complaintsSelection));
      tab.push(id);
      return {
        ...state,
        complaintsSelection: tab
      };
    },
    removeComplaint(state, { id }) {
      const tab = state.complaintsSelection.filter(i => i !== id);
      return {
        ...state,
        complaintsSelection: tab
      };
    },
    symptoms(state, { symptoms }) {
      return { ...state, symptoms };
    },
    addSymptom(state, { idComplain, idSymptom, typeChoice }) {
      const tab = JSON.parse(JSON.stringify(state.symptomsSelection));
      let tabChoices = JSON.parse(JSON.stringify(state.choicesSelection));
      let newSymptom = true;
      tab.forEach(e => {
        if (e.complain === idComplain) {
          if (typeChoice === 0) {
            // Type de choix "+/-"
            if (!e.symptoms.includes(idSymptom)) {
              e.symptoms.push(idSymptom);
            }
          } else if (typeChoice === 2) {
            // Type de choix "OU"
            e.symptoms = [];
            tabChoices = state.choicesSelection.filter(
              c => c.complain !== idComplain && c.symptom !== idSymptom
            );
            e.symptoms.push(idSymptom);
          } else if (typeChoice === 1) {
            // Type de choix "+/-"
            if (!e.symptoms.includes(idSymptom)) {
              e.symptoms.push(idSymptom);
            }
          }
          newSymptom = false;
        }
      });
      if (newSymptom) {
        tab.push({ complain: idComplain, symptoms: [idSymptom] });
      }
      return {
        ...state,
        symptomsSelection: tab,
        choicesSelection: tabChoices
      };
    },
    removeSymptom(state, { idComplain, idSymptom }) {
      const tab = JSON.parse(JSON.stringify(state.symptomsSelection));
      const tabChoices = JSON.parse(JSON.stringify(state.choicesSelection));
      tab.forEach(e => {
        if (e.complain === idComplain) {
          const spms = e.symptoms.filter(i => i !== idSymptom);
          e.symptoms = spms;
        }
      });

      let index = false;
      tabChoices.forEach((c, i) => {
        if (c.complain === idComplain && c.symptom === idSymptom) {
          index = i;
        }
      });
      if (index) {
        tabChoices.splice(index, 1);
      }

      return {
        ...state,
        symptomsSelection: tab,
        choicesSelection: tabChoices
      };
    },
    symptomsSelection(state, { symptomsSelection }) {
      return {
        ...state,
        symptomsSelection
      };
    },
    symptomsToBeDisplayed(state, { symptomsToBeDisplayed }) {
      return {
        ...state,
        symptomsToBeDisplayed
      };
    },
    displaySymptomsOfComplain(state, { id, display }) {
      const tab = JSON.parse(JSON.stringify(state.symptomsToBeDisplayed));
      const tabChoices = JSON.parse(JSON.stringify(state.choicesOrganic));
      if (typeof tab[id] !== "undefined" || tab[id] !== null) {
        tab[id] = display;
      }

      tabChoices.forEach(c => {
        if (c.complain === id) {
          c.choice["preventive"] = !display;
          c.choice["curative"] = display;
        }
      });

      return {
        ...state,
        symptomsToBeDisplayed: tab,
        choicesOrganic: tabChoices
      };
    },
    choicesOrganic(state, { choicesOrganic }) {
      return {
        ...state,
        choicesOrganic
      };
    },
    choicesByDefault(state, { choicesSelection }) {
      return {
        ...state,
        choicesSelection
      };
    },
    choicesSelection(state, { idComplain, id, item }) {
      const tab = JSON.parse(JSON.stringify(state.choicesSelection));
      let newChoice = true;
      tab.forEach(e => {
        if (e.complain === idComplain && e.symptom === id) {
          // Type de choix "OU"
          Object.keys(e.choice).forEach(key => {
            e.choice[key] = false;
          });
          e.choice[item] = !e.choice[item];
          newChoice = false;
        }
      });
      if (newChoice) {
        tab.push({
          complain: idComplain,
          symptom: id,
          choice: { [item]: true }
        });
      }
      return {
        ...state,
        choicesSelection: tab
      };
    },
    prescriptions(state, { prescriptions }) {
      return {
        ...state,
        prescriptions
      };
    }
  },
  effects: {
    *startDiagnostic(_, { put, call, select }) {
      const { complaints } = yield select(state => state.diagno);
      if (complaints.length === 0) {
        const res = yield call(DiagnoService.getComplaints, "");
        if (res.status === "success") {
          yield put({ type: "complaints", complaints: res.data });
          yield put({ type: "app/activeNextButton", active: false });
          router.push("/");
        } else {
          if (res.data === "UnAuthorized") {
            yield put({
              type: "error",
              error: { status: true, data: res.data }
            });
            yield put({ type: "auth/logout" });
          }
        }
      }
    },
    *manageComplaint({ id, selected }, { put, call, select }) {
      if (!selected) {
        yield put({ type: "addComplaint", id });
      } else {
        yield put({ type: "removeComplaint", id });
      }

      const { complaintsSelection } = yield select(state => state.diagno);

      if (complaintsSelection.length > 0) {
        yield put({ type: "app/activeNextButton", active: true });
      } else {
        yield put({ type: "app/activeNextButton", active: false });
      }
    },
    *startSymptoms(_, { put, call, select }) {
      const { complaintsSelection } = yield select(state => state.diagno);
      if (complaintsSelection.length > 0) {
        const res = yield call(DiagnoService.sendComplaints, {
          complaints: complaintsSelection
        });
        if (res.status === "success") {
          yield put({ type: "symptoms", symptoms: res.data });
          const { complaints } = res.data;
          let empty = true;
          let symptomByDefault = [];
          let symptomsToBeDisplayed = {};

          complaints.forEach(complaint => {
            // We test if there is symptom to display, if not, we let the big button active
            if (complaint.symptoms.filter(s => !s.is_organic).length > 0)
              empty = false;
            // If there is a intermediate step, we registered it
            if (
              complaint.symptoms.filter(
                s => s.type === 1 && Object.keys(s.choice).length > 0
              ).length > 0
            ) {
              symptomsToBeDisplayed[complaint.id] = false;
            } else {
              symptomsToBeDisplayed[complaint.id] = "always";
            }

            // We test if there is organic symptom to select by default
            complaint.symptoms.forEach(s => {
              if (s.is_organic) {
                // We add the symptom by defaut
                if (symptomByDefault.length > 0) {
                  let alreadyThere = false;
                  symptomByDefault.forEach(sd => {
                    if (sd.complain === complaint.id) {
                      alreadyThere = true;
                      sd.symptoms.push(s.id);
                    }
                  });
                  if (!alreadyThere)
                    symptomByDefault.push({
                      complain: complaint.id,
                      symptoms: [s.id]
                    });
                } else {
                  symptomByDefault.push({
                    complain: complaint.id,
                    symptoms: [s.id]
                  });
                }
              }
            });
          });
          // We add to the state the global choice for the organic symptoms if there is some
          const choicesOrganic = [];
          symptomByDefault.forEach(s => {
            let alreadyThere = false;
            choicesOrganic.forEach(c => {
              if (s.complain === c.complain) alreadyThere = true;
            });
            if (!alreadyThere) {
              choicesOrganic.push({
                complain: s.complain,
                choice: { preventive: true, curative: false }
              });
            }
          });
          yield put({
            type: "choicesOrganic",
            choicesOrganic
          });
          yield put({
            type: "symptomsToBeDisplayed",
            symptomsToBeDisplayed
          });
          yield put({
            type: "symptomsSelection",
            symptomsSelection: symptomByDefault
          });

          if (!empty && symptomByDefault.length === 0) {
            yield put({ type: "app/activeNextButton", active: false });
          }
          router.push("/symptoms");
        } else {
          if (res.data === "UnAuthorized") {
            yield put({
              type: "error",
              error: { status: true, data: res.data }
            });
            yield put({ type: "auth/logout" });
          }
        }
      }
    },
    *manageSymptom(
      { idComplain, id: idSymptom, selected, typeChoice },
      { put, call, select }
    ) {
      // If not by default:
      if (!selected) {
        yield put({ type: "addSymptom", idComplain, idSymptom, typeChoice });
      } else {
        yield put({ type: "removeSymptom", idComplain, idSymptom });
      }

      const { symptomsSelection } = yield select(state => state.diagno);
      let selectionEmpty = true;
      symptomsSelection.forEach(complain => {
        if (complain.symptoms.length > 0) selectionEmpty = false;
      });

      if (!selectionEmpty) {
        yield put({ type: "app/activeNextButton", active: true });
      } else {
        yield put({ type: "app/activeNextButton", active: false });
      }
    },
    *displayPrescription(_, { put, call, select }) {
      const {
        symptomsSelection,
        choicesSelection,
        symptoms,
        choicesOrganic
      } = yield select(state => state.diagno);

      const data = [];

      symptomsSelection.forEach(o => {
        const { complain: idComplaint, symptoms: symptomsSelected } = o;
        if (symptomsSelected.length > 0) {
          let complaint_name = "";
          const symptomArray = [];
          symptomsSelected.forEach(sID => {
            symptoms.complaints.forEach(complaint => {
              complaint.symptoms.forEach(s => {
                // We set the right options for every symptoms
                if (sID === s.id && idComplaint === complaint.id) {
                  complaint_name = complaint.complaint_name;
                  // If the symptom is organic and have choice, we set it up with the organic choice
                  if (s.is_organic && Object.keys(s.choice).length > 0) {
                    choicesOrganic.forEach(organicChoice => {
                      if (complaint.id === organicChoice.complain) {
                        s.choice = organicChoice.choice;
                      }
                    });
                  } else {
                    // If the symptom is not organic, we set it own choice
                    choicesSelection.forEach(choiceSelect => {
                      if (
                        complaint.id === choiceSelect.complain &&
                        choiceSelect.symptom === sID
                      ) {
                        Object.keys(s.choice).forEach(name => {
                          if (choiceSelect.choice[name]) {
                            s.choice[name] = true;
                          } else {
                            s.choice[name] = false;
                          }
                        });
                      }
                    });
                  }
                  symptomArray.push(s);
                }
              });
            });
          });
          if (complaint_name && symptomArray.length > 0) {
            data.push({
              id: idComplaint,
              complaint_name: complaint_name,
              symptoms: symptomArray
            });
          }
        }
      });

      const res = yield call(DiagnoService.sendSymptoms, { s: data });
      if (res) {
        const prescriptions = [];
        res.forEach(p => {
          const prescription = {};
          prescription.complaint_name = p.complaint_name;
          prescription.id = p.id;
          const symptomsTab = [];
          p.symptoms.forEach(symptom => {
            if (symptom.medics) symptomsTab.push(symptom);
          });
          prescription.symptoms = symptomsTab;
          prescriptions.push(prescription);
        });
        yield put({ type: "prescriptions", prescriptions: prescriptions });
        yield put({ type: "app/activeNextButton", active: true });
        router.push("/prescriptions");
      } else {
        if (res.data === "UnAuthorized") {
          yield put({ type: "error", error: { status: true, data: res.data } });
          yield put({ type: "auth/logout" });
        }
      }
    },
    *resetDiagno(_, { put, call, select }) {
      yield put({ type: "reset" });
      yield put({ type: "app/activeNextButton", active: false });
      router.push("/");
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
