import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import  { resetStore } from "../store/store"
import api from "../store/api"
import FilePage from '../pages/FilePage/FilePage';
import { fileActions } from "../store/reducer/file-reducer";
import mockInvoice from './mocks/mock-invoice.json'
import mockInvoicePage from './mocks/mock-invoice-more-page.json'


console.warn = () => { }
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
      id: 1
    })
  }
});

let store;
describe('FilePage Component Test', () => {
  beforeEach(() => {
    store = resetStore();
  });

  test('renders FilePage component', () => {
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(component.container.querySelector('.file-page')).toBeVisible();
  });

  test('fetch Invoice called on page load', () => {
    const fileActionsMock = jest.spyOn(fileActions, "getInvoiceById");
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(fileActionsMock).toHaveBeenCalled();
    fileActionsMock.mockRestore();
  });

  test('expect after api called, table and paginator shown', async () => {
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(mockInvoice);
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(component.container.querySelectorAll('.el-table__row').length).toEqual(3);
      expect(component.container.querySelectorAll('.el-pager .number').length).toEqual(1);
    });
    apiGetMock.mockRestore();
  });

  test('on click of paginator, getInvoiceById Action fired', async () => {
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(mockInvoicePage);

    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(component.container.querySelectorAll('.el-pager .number').length).toEqual(5);
    });
    fireEvent.click(component.container.querySelectorAll('.el-pager .number')[2]);
    expect(apiGetMock).toHaveBeenCalledWith("/file/1", {
      params: {
        page: 2,
        query: undefined
      }
    });
    apiGetMock.mockRestore();
  });

  test('on search, getInvoiceById Action fired with query', async () => {
    jest.useFakeTimers();
    const apiGetMock = jest.spyOn(api, "get").mockReturnValue(mockInvoicePage);
    const component = render(
      <Provider store={store}><React.Fragment><FilePage /></React.Fragment></Provider>);
    expect(apiGetMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(component.container.querySelectorAll('.el-table__row').length).toEqual(3);
    });
    fireEvent.change(component.container.querySelector('.el-input input'), {target: {value: "aaa"}});
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

