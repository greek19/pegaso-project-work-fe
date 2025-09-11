/// <reference types="cypress" />

describe("FondiPage Functional Test", () => {
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

        cy.intercept("GET", "/api/fondi", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    nome: "Fondo A",
                    descrizione: "Descrizione Fondo A",
                    tipoAttivo: "Azionario",
                    rendimento1anno: 5.5,
                    investimentoMinimo: 1000,
                    sfdrLevel: "6",
                    performance: [1000, 1100, 1200, 1300, 1400]
                },
                {
                    id: 2,
                    nome: "Fondo B",
                    descrizione: "Descrizione Fondo B",
                    tipoAttivo: "Obbligazionario",
                    rendimento1anno: 3.2,
                    investimentoMinimo: 500,
                    sfdrLevel: "7",
                    performance: [500, 520, 540, 560, 580]
                }
            ]
        }).as("getFondi");

        cy.wait("@getFondi");
        cy.visit("/fondi");
    });

    it("visualizza correttamente i fondi con tutte le informazioni", () => {
        cy.contains("Fondo A").should("be.visible");
        cy.contains("Descrizione Fondo A").should("be.visible");
        cy.contains("Tipo di attivo: Azionario").should("be.visible");
        cy.contains("Redditività 1 anno: 5.50 %").should("be.visible");
        cy.contains("Da 1000 €").should("be.visible");
        cy.contains("SFDR 6").should("be.visible");

        cy.contains("Fondo B").should("be.visible");
        cy.contains("Descrizione Fondo B").should("be.visible");
        cy.contains("Tipo di attivo: Obbligazionario").should("be.visible");
        cy.contains("Redditività 1 anno: 3.20 %").should("be.visible");
        cy.contains("Da 500 €").should("be.visible");
        cy.contains("SFDR 7").should("be.visible");

        cy.screenshot("fondi-visualizzati");
    });

    it("apre la modal di simulazione e modifica importo", () => {
        cy.contains("Fondo A").parent().parent().within(() => {
            cy.get("button").contains("Simula investimento").click();
        });

        cy.get(".modal").should("be.visible");
        cy.get(".modal").within(() => {
            cy.get("input[type='number']").clear().type("2000");
        });

        cy.get(".modal").contains("Chiudi").click();
        cy.get(".modal").should("not.exist");

        cy.screenshot("modal-chiusa");
    });

    it("renderizza il grafico con dati simulati", () => {
        cy.contains("Fondo A").parent().parent().within(() => {
            cy.get("button").contains("Simula investimento").click();
        });

        cy.get(".modal").should("be.visible");
        cy.get("svg").should("exist");
        cy.screenshot("grafico-fondo");
    });
});
