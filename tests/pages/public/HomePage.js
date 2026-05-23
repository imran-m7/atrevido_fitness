import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;

        // Hero
        this.heroRegisterButton = page.getByRole('link', { name: /započni svoju avanturu/i });
        this.heroProgramsButton = page.getByRole('link', { name: /pregled programa/i });

        // Stats
        this.statsSection = page.locator('section').filter({ hasText: 'Aktivnih Članova' });

        // Features
        this.featuresSection = page.getByText('Zašto birati Atrevido Fitness?');

        // Testimonials
        this.testimonialSection = page.getByText('Iskustva Naših Članova');

        this.reviewButton = page.getByRole('link', { name: /pogledajte više recenzija/i });

        // CTA
        this.finalCTAButton = page.getByRole('link', { name: /započni/i });
    }

    async goto() {
        await this.page.goto('/');
    }

    async clickHeroRegister() {
        await this.heroRegisterButton.click();
    }

    async clickHeroPrograms() {
        await this.heroProgramsButton.click();
    }

    async clickFinalCTA() {
        await this.finalCTAButton.click();
    }

    async expectPageLoaded() {
        await expect(this.featuresSection).toBeVisible();
        await expect(this.testimonialSection).toBeVisible();
    }
}