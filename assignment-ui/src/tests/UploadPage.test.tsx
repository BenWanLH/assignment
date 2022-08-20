import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from "../store/store"
import UploadPage from '../pages/UploadPage/UploadPage';
import { uploadActions } from '../store/reducer/upload-reducer';
import { act } from 'react-dom/test-utils';

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

  test('upload function called when upload button pressed', async () => {
    const component = render(
      <Provider store={store}><React.Fragment><UploadPage /></React.Fragment></Provider>);
    const uploadSpy = jest.spyOn(uploadActions, 'upload');
    // fireEvent.click(screen.getByText('Upload to server'));
    act(() => {
      store.dispatch(uploadActions.setFile(new File([""], "test.csv")));
    })
    fireEvent.click(component.container.querySelector('.MuiButton-containedSuccess')!);
    expect(uploadSpy).toHaveBeenCalled()    
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

