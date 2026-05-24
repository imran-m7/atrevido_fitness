import { expect } from '@playwright/test';

export class AdminDashboardPage {
    constructor(page) {
        this.page = page;

        // Header
        this.welcomeTitle = page.getByRole('heading', { name: /dobrodošli nazad/i });

        // Stats
        this.statsCards = page.locator('.border.border-border.bg-card');

        // Quick actions
        this.quickActions = page.getByRole('link');

        // Sessions
        this.sessionsSection = page.getByText('Nadolazeći Treninzi Danas');

        // Challenges
        this.challengesSection = page.getByText('Pregled Aktivnih Izazova');
    }

    async goto() {
        await this.page.goto('/admin/dashboard');
    }

    async expectDashboardLoaded() {
        await expect(this.welcomeTitle).toBeVisible();
        await expect(this.sessionsSection).toBeVisible();
        await expect(this.challengesSection).toBeVisible();
    }

    async clickQuickAction(name) {
        await this.page.getByRole('link', { name: new RegExp(name, 'i') }).click();
    }

    async expectStatsVisible() {
        await expect(this.statsCards.first()).toBeVisible();
    }

    async expectSessionsVisible() {
        await expect(this.sessionsSection).toBeVisible();
    }

    async expectChallengesVisible() {
        await expect(this.challengesSection).toBeVisible();
    }
}