/// <reference types="cypress" />

describe("MovimentiPage Functional Test", () => {
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
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`), {
            contenuto: [
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
            ],
            pagina: 1,
            totalePagine: 2,
            totaleElementi: 12,
        }).as("getMovimenti");

        cy.intercept("GET", "/api/movimenti/pdf", {
            statusCode: 200,
            headers: { "content-type": "application/pdf" },
            body: "fake-pdf-content",
        }).as("downloadPdf");

        cy.wait("@getMovimenti");
        cy.visit("/movimenti");
    });

    it("mostra la tabella dei movimenti", () => {
        cy.get("table").should("exist");
        cy.contains("Bonifico in entrata").should("be.visible");
        cy.contains("Pagamento carta").should("be.visible");
        cy.screenshot("movimenti-tabella");
    });

    it("scarica il PDF dei movimenti", () => {
        cy.get("button").contains("Scarica PDF").click();
        cy.wait("@downloadPdf");
        cy.screenshot("movimenti-pdf-scaricato");
    });

    it("gestisce la paginazione", () => {
        cy.get("a.page-link").contains("2").click();
        cy.wait("@getMovimenti");
        cy.get("table").should("exist");
        cy.screenshot("movimenti-pagina-2");
    });

    it("mostra errore se fetch movimenti fallisce", () => {
        cy.intercept("GET", /\/api\/movimenti\?.*/, { statusCode: 500 }).as("getMovimentiError");
        cy.visit("/movimenti");
        cy.wait("@getMovimentiError");
        cy.contains("Errore nel caricamento dei movimenti").should("be.visible");
        cy.screenshot("movimenti-errore");
    });
});
