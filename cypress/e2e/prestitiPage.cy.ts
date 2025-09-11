/// <reference types="cypress" />

describe("PrestitiPage Functional Test", () => {
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

        cy.visit("/prestiti");
    });

    it("mostra i dettagli dei prestiti e vantaggi", () => {
        cy.contains("Prestito Immediato").should("be.visible");
        cy.contains("Simula il tuo prestito").should("be.visible");
        cy.contains("Vantaggi del Prestito").should("be.visible");
        cy.contains("Come richiederlo").should("be.visible");
        cy.screenshot("prestiti-dettagli");
    });

    it("aggiorna la rata stimata modificando importo, durata e TAN", () => {
        cy.get("input[type='range']").eq(0).invoke("val", 6000).trigger("input"); // importo
        cy.get("input[type='range']").eq(1).invoke("val", 24).trigger("input");   // durata
        cy.get("input[type='range']").eq(2).invoke("val", 7.5).trigger("input");  // TAN

        cy.contains("Rata Mensile Stimata:").should("contain.text", "€");
        cy.screenshot("prestiti-rata-simulata");
    });

    it("apre e chiude la modal Richiedi prestito", () => {
        cy.get("button").contains("Richiedi ora").click();
        cy.get(".modal").should("be.visible");
        cy.contains("Grazie per la tua richiesta").should("be.visible");

        cy.get(".modal button").contains("Chiudi").click();
        cy.get(".modal").should("not.exist");
        cy.screenshot("prestiti-modal-chiusa");
    });
});
