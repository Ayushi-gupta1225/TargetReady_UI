import React from 'react';
import { it, expect, describe, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Planogram from '../../src/components/Planogram';

// Mock data for one product
const mockProducts = [
    {
        productId: 1,
        name: 'Product A',
        height: 22,
        breadth: 30,
        // quantity: 2  // Adjust quantity as needed
    }
];

const mockLocations = [
    {
        locationId: 1,
        product: { productId: 1 },
        productRow: 1,      // Adjust row and section as needed
        productSection: 1,
        quantity: 2         // Adjust quantity as needed
    }
];

// Scaling factors
const scalingFactorHeight = 2.272727272727273;
const scalingFactorWidth = 3.0044444444444443;

afterEach(() => {
    cleanup();
});


describe('Planogram Functionalities', () => {


    it('should render the Initial Planogram correctly', () => {
        render(<Planogram 
            products={[]} locations={[]} scalingFactorHeight={1} scalingFactorWidth={1}
            />);
        const emptySlots = screen.getAllByText(/empty slot/i);
        // Assert that there are exactly 9 empty slots
        expect(emptySlots).toHaveLength(9);
    })


    it('Should reflect one product with variable quantity on Planogram from a mock request', () => {
        render(<Planogram
            products={mockProducts} locations={mockLocations} scalingFactorHeight={scalingFactorHeight} scalingFactorWidth={scalingFactorWidth} 
            />);

        // Check that the product-rectangle is rendered
        const productRectangles = screen.getAllByTestId('product-rectangle');
         // Use the quantity from the first location that matches the product ID
        const expectedQuantity = mockLocations
        .find(location => location.product.productId === mockProducts[0].productId)?.quantity;

        const location = mockLocations.find(loc => loc.product.productId === mockProducts[0].productId);
        const productRow = location ? location.productRow : undefined;
        const productSection = location ? location.productSection : undefined;;

        // Log the types of productRow and productSection for verification
        // console.log(typeof productRow);
        // console.log(typeof productSection);

        expect(productRectangles).toHaveLength(expectedQuantity);
        const product = mockProducts[0];
        const expectedWidthPx = product.breadth * scalingFactorWidth;
        const expectedHeightPx = product.height * scalingFactorHeight;

        productRectangles.forEach(rect => {
            expect(rect).toHaveStyle({
                width: `${expectedWidthPx}px`,
                height: `${expectedHeightPx}px`
            });
        });
            // Verify shelf position for the product
        const shelfItems = screen.getAllByTestId('shelf-item'); // Assuming shelf items are identifiable by 'shelf-item' test ID
        // expect(shelfItems).toHaveLength(9);

        // console.log(typeof(location.productRow));
        const expectedShelfIndex = ((productRow - 1) * 3 + productSection - 1);
        // const expectedShelfIndex = (1 - 1) * 3 + (1 - 1);
        // expect(expectedShelfIndex).toEqual(0);
        // // Assuming that productRectangles are contained within the correct shelf item, check their positions
        const expectedShelfItem = shelfItems[expectedShelfIndex];
        productRectangles.forEach(rect => {
            expect(expectedShelfItem).toContainElement(rect);
        });




    })
})