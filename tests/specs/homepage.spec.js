import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/public/HomePage';

test.describe('Homepage Tests', () => {

    test('Home page loads successfully', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await expect(page).toHaveURL('/');
    });

    test('Hero section is visible', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await expect(homePage.heroTitle).toBeVisible();
    });

    test('Navigation to programs page works', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await homePage.goToPrograms();

        await expect(page).toHaveURL(/programs/);
    });

    test('Gallery slider next button works', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await homePage.nextGalleryImage();
    });

});