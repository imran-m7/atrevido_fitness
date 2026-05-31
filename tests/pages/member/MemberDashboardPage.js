import { expect } from '@playwright/test';

export class MemberDashboardPage {
    constructor(page) {
        this.page = page;

        // Header
        this.dashboardTitle = page.getByRole('heading', { name: /Dobro do.la nazad/i });
        this.welcomeText = this.dashboardTitle;

        // Membership banners
        this.membershipBanner = page.getByText(/Aktivno .lanstvo|.ekanje odobrenja/i);
        this.pendingBanner = page.getByText(/.ekanje odobrenja/i);
        this.activeBanner = page.getByText(/Aktivno .lanstvo/i);

        // Stats
        this.membershipCard = page.getByText('Plan');
        this.weekTrainingCard = page.getByText('Treninzi ove sedmice');
        this.totalTrainingCard = page.getByText('Ukupno treninga');

        // Sections
        this.nextTrainingSection = page.getByRole('heading', { name: /Sljede.i trening/i });
        this.upcomingReservationsSection = page.getByRole('heading', { name: /Nadolaze.e rezervacije/i });
        this.quickActionsSection = page.getByRole('heading', { name: /Brze akcije/i });

        // Buttons and links
        this.bookTrainingButton = page.getByRole('link', { name: /Rezervi.i trening/i });
        this.quickBookButton = this.bookTrainingButton;
        this.bookTrainingNavLink = page.getByRole('link', { name: /Rezervacija treninga/i });
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

    async goToBookTraining() {
        await this.bookTrainingNavLink.click();
    }
}
