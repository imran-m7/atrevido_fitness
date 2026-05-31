import { expect } from '@playwright/test';

export class TodaySessions {
    constructor(page) {
        this.page = page;
        this.section = page.getByText('Nadolazeći Treninzi Danas');
    }

    async expectVisible() {
        await expect(this.section).toBeVisible();
    }

    async getSessions() {
        return this.page.locator('text=/Grupni|Individualni/');
    }

    async getFirstSession() {
        return this.getSessions().first();
    }

    async clickFirstSession() {
        await this.getFirstSession().click();
    }
}