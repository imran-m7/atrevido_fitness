import { expect } from '@playwright/test';

export class StatsCards {
    constructor(page) {
        this.page = page;
        this.cards = page.locator('.border.border-border.bg-card');
    }

    async getCardByTitle(title) {
        return this.page.getByText(title);
    }

    async expectVisible() {
        await expect(this.cards.first()).toBeVisible();
    }

    async expectMembersStatVisible() {
        await expect(this.page.getByText('Ukupno Članova')).toBeVisible();
    }

    async expectTodaySessionsVisible() {
        await expect(this.page.getByText('Današnji Treninzi')).toBeVisible();
    }
}