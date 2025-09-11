/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export {};

declare global {
    namespace Cypress {
        interface Chainable {
            loginFake(): void;
        }
    }
}

Cypress.Commands.add("loginFake", () => {
    cy.window().then((win: any) => {
        win.store = {
            getState: () => ({
                auth: { username: "testuser", token: "fake-jwt-token" },
                account: {
                    saldo: { saldo: 1234.56 },
                    movimenti: {
                        contenuto: [
                            { data: "2025-09-11T10:00:00", descrizione: "Bonifico in entrata", importo: 100 },
                            { data: "2025-09-10T12:00:00", descrizione: "Pagamento carta", importo: -50 },
                        ],
                        pagina: 1,
                        totalePagine: 1,
                        totaleElementi: 2,
                    },
                },
            }),
            subscribe: () => {},
            dispatch: () => {},
        };
    });
});

