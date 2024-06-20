import React from 'react';
import { it, expect, describe, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Home from '../../src/pages/Home';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import '@testing-library/jest-dom/extend-expect';
// import userEvent from '@testing-library/user-event';


const mock = new MockAdapter(axios);



describe("Form Functionalities", () => {
    beforeEach(() => {
        // Reset mock before each test
        mock.reset();
        cleanup();
      });

    it('should render the initial fields of the form correctly', () => {
        render(<Home />);
        expect(screen.getByLabelText('Product Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Product ID:')).toBeInTheDocument();
        expect(screen.getByLabelText('Product Height(cm):')).toBeInTheDocument();
        expect(screen.getByLabelText('Product Width(cm):')).toBeInTheDocument();
        expect(screen.getByLabelText('quantity')).toHaveTextContent('1');
        expect(screen.getByLabelText('Shelf:')).toBeInTheDocument();
        expect(screen.getByLabelText('Section:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Place Product/i })).toBeInTheDocument();
    });

    it('should update form fields correctly when user inputs data',() => {
        render(<Home />);

        const productNameInput = screen.getByLabelText('Product Name:');
        const productIdInput = screen.getByLabelText('Product ID:');
        const productHeightInput = screen.getByLabelText('Product Height(cm):');
        const productWidthInput = screen.getByLabelText('Product Width(cm):');
        const shelfSelect = screen.getByLabelText('Shelf:');
        const sectionSelect = screen.getByLabelText('Section:');

        fireEvent.change(productNameInput, { target: { value: 'Bharath' } });
        fireEvent.change(productIdInput, { target: { value: '1234' } });
        fireEvent.change(productHeightInput, { target: { value: '30' } });
        fireEvent.change(productWidthInput, { target: { value: '20' } });
        fireEvent.change(shelfSelect, { target: { value: '2' } });
        fireEvent.change(sectionSelect, { target: { value: '3' } });

        
        expect(productNameInput).toHaveValue('Bharath');
        expect(productIdInput).toHaveValue('1234');
        expect(productHeightInput).toHaveValue(30);
        expect(productWidthInput).toHaveValue(20);
        expect(shelfSelect).toHaveValue('2');
        expect(sectionSelect).toHaveValue('3');

    });
    it('increment and decrement quantity working properly',() => {
        render(<Home />);
        const quantitySpan = screen.getByLabelText('quantity');
        const incrementButton = screen.getByRole('button', { name: '+' });
        const decrementButton = screen.getByRole('button', { name: '-' });

        // Check initial quantity
        expect(quantitySpan).toHaveTextContent('1');

        // Increment and check quantity
        fireEvent.click(incrementButton);
        expect(quantitySpan).toHaveTextContent('2');

        // Decrement and check quantity
        fireEvent.click(decrementButton);
        expect(quantitySpan).toHaveTextContent('1');
        //edge case should not be 0
        fireEvent.click(decrementButton);
        expect(quantitySpan).toHaveTextContent('1');
        
    })

    

    it('should submit the form successfully and send data to the backend', async () => {
        // Mock the POST request
    mock.onPost('http://localhost:2000/api/place').reply(200, { status: 'success' });

    render(
          <Home />
      );
      //Fill out the form
      fireEvent.change(screen.getByLabelText(/Product Name:/i), { target: { value: 'Test Product' } });
      fireEvent.change(screen.getByLabelText(/Product ID:/i), { target: { value: '1234' } });
      fireEvent.change(screen.getByLabelText(/Product Height\(cm\):/i), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/Product Width\(cm\):/i), { target: { value: '5' } });
      fireEvent.change(screen.getByLabelText(/Shelf:/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Section:/i), { target: { value: '2' } });
  
      // Submit the form
      fireEvent.submit(screen.getByText(/Place Product/i));

      // Wait for the mock request to complete
        await waitFor(() => expect(mock.history.post.length).toBe(1));

        // Check the request payload
        const requestData = mock.history.post[0].data;
        expect(JSON.parse(requestData)).toEqual({
        productId: '1234',
        name: 'Test Product',
        height: '10',
        breadth: '5',
        quantity: 1,
        productRow: '1',
        productSection: '2',
        });

        // Check that the success alert is displayed
        await waitFor(() =>
        expect(screen.getByText(/Placed successfully/i)).toBeInTheDocument()
        );

    })




});
