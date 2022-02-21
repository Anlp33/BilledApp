/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression - AL added the expect expression
      expect(windowIcon).toHaveClass("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      //change from (a<b) to (a>b) to order list from earliest to latest
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
  // describe("When I click on new bill", () => {
  //   test("the new Bill modal should open", () => {});
  // });
});

//AL add tests:
describe("Given I am connected as Employee and I am on Bills page", () => {
  describe("When I click on the icon eye", () => {
    test("A modal should open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = BillsUI({ data: [bills[0]] });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const bills1 = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn(bills1.handleClickIconEye);
      const eye = screen.getByTestId("icon-eye");
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);

      expect(handleClickIconEye).toHaveBeenCalled();
      //code trouvé sur openWorkplace pour résoudre pb=> $.fn.modal = jest.fn();
      const modale = screen.getByTestId("modaleFileEmployee");
      expect(modale).toBeTruthy();
    });
  });
});
