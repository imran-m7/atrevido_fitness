export class AdminQuickActions {
    constructor(page) {
        this.page = page;
    }

    async clickAction(name) {
        await this.page.getByRole('link', { name: new RegExp(name, 'i') }).click();
    }

    async clickTrainings() {
        await this.clickAction('Treninzi');
    }

    async clickMembers() {
        await this.clickAction('Članovima');
    }

    async clickChallenges() {
        await this.clickAction('Izazovima');
    }
}