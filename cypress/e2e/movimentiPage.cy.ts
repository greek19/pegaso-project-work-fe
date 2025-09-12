/// <reference types="cypress" />

describe("MovimentiPage Functional Test", () => {
    const mockMovimentiData = {
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
    };

    const mockMovimentiPage2 = {
        contenuto: [
            { data: "2025-09-09T14:00:00", descrizione: "Prelievo ATM", importo: -30 },
            { data: "2025-09-08T16:00:00", descrizione: "Deposito contanti", importo: 200 },
        ],
        pagina: 2,
        totalePagine: 2,
        totaleElementi: 12,
    };

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

        cy.intercept("GET", `${Cypress.env("VITE_BASE_URL_BE")}/saldo`, {
            saldo: 1234.56
        }).as("getSaldo");
    });

    it("mostra la tabella dei movimenti", () => {
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`),
            mockMovimentiData
        ).as("getMovimenti");

        cy.visit("/movimenti");
        cy.wait("@getMovimenti");

        cy.get("table").should("exist");
        cy.contains("Bonifico in entrata").should("be.visible");
        cy.contains("Pagamento carta").should("be.visible");
        cy.screenshot("movimenti-tabella");
    });

    it("scarica il PDF dei movimenti", () => {
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`),
            mockMovimentiData
        ).as("getMovimenti");

        // Debug: intercetta TUTTE le richieste POST per vedere cosa succede
        cy.intercept("POST", "**", (req) => {
            console.log("POST request intercepted:", req.url);
        });

        // Intercetta la richiesta PDF con un pattern più flessibile
        cy.intercept("POST", "**/movimenti/pdf", {
            statusCode: 200,
            headers: {
                "content-type": "application/pdf",
                "content-disposition": "attachment; filename=movimenti.pdf"
            },
            // Usa una risposta più semplice
            body: "fake pdf content",
        }).as("downloadPdf");

        cy.visit("/movimenti");
        cy.wait("@getMovimenti");

        // Verifica che il pulsante esista e sia visibile
        cy.get("button").contains("Scarica PDF").should("be.visible").should("not.be.disabled");

        // Debug: controlla lo stato del componente prima del click
        cy.window().its('console').invoke('log', 'About to click PDF download button');

        cy.get("button").contains("Scarica PDF").click();

        // Aspetta un po' per vedere se la richiesta viene effettuata
        cy.wait(1000);

        // Se la richiesta non è stata effettuata, proviamo ad aspettare di più
        cy.get("body").then(() => {
            // Questo serve solo per dare tempo al test di mostrare eventuali richieste
            console.log("Checking if request was made...");
        });

        // Prova ad aspettare la richiesta ma con un timeout più lungo
        cy.wait("@downloadPdf", { timeout: 10000 });

        // Verifica che non ci siano errori visibili
        cy.get("body").should("not.contain", "Errore durante il download del PDF");
        cy.screenshot("movimenti-pdf-scaricato");
    });

    it("gestisce la paginazione", () => {
        cy.intercept("GET", /\/movimenti\?.*page=1/, mockMovimentiData).as("getMovimentiPage1");
        cy.intercept("GET", /\/movimenti\?.*page=2/, mockMovimentiPage2).as("getMovimentiPage2");

        cy.visit("/movimenti");
        cy.wait("@getMovimentiPage1");

        cy.get("a.page-link").should("exist");

        cy.get("a.page-link").contains("2").click();
        cy.wait("@getMovimentiPage2");

        cy.get("table").should("exist");
        cy.contains("Prelievo ATM").should("be.visible");
        cy.screenshot("movimenti-pagina-2");
    });

    it("mostra errore se fetch movimenti fallisce", () => {
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`), {
            statusCode: 500,
            body: { message: "Internal Server Error" }
        }).as("getMovimentiError");

        cy.visit("/movimenti");
        cy.wait("@getMovimentiError");

        cy.contains("Errore nel caricamento dei movimenti").should("be.visible");

        cy.get("table").should("not.exist");
        cy.screenshot("movimenti-errore");
    });

    it("mostra spinner durante il caricamento del PDF", () => {
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`),
            mockMovimentiData
        ).as("getMovimenti");

        // Simula un delay nel download del PDF
        cy.intercept("POST", `${Cypress.env("VITE_BASE_URL_BE")}/movimenti/pdf`, {
            statusCode: 200,
            headers: { "content-type": "application/pdf" },
            body: new Blob(['%PDF-1.4 fake pdf'], { type: 'application/pdf' }),
            delay: 2000, // 2 secondi di delay
        }).as("downloadPdfSlow");

        cy.visit("/movimenti");
        cy.wait("@getMovimenti");

        cy.get("button").contains("Scarica PDF").click();

        // Verifica che lo spinner sia visibile (Bootstrap usa .spinner-border)
        cy.get('.spinner-border', { timeout: 1000 }).should('be.visible');

        // Verifica che la tabella sia nascosta durante il caricamento
        cy.get('table').should('not.exist');

        cy.wait("@downloadPdfSlow");

        // Dopo il download lo spinner dovrebbe sparire e la tabella riapparire
        cy.get('.spinner-border').should('not.exist');
        cy.get('table').should('be.visible');
        cy.screenshot("movimenti-spinner-loading");
    });

    it("gestisce errore nel download PDF", () => {
        cy.intercept("GET", new RegExp(`${Cypress.env("VITE_BASE_URL_BE")}/movimenti`),
            mockMovimentiData
        ).as("getMovimenti");

        cy.intercept("POST", `${Cypress.env("VITE_BASE_URL_BE")}/movimenti/pdf`, {
            statusCode: 500,
            body: { message: "PDF generation failed" }
        }).as("downloadPdfError");

        cy.visit("/movimenti");
        cy.wait("@getMovimenti");

        cy.get("button").contains("Scarica PDF").click();
        cy.wait("@downloadPdfError");

        // Verifica che l'errore sia mostrato
        cy.get('[role="alert"]').contains("Errore durante il download del PDF").should("be.visible");
        cy.screenshot("movimenti-pdf-errore");
    });
});