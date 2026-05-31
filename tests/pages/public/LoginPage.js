import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.getByRole('button', { name: /log in/i });

        this.registerLink = page.getByRole('link', { name: /registrujte se/i });

        this.errorMessage = page.locator('.text-red-600');
        this.successMessage = page.locator('.text-green-700');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async expectError(message) {
        await expect(this.errorMessage).toContainText(message);
    }

    async expectSuccessMessage() {
        await expect(this.successMessage).toBeVisible();
    }

    async goToRegister() {
        await this.registerLink.click();
    }
}