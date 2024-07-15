describe("Pages basic tests", () => {
  it("Should display a title and an empty table", () => {
    cy.visit("/");
    cy.contains("h1", "Plans");
    cy.get("table").contains("There are no flight plans for now...");
  });

  it("Should display a title and a list of 5 drones", () => {
    cy.visit("/drones");
    cy.contains("h1", "Drones");
    cy.get(".drone-card").should("have.length", 5);
  });

  it("Should display a title and two (not empty) tables", () => {
    cy.visit("/orders-and-stores");
    cy.contains("h1", "Orders and Stocks");
    cy.get("table").should("have.length", 2);
    cy.get("table").each($table => {
      cy.wrap($table)
        .find("tr")
        // Check if table is not empty === thead.tr + at least on tbody.tr
        .each(($tr, index, $trs) => expect($trs.length).to.be.greaterThan(2));
    });
  });
});

const DRONE_ID = "Alpha";
const CUSTOMER_ID = "Jean Dupont";

function shouldHaveCreatedPlan() {
  const assertList = [DRONE_ID, "Villeneuve", "Axe", CUSTOMER_ID];
  cy.get("[data-cy=row-1] > td").each(($td, index) => {
    cy.wrap($td).should("have.text", assertList[index]);
  });
}

function shouldHaveUpdatedDrones() {
  cy.get("a[href='/drones']").click();
  cy.get(".drone-card").each($card => {
    if ($card.text().includes(DRONE_ID)) {
      cy.wrap($card)
        .find("progress")
        .then($prog => {
          // Verify that progress value is close to 87
          expect($prog[0].value).to.be.closeTo(87, 0.5);
        });
    }
  });
}

function shoulHabeUpdatedOrdersAndStores() {
  cy.get("a[href='/orders-and-stores']").click();
  cy.get("[data-cy=row-1]").each(($tr, index) => {
    if (index === 0) {
      expect($tr.text()).to.include("Axe: 4");
    } else if (index === 1) {
      expect($tr.text()).to.include("Axe9");
    }
  });
}

describe("Creation plan feature", () => {
  it("Should create a plan and update stocks, drones, orders and plans tables", () => {
    cy.visit("/");
    cy.get("[data-cy=openModalBtn]").click();
    cy.get("[data-cy=sOrder]").select(`LMFRORDER-1 (for ${CUSTOMER_ID})`);
    cy.get("[data-cy=sItem]").select("Axe (left in order: 5)");
    cy.get("[data-cy=sStore]").select("Villeneuve");
    cy.get("[data-cy=sDrone]").select(`${DRONE_ID} - use 12.67% of battery`);
    cy.get("form").submit();

    shouldHaveCreatedPlan();
    shouldHaveUpdatedDrones();
    shoulHabeUpdatedOrdersAndStores();
  });
});
