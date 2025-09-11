/// <reference types="cypress" />

describe("Login", () => {
    beforeEach(() => {
        cy.intercept("POST", "/api/auth/login", {
            statusCode: 200,
            body: { token: "fake-jwt-token" },
        }).as("loginRequest");
    });

    it("fa il login e apre la dashboard", () => {
        cy.visit("/login");
        cy.get('input[type="text"]').type("testuser");
        cy.get('input[type="password"]').type("password123");
        cy.get('button[type="submit"]').click();

        cy.wait("@loginRequest");

        cy.url().should("eq", "http://localhost:5173/");
        cy.screenshot("login-success");
    });
});
