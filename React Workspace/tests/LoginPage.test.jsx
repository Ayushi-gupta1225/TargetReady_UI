
import React from 'react';
import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
// import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(axios);


describe('LoginPage Render', () => {

  afterEach(() => {
    cleanup();
    mock.reset();
});

  it('renders the initial login form correctly', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );
    // Check if the username input is rendered
    expect(screen.getByPlaceholderText(/Enter Username/i)).toBeInTheDocument();
    // Check if the password input is rendered
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    // Check if the login button is rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    // Check if the sign-up link is rendered
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('should update field values correctly when user inputs data', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Select the username and password input fields
    const usernameInput = screen.getByPlaceholderText(/Enter Username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);

    // Simulate user input in the username field
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    // Simulate user input in the password field
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert that the input fields now contain the correct values
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('navigates to signup page correctly on clicking Sign Up link', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    // Simulate click on Sign Up link
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Expect to navigate to /signup route
    expect(window.location.pathname).toBe('/signup');
  });

});
