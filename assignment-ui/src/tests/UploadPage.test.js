import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from "../store/store"
import UploadPage from '../pages/UploadPage/UploadPage';
import { uploadActions } from '../store/reducer/upload-reducer';
import { act } from 'react-dom/test-utils';

console.warn= () =>{}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  })
}));

describe('Upload Component Test', () => {
  beforeEach(() => {
  });
  afterAll(() => {
    jest.clearAllMocks();
  })

  test('renders upload component', () => {
    const component = render(
      <Provider store={store}><React.Fragment><UploadPage /></React.Fragment></Provider>);
    expect(component.container.querySelector('.upload-page')).toBeVisible();
  });

  test('upload function called when upload button pressed', () => {
    const component = render(
      <Provider store={store}><React.Fragment><UploadPage /></React.Fragment></Provider>);
    const uploadSpy = jest.spyOn(uploadActions, 'upload');
    fireEvent.click(screen.getByText('upload to server'));
    expect(uploadSpy).toHaveBeenCalled();
  });

  test('on file id set, route user to filepage', () => {

    const component = render(
      <Provider store={store}><React.Fragment><UploadPage /></React.Fragment></Provider>);
    act(() =>{
      store.dispatch(uploadActions.setFileId('1'));
    })
    expect(mockHistoryPush).toHaveBeenCalledWith('/file/1');

  })

})

