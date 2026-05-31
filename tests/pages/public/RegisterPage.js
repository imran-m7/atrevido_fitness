import { expect } from '@playwright/test';

export class RegisterPage {
    constructor(page) {
        this.page = page;

        // Inputs
        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.username = page.locator('#username');
        this.email = page.locator('#email');
        this.phone = page.locator('#phone');
        this.password = page.locator('#password');
        this.confirmPassword = page.locator('#confirmPassword');
        this.trainingProgram = page.locator('#trainingProgram');
        this.terms = page.locator('#terms');

        // Button
        this.submitButton = page.getByRole('button', { name: /napravite profil/i });

        // Messages
        this.errorMessage = page.locator('.text-red-600');

        // Modal
        this.successModal = page.locator('text=Prijava Poslana!');
        this.modalOkButton = page.getByRole('button', { name: /ok/i });
    }

    async goto() {
        await this.page.goto('/register');
    }

    async fillBasicInfo(firstName, lastName, username, email) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.username.fill(username);

        if (email) {
            await this.email.fill(email);
        }
    }

    async fillPassword(password, confirmPassword) {
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
    }

    async fillPhone(phone) {
        await this.phone.fill(phone);
    }

    async selectProgram(programValue) {
        await this.trainingProgram.selectOption(programValue);
    }

    async acceptTerms() {
        await this.terms.check();
    }

    async submit() {
        await this.submitButton.click();
    }

    async registerUser(data) {
        await this.fillBasicInfo(data.firstName, data.lastName, data.username, data.email);
        await this.fillPassword(data.password, data.confirmPassword);
        await this.fillPhone(data.phone);
        await this.selectProgram(data.program);
        await this.acceptTerms();
        await this.submit();
    }

    async expectError(message) {
        await expect(this.errorMessage).toContainText(message);
    }

    async expectSuccessModal() {
        await expect(this.successModal).toBeVisible();
    }

    async closeModal() {
        await this.modalOkButton.click();
    }
}