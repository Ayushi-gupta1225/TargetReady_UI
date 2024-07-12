// signup.test.jsx
import React from 'react';
import { it, expect, describe, afterEach} from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../src/pages/SignUp';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(axios);

describe('SignUp Page Render', () => {

    afterEach(() => {
        // Cleanup after each test
        cleanup();
        mock.reset();
    });


  it('renders the initial sign up form correctly', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
    expect(screen.getByPlaceholderText(/Enter Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('monitors changes in username and password fields', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Simulate typing in the username input
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: 'testuser' }
    });
    expect(screen.getByPlaceholderText(/Enter Username/i)).toHaveValue('testuser');

    // Simulate typing in the password input
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: 'testpassword' }
    });
    expect(screen.getByPlaceholderText(/Enter Password/i)).toHaveValue('testpassword');
  });

  it('successfully registers and navigates to sign-in page', async () => {
    // Mock successful response from axios post
    mock.onPost('http://localhost:2000/auth/create-user').reply(200);

    render(
      <Router>
        <SignUp />
      </Router>
    );

    // Simulate typing in the username and password inputs
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: 'testpassword' }
    });

    // Simulate clicking on the Register button
    fireEvent.click(screen.getByText(/Register/i));

    //It navigates to login page successfully
    expect(window.location.pathname).toBe('/');


  });


});
