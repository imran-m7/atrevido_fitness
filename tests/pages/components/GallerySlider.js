import { expect } from '@playwright/test';

export class GallerySlider {
    constructor(page) {
        this.page = page;

        this.nextButton = page.getByRole('button', { name: /sljedeća slika/i });
        this.prevButton = page.getByRole('button', { name: /prethodna slika/i });
        this.dots = page.locator('button[aria-label^="Slika"]');
        this.caption = page.locator('p').filter({ hasText: '/' });
    }

    async next() {
        await this.nextButton.click();
    }

    async prev() {
        await this.prevButton.click();
    }

    async goToSlide(index) {
        await this.dots.nth(index).click();
    }

    async expectSliderVisible() {
        await expect(this.nextButton).toBeVisible();
        await expect(this.prevButton).toBeVisible();
    }
}