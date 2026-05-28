import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/public/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

test.describe('Admin Dashboard Tests', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('dika.admin', 'Admin123!');
    });

    test('Admin dashboard loads', async ({ page }) => {
        const adminDashboard = new AdminDashboardPage(page);

        await expect(adminDashboard.dashboardTitle).toBeVisible();
    });

    test('Stats cards are visible', async ({ page }) => {
        const adminDashboard = new AdminDashboardPage(page);

        await expect(adminDashboard.statsCards.first()).toBeVisible();
    });

    test('Quick actions section visible', async ({ page }) => {
        const adminDashboard = new AdminDashboardPage(page);

        await expect(adminDashboard.quickActionsSection).toBeVisible();
    });

    test('Navigate to members page from quick actions', async ({ page }) => {
        const adminDashboard = new AdminDashboardPage(page);

        await adminDashboard.goToMembers();

        await expect(page).toHaveURL(/members/);
    });

});