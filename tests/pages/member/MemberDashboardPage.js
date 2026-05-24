import { expect } from '@playwright/test';

export class MemberDashboardPage {
    constructor(page) {
        this.page = page;

        // Header
        this.welcomeText = page.getByText(/Dobro došla nazad/i);

        // Membership banners
        this.pendingBanner = page.getByText(/Čekanje odobrenja/i);
        this.activeBanner = page.getByText(/Aktivno članstvo/i);

        // Stats
        this.membershipCard = page.getByText('Plan');
        this.weekTrainingCard = page.getByText('Treninzi ove sedmice');
        this.totalTrainingCard = page.getByText('Ukupno treninga');

        // Sections
        this.nextTrainingSection = page.getByText('Sljedeći trening');
        this.upcomingReservationsSection = page.getByText('Nadolazeće rezervacije');

        // Buttons
        this.bookTrainingButton = page.getByRole('link', { name: /Rezerviši trening/i });
        this.quickBookButton = page.getByRole('link', { name: /Rezerviši trening/i });
    }

    async goto() {
        await this.page.goto('/member/dashboard');
    }

    async expectLoaded() {
        await expect(this.welcomeText).toBeVisible();
        await expect(this.nextTrainingSection).toBeVisible();
        await expect(this.upcomingReservationsSection).toBeVisible();
    }

    async expectMembershipBanner() {
        const hasPending = await this.pendingBanner.isVisible().catch(() => false);
        const hasActive = await this.activeBanner.isVisible().catch(() => false);

        return hasPending || hasActive;
    }

    async clickBookTraining() {
        await this.bookTrainingButton.first().click();
    }
}