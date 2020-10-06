import {Page} from "../core/Page";
import {Excel} from "../components/excel/Excel";
import {Header} from "../components/header/Header";
import {Toolbar} from "../components/toolbar/Toolbar";
import {Formula} from "../components/formula/Formula";
import {Table} from "../components/table/Table";
import {createStore} from "../core/createStore";
import {checkStorage, debounce} from "../core/utils";
import {rootReducer} from "../redux/rootReducer";
import {normalizeInitialState} from "../redux/initial_state";

export function storageName(param) {
  return 'excel:' + param;
}

export class ExcelPage extends Page {
  getRoot() {
    const params = this.params ? this.params : Date.now().toString();

    const state = checkStorage(storageName(params));

    const store = createStore(
        rootReducer,
        normalizeInitialState(state)
    );

    const stateListener = debounce(
        (state) => {
          checkStorage(
              storageName(params),
              state
          );
        },
        300
    );

    store.subscribe(stateListener);

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRootElement();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
  }
}
