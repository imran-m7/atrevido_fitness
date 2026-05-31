import { expect } from '@playwright/test';

export class AdminDashboardPage {
    constructor(page) {
        this.page = page;

        // Header
        this.dashboardTitle = page.getByRole('heading', { name: /dobrodo.li nazad/i });
        this.welcomeTitle = this.dashboardTitle;

        // Stats
        this.statsCards = page.getByText(/Ukupno .lanova|Dana.nji Treninzi|Prijave Ove Sedmice/i);

        // Quick actions
        this.quickActionsSection = page.getByRole('heading', { name: /Brzo Upravljanje/i });
        this.quickActions = page.getByRole('link');
        this.membersQuickAction = page.getByRole('link', { name: /Upravljanje .lanovima/i });

        // Sessions
        this.sessionsSection = page.getByRole('heading', { name: /Nadolaze.i Treninzi Danas/i });

        // Challenges
        this.challengesSection = page.getByRole('heading', { name: /Pregled Aktivnih Izazova/i });
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

    async goToMembers() {
        await this.membersQuickAction.click();
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
