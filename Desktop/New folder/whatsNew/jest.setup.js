import Adapter from "enzyme-adapter-react-16";
import "babel-polyfill";
import Enzyme, { configure } from "enzyme";

configure({ adapter: new Adapter() });
