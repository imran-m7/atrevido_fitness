import { expect } from '@playwright/test';

export class ActiveChallenges {
    constructor(page) {
        this.page = page;
        this.section = page.getByText('Pregled Aktivnih Izazova');
    }

    async expectVisible() {
        await expect(this.section).toBeVisible();
    }

    async getChallenges() {
        return this.page.locator('text=/participants|Učesnici/');
    }

    async clickCreateChallenge() {
        await this.page.getByText('Kreiraj Novi Izazov').click();
    }
}