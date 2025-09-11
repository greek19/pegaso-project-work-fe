/// <reference types="cypress" />

describe("PolizzePage Functional Test", () => {
    beforeEach(() => {
        // Login finto
        cy.intercept("POST", "/api/auth/login", {
            statusCode: 200,
            body: { token: "fake-jwt-token" },
        }).as("loginRequest");

        cy.visit("/login");
        cy.get('input[type="text"]').type("testuser");
        cy.get('input[type="password"]').type("password123");
        cy.get('button[type="submit"]').click();
        cy.wait("@loginRequest");

        // Intercetta API polizze
        cy.intercept("GET", "/api/polizze", {
            statusCode: 200,
            body: {
                polizzeAttive: [
                    { _id: "1", nome: "Polizza Casa", tipo: "Casa", costoMensile: 50, descrizione: "Assicurazione casa" },
                    { _id: "2", nome: "Polizza Auto", tipo: "Auto", costoMensile: 70, descrizione: "Assicurazione auto" }
                ],
                polizzeDisponibili: [
                    { _id: "3", nome: "Polizza Viaggio", tipo: "Viaggio", costoMensile: 30, descrizione: "Assicurazione viaggio" },
                    { _id: "4", nome: "Polizza Salute", tipo: "Salute", costoMensile: 40, descrizione: "Assicurazione salute" }
                ]
            }
        }).as("getPolizze");

        cy.visit("/polizze");
        cy.wait("@getPolizze");
    });

    it("mostra polizze attive e totale corretto", () => {
        cy.contains("Polizza Casa").should("be.visible");
        cy.contains("Polizza Auto").should("be.visible");
        cy.contains("Totale mensile delle tue polizze attive:").should("contain.text", "€ 120");
        cy.screenshot("polizze-attive");
    });

    it("apre la modal di una polizza attiva", () => {
        cy.contains("Polizza Casa").click();
        cy.get(".modal").should("be.visible");
        cy.contains("Polizza Casa").should("be.visible");
        cy.contains("Assicurazione casa").should("be.visible");
        cy.get(".modal button").contains("Chiudi").click();
        cy.get(".modal").should("not.exist");
        cy.screenshot("modal-polizza");
    });

    it("aggiunge una polizza disponibile", () => {
        cy.intercept("POST", "/api/polizze/aggiungi", { statusCode: 200 }).as("aggiungiPolizza");

        cy.contains("Polizza Viaggio").parent().within(() => {
            cy.get("button").contains("Aggiungi").click();
        });

        cy.wait("@aggiungiPolizza");
        cy.screenshot("aggiungi-polizza");
    });

    it("rimuove una polizza attiva", () => {
        cy.intercept("DELETE", "/api/polizze/rimuovi/*", { statusCode: 200 }).as("rimuoviPolizza");

        cy.contains("Polizza Casa").parent().within(() => {
            cy.get("button").contains("Rimuovi").click();
        });

        cy.wait("@rimuoviPolizza");

        cy.on("window:alert", (text) => {
            expect(text).to.contains("Polizza rimossa con successo!");
        });

        cy.screenshot("rimuovi-polizza");
    });

    it("filtra e ordina le polizze disponibili", () => {
        cy.get("select").first().select("Viaggio");
        cy.contains("Polizza Viaggio").should("be.visible");
        cy.contains("Polizza Salute").should("not.exist");

        cy.get("select").eq(1).select("Costo decrescente");
        cy.screenshot("filtra-ordina-polizze");
    });
});
