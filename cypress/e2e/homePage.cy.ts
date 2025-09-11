/// <reference types="cypress" />

describe("HomePage Functional Test", () => {
    beforeEach(() => {
        cy.intercept("POST", "/api/auth/login", {
            statusCode: 200,
            body: { token: "fake-jwt-token" },
        }).as("loginRequest");
        cy.visit("/login");
        cy.get('input[type="text"]').type("testuser");
        cy.get('input[type="password"]').type("password123");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginRequest");

        cy.intercept("GET", `${Cypress.env("VITE_BASE_URL_BE")}/saldo`, { saldo: 1234.56 }).as("getSaldo");
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti\\?.*`), {
            contenuto: [
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
            ],
            pagina: 1,
            totalePagine: 1,
            totaleElementi: 2,
        }).as("getMovimenti");
    });

    it("mostra il saluto e il saldo", () => {

        cy.contains("Ciao, testuser").should("be.visible");
        cy.contains("€ 1234.56").should("be.visible");

        cy.get('button[aria-label="Mostra/Nascondi saldo"]').click();
        cy.contains("••••••").should("be.visible");

        cy.get('button[aria-label="Mostra/Nascondi saldo"]').click();
        cy.contains("€ 1234.56").should("be.visible");
    });

    it("mostra la tabella movimenti", () => {
        cy.visit("/");

        cy.contains("Bonifico in entrata").should("be.visible");
        cy.contains("Pagamento carta").should("be.visible");
        cy.get("table").should("exist");
    });

    it("link alla lista completa di movimenti funziona", () => {
        cy.visit("/");

        cy.get("a").contains("Lista movimenti completa").click();
        cy.url().should("include", "/movimenti");
    });
});
