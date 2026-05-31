import { expect } from '@playwright/test';

export class PublicNavbar {
    constructor(page) {
        this.page = page;

        // Desktop links
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.aboutLink = page.getByRole('link', { name: 'O Nama' });
        this.programsLink = page.getByRole('link', { name: 'Programi' });
        this.blogLink = page.getByRole('link', { name: 'Blog' });
        this.contactLink = page.getByRole('link', { name: 'Kontakt' });

        this.loginLink = page.getByRole('link', { name: /log in/i });
        this.registerLink = page.getByRole('link', { name: /započni/i });

        // Mobile menu
        this.mobileMenuButton = page.getByRole('button', { name: /toggle menu/i });
        this.mobileMenu = page.locator('div.md\\:hidden');
    }

    async openMobileMenu() {
        await this.mobileMenuButton.click();
    }

    async goToHome() {
        await this.homeLink.click();
    }

    async goToAbout() {
        await this.aboutLink.click();
    }

    async goToPrograms() {
        await this.programsLink.click();
    }

    async goToBlog() {
        await this.blogLink.click();
    }

    async goToContact() {
        await this.contactLink.click();
    }

    async goToLogin() {
        await this.loginLink.click();
    }

    async goToRegister() {
        await this.registerLink.click();
    }

    async expectNavbarVisible() {
        await expect(this.homeLink).toBeVisible();
        await expect(this.loginLink).toBeVisible();
        await expect(this.registerLink).toBeVisible();
    }

    async expectMobileMenuVisible() {
        await expect(this.mobileMenu).toBeVisible();
    }
}