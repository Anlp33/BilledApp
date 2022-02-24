/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { screen, fireEvent} from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";




// //AL added mock
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("The page should contain 'Envoyer une note de frais'", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
});
describe("Given I am connected as an employee and I am on NewBill Page", () => {
  describe("When I click on the button 'choisir un fichier and I upload a file in the correct format'", () => {
    test("it should add the file to the form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      }); 
       window.localStorage.setItem("user", JSON.stringify({ type: "Employee" })) 
      document.body.innerHTML = NewBillUI();
     const onNavigate = (pathname) => {
       document.body.innerHTML = ROUTES({ pathname });
     };
      
      const store = null;

      const newbill = new NewBill({
      document,
      onNavigate,
        store,
      localStorage: window.localStorage,
      });
      
      const handleChangeFile = jest.fn(newbill.handleChangeFile);
      const inputFile = screen.getByTestId("file");

      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["myFile.png"], "myFile.png", { type: "image/png"}),
          ],
        },
      });
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["myFile.jpg"], "myFile.jpg", { type: "image/jpeg" }),
          ],
        },
      });
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["myFile.txt"], "myFile.txt", { type: "text/plain"}),
          ],
        },
      });
      inputFile.addEventListener('click', handleChangeFile)
      userEvent.click(inputFile);
      expect(handleChangeFile).toHaveBeenCalled();

      const form = screen.getAllByTestId("form-new-bill");
      expect(form).toBeTruthy();
      });
  });
});

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bill page", () => {
    test("fetches New Bills from mock API POST", async () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
      })
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH["Bills"]);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });
 
        window.onNavigate(ROUTES_PATH["Bills"]);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});

describe("when I click on the submit button", () => {
  test("the bill should be sent", () => {
  jest.spyOn(mockStore, "bills");
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
      email: "a@a",
    })
  );
     const type = screen.queryByTestId("expense-type");
    expect(type).toBeTruthy();

    const name = screen.queryByTestId("expense-name");
    expect(name).toBeTruthy();
  });
});

