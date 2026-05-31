import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

test.describe('Authentication Tests', () => {

    test('User can open login page', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await expect(page).toHaveURL(/login/);
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('Invalid login shows error message', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login('wronguser', 'wrongpass');

        await loginPage.expectError('Pogrešno');
    });

    test('Admin login successful', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login('dika.admin', 'Admin123!');

        await expect(page).toHaveURL(/admin/);
    });

    test('Member login successful', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login('lejla.goralija', 'Member123!');

        await expect(page).toHaveURL(/member/);
    });

    test('Navigate from login to register page', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.goToRegister();

        await expect(page).toHaveURL(/register/);
    });

    test('Register validation works for empty form', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.goto();

        await registerPage.submit();

        await registerPage.expectError('Molimo popunite sva obavezna polja');
    });

    test('Register validation detects weak password', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.goto();

        await registerPage.fillBasicInfo(
            'Test',
            'User',
            'testuser123',
            'test@test.com'
        );

        await registerPage.fillPassword('abc', 'abc');

        await registerPage.submit();

        await registerPage.expectError('Šifra mora imati najmanje 6 karaktera');
    });

});