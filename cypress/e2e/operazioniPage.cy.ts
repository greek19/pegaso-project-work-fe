/// <reference types="cypress" />

describe("Operazioni Page Functional Test", () => {
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
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti?page=1&pageSize=10`), {
            contenuto: [
                { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
            ],
            pagina: 1,
            totalePagine: 1,
            totaleElementi: 2,
        }).as("getMovimenti");

        cy.visit("/operazioni");
    });

    it("mostra tutte le operazioni con pulsanti corretti", () => {
        cy.contains("Bonifico").should("be.visible");
        cy.contains("Fondi di investimento").should("be.visible");
        cy.contains("Richiesta prestito").should("be.visible");
        cy.contains("Polizze assicurative").should("be.visible");

        cy.get("button").contains("Avvia").should("exist");
        cy.get("button").contains("Vai").should("have.length", 1);
        cy.screenshot("operazioni-cards");
    });

    it("apre la modal Bonifico e invia correttamente", () => {
        cy.intercept("POST", "/api/bonifico", {
            statusCode: 200,
        }).as("createBonifico");

        cy.get("button").contains("Avvia").click();

        cy.get("input[placeholder='Beneficiario']").type("Mario Rossi");
        cy.get("input[placeholder='IBAN']").type("IT60X0542811101000000123456");
        cy.get("input[placeholder='Importo']").type("150");
        cy.get("input[placeholder='Causale']").type("Pagamento servizi");

        cy.get("button").contains("Invia").click();

        cy.wait("@createBonifico");

        cy.on("window:alert", (text) => {
            expect(text).to.contains("Bonifico effettuato!");
        });

        cy.screenshot("bonifico-inviato");
    });

    it("gestisce errore sul bonifico", () => {
        cy.intercept("POST", "/api/bonifico", {
            statusCode: 500,
        }).as("createBonificoError");

        cy.get("button").contains("Avvia").click();

        cy.get("input[placeholder='Beneficiario']").type("Mario Rossi");
        cy.get("input[placeholder='IBAN']").type("IT60X0542811101000000123456");
        cy.get("input[placeholder='Importo']").type("150");
        cy.get("input[placeholder='Causale']").type("Pagamento servizi");

        cy.get("button").contains("Invia").click();
        cy.wait("@createBonificoError");

        cy.on("window:alert", (text) => {
            expect(text).to.contains("Errore durante il bonifico");
        });

        cy.screenshot("bonifico-errore");
    });

    it("i pulsanti Vai reindirizzano correttamente", () => {
        const redirects = [
            { label: "Fondi di investimento", url: "/fondi" },
            { label: "Richiesta prestito", url: "/prestiti" },
            { label: "Polizze assicurative", url: "/polizze" },
        ];

        redirects.forEach((r) => {
            cy.get("button").contains("Vai").contains(r.label)
                .click({ force: true });
            cy.url().should("include", r.url);
            cy.go("back");
        });

        cy.screenshot("redirect-operazioni");
    });
});
