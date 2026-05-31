import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;

        // Hero
        this.heroTitle = page.getByRole('heading', { name: /Dobrodo.li u Atrevido Fitness/i });
        this.heroRegisterButton = page.getByRole('link', { name: /zapo.ni svoju avanturu/i });
        this.heroProgramsButton = page.getByRole('link', { name: /pregled programa/i });
        this.programsLink = page.getByRole('link', { name: /^Programi$/i }).first();

        // Stats
        this.statsSection = page.locator('section').filter({ hasText: /Aktivnih .lanova/i });

        // Features
        this.featuresSection = page.getByRole('heading', { name: /Za.to birati Atrevido Fitness/i });

        // Testimonials
        this.testimonialSection = page.getByRole('heading', { name: /Iskustva na.ih .lanova/i });

        this.reviewButton = page.getByRole('link', { name: /pogledajte vi.e recenzija/i });

        // Gallery
        this.galleryNextButton = page.getByRole('button', { name: /Sljede.a slika/i });

        // CTA
        this.finalCTAButton = page.getByRole('link', { name: /zapo.ni/i }).last();
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

    async goToPrograms() {
        await this.programsLink.click();
    }

    async nextGalleryImage() {
        await this.galleryNextButton.click();
    }

    async clickFinalCTA() {
        await this.finalCTAButton.click();
    }

    async expectPageLoaded() {
        await expect(this.featuresSection).toBeVisible();
        await expect(this.testimonialSection).toBeVisible();
    }
}
