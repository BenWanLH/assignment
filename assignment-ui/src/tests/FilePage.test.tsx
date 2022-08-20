import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { resetStore } from "../store/store"
import api from "../store/api"
import FilePage from '../pages/FilePage/FilePage';
import { fileActions } from "../store/reducer/file-reducer";
import mockInvoice from './mocks/mock-invoice.json'
import mockInvoicePage from './mocks/mock-invoice-more-page.json'
import { InvoicesResponse } from '../store/model/InvoicesResponse';


jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
      id: 1
    })
  }
});

let store = resetStore();
const responseGenerator = (mockResponse: { data: InvoicesResponse }) => {
  return new Promise((resolve) => {
    resolve(mockResponse);
  })
}
describe('FilePage Component Test', () => {
  beforeEach(() => {
    store = resetStore();
  });

  test('renders FilePage component', async () => {
    // const apiGetMock = jest.spyOn(api, "get").mockReturnValue(responseGenerator(mockInvoice));
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(component!.container.querySelector('.file-page')).toBeVisible();
  });

  test('fetch Invoice called on page load', () => {
    const fileActionsMock = jest.spyOn(fileActions, "getInvoiceById");
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(fileActionsMock).toHaveBeenCalled();
    fileActionsMock.mockRestore();

  });

  test('expect after api called, table and paginator shown', async () => {
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(responseGenerator(mockInvoice));
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();

    await waitFor(() => {
      expect(component.container.querySelectorAll('tbody tr').length).toEqual(3);
      expect(component.container.querySelector('.MuiTablePagination-displayedRows')?.innerHTML).toEqual("1–3 of 3");
    });
    apiGetMock.mockRestore();
  });

  test('on click of paginator, getInvoiceById Action fired', async () => {
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(responseGenerator(mockInvoicePage));

    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(component.container.querySelector('.MuiTablePagination-displayedRows')?.innerHTML).toEqual("1–10 of 39");
    });
    fireEvent.click(component.container.querySelectorAll('button')[1]);
    expect(apiGetMock).toHaveBeenCalledWith("/file/1", {
      params: {
        page: 1,
        query: undefined
      }
    });
    apiGetMock.mockRestore();
  });

  test('on search, getInvoiceById Action fired with query', async () => {
    jest.useFakeTimers();
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(responseGenerator(mockInvoicePage));
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(component.container.querySelectorAll('tbody tr').length).toEqual(10);
    });
    fireEvent.change(component.container?.querySelector("input[type='text']") as Element, { target: { value: "aaa" } });
    jest.runAllTimers();
    expect(apiGetMock).toHaveBeenCalledWith("/file/1", {
      params: {
        page: 0,
        query: "aaa"
      }
    });
    apiGetMock.mockRestore();
    jest.useRealTimers();
  });


})

