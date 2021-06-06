import {Provider} from "react-redux";
import store from "./store";
import DishView from "./views/DishView";

function App() {
  return (
   <Provider store={store}>
     <DishView />
   </Provider>
  );
}

export default App;
