import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/public/LoginPage';
import { MemberDashboardPage } from '../pages/member/MemberDashboardPage';

test.describe('Member Dashboard Tests', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('member.test', 'Member123!');
    });

    test('Member dashboard loads', async ({ page }) => {
        const memberDashboard = new MemberDashboardPage(page);

        await expect(memberDashboard.dashboardTitle).toBeVisible();
    });

    test('Membership banner visible', async ({ page }) => {
        const memberDashboard = new MemberDashboardPage(page);

        await expect(memberDashboard.membershipBanner).toBeVisible();
    });

    test('Quick actions visible', async ({ page }) => {
        const memberDashboard = new MemberDashboardPage(page);

        await expect(memberDashboard.quickActionsSection).toBeVisible();
    });

    test('Navigate to booking page', async ({ page }) => {
        const memberDashboard = new MemberDashboardPage(page);

        await memberDashboard.goToBookTraining();

        await expect(page).toHaveURL(/book/);
    });

});