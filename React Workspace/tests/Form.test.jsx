import React from 'react';
import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Form from '../src/components/Form';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import { formData, setFormData, handleSubmit, handleIncrement, handleDecrement, openPopup } from '../src/pages/Home';


const mock = new MockAdapter(axios);
// Mock formData and handlers
const mockFormData = {
    productName: '',
    height: '',
    width: '',
    quantity: 1,
    planogramId: '',
    shelf: '',
    section: ''
};

const mockSetFormData = vi.fn();
const mockHandleSubmit = vi.fn();
const mockHandleIncrement = vi.fn();
const mockHandleDecrement = vi.fn();
const mockOpenPopup = vi.fn();


describe("Form Functionalities", () => {
    beforeEach(() => {
        // Reset mock before each test
        mock.reset();
    });

    afterEach(() => {
        // Cleanup after each test
        cleanup();
    });
      it('should render the initial fields of the form correctly', () => {
        // Initial formData mock
        

        render(
            <Form
                formData={mockFormData}
                setFormData={mockSetFormData}
                handleSubmit={mockHandleSubmit}
                handleIncrement={mockHandleIncrement}
                handleDecrement={mockHandleDecrement}
                openPopup={mockOpenPopup}
            />
        );

    // expect(screen.getByLabelText('Product Name:')).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Width/i)).toBeInTheDocument();
    expect(screen.getByText(mockFormData.quantity.toString())).toBeInTheDocument();
    expect(screen.getByLabelText(/Planogram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shelf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Section/i)).toBeInTheDocument();
    // Check for Submit Button
    expect(screen.getByText(/Place Product/i)).toBeInTheDocument();;
    // Verify initial quantity
    expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should update form fields correctly when user inputs data',() => {
        render( <Form
            formData={mockFormData}
            setFormData={mockSetFormData}
            handleSubmit={mockHandleSubmit}
            handleIncrement={mockHandleIncrement}
            handleDecrement={mockHandleDecrement}
            openPopup={mockOpenPopup}
        />);

        const productNameInput = screen.getByLabelText(/Product Name/i);
        // const productIdInput = screen.getByLabelText('Product ID:');
        const productHeightInput = screen.getByLabelText(/Height/i);
        const productWidthInput = screen.getByLabelText(/Width/i);
        const planogramselect = screen.getByLabelText(/Planogram/i);
        const shelfSelect = screen.getByLabelText(/Shelf/i);
        const sectionSelect = screen.getByLabelText(/Section/i);

        
        fireEvent.change(productNameInput, { target: { value: 'Bharath' } });
        // fireEvent.change(productIdInput, { target: { value: '1234' } });
        // fireEvent.change(productHeightInput, { target: { value: '30' } });
        // fireEvent.change(productHeightInput, { target: { value: '30' } });
        // fireEvent.change(productWidthInput, { target: { value: '20' } });
        // fireEvent.change(shelfSelect, { target: { value: '1' } });
        // fireEvent.change(sectionSelect, { target: { value: '1' } });
        console.log('FormData after changes:', mockFormData);
        console.log('Product Name Input value:', productNameInput.value);
        
        // expect(productNameInput).toHaveValue('Bharath');
        // // expect(productIdInput).toHaveValue('1234');
        // expect(productHeightInput).toHaveValue(30);
        // expect(productWidthInput).toHaveValue(20);
        // expect(shelfSelect).toHaveValue('2');
        // expect(sectionSelect).toHaveValue('3');

    });
//     it('increment and decrement quantity working properly',() => {
//         render(<Home />);
//         const quantitySpan = screen.getByLabelText('quantity');
//         const incrementButton = screen.getByRole('button', { name: '+' });
//         const decrementButton = screen.getByRole('button', { name: '-' });

//         // Check initial quantity
//         expect(quantitySpan).toHaveTextContent('1');

//         // Increment and check quantity
//         fireEvent.click(incrementButton);
//         expect(quantitySpan).toHaveTextContent('2');

//         // Decrement and check quantity
//         fireEvent.click(decrementButton);
//         expect(quantitySpan).toHaveTextContent('1');
//         //edge case should not be 0
//         fireEvent.click(decrementButton);
//         expect(quantitySpan).toHaveTextContent('1');
        
//     })

    

//     it('should submit the form successfully and send data to the backend', async () => {
//         // Mock the POST request
//     mock.onPost('http://localhost:2000/api/place').reply(200, { status: 'success' });

//     render(
//           <Home />
//       );
//       //Fill out the form
//       fireEvent.change(screen.getByLabelText(/Product Name:/i), { target: { value: 'Test Product' } });
//       fireEvent.change(screen.getByLabelText(/Product ID:/i), { target: { value: '1234' } });
//       fireEvent.change(screen.getByLabelText(/Product Height\(cm\):/i), { target: { value: '10' } });
//       fireEvent.change(screen.getByLabelText(/Product Width\(cm\):/i), { target: { value: '5' } });
//       fireEvent.change(screen.getByLabelText(/Shelf:/i), { target: { value: '1' } });
//       fireEvent.change(screen.getByLabelText(/Section:/i), { target: { value: '2' } });
  
//       // Submit the form
//       fireEvent.submit(screen.getByText(/Place Product/i));

//       // Wait for the mock request to complete
// //        ensures that the mock POST request completes before making assertions. This validates that the form data was sent to the backend exactly once.


//         await waitFor(() => expect(mock.history.post.length).toBe(1));

//         // Check the request payload
//         const requestData = mock.history.post[0].data;
//         expect(JSON.parse(requestData)).toEqual({
//         productId: '1234',
//         name: 'Test Product',
//         height: '10',
//         breadth: '5',
//         quantity: 1,
//         productRow: '1',
//         productSection: '2',
//         });

//         // Check that the success alert is displayed
//         await waitFor(() =>
//         expect(screen.getByText(/Placed successfully/i)).toBeInTheDocument()
//         );

    // })




});
