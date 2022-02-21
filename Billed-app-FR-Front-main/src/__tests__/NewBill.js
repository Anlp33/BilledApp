/**
 * @jest-environment jsdom
 */

import {screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
// import NewBill from "../containers/NewBill.js";

//AL added mock
import mockStore from "../__mocks__/store";
// import { get } from "express/lib/request";
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("The page should contain 'Envoyer une note de frais'", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
    // describe("when I click on the submit button", () => {
    //   test("the bill should be sent");
    // })
    //  describe(
    //    "when I'm adding uploading a file which extension is different from jpg/jpeg/png, it", () => {
    //      test("the form should display an error message and should not be sent")
    //    }
      
    //  );
  });
 
  
});
