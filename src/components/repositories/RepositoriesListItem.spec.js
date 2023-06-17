import { render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router";

function renderComponent() {
  const repositoryMock = {
    full_name: "pedrohlucena/code-explainer-app-testing",
    description:
      'Project which I wrote its unit tests during the course "React Testing Library and Jest: The Complete Guide"',
    owner: {
      login: "pedrohlucena",
    },
    name: "pedrohlucena/code-explainer-app-testing",
    language: "Javascript",
    html_url: "https://github.com/pedrohlucena/code-explainer-app-testing",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repositoryMock} />
    </MemoryRouter>
  );

  return { repositoryMock };
}

describe("<RepositoriesListItem />", () => {
  it("should shows a link to the github homepage for this repository", async () => {
    const { repositoryMock } = renderComponent();

    await screen.findByRole("img", {
      name: new RegExp(repositoryMock.language, "i"),
    });

    const linkGithub = screen.getByRole("link", {
      name: /github repository/i,
    });

    expect(linkGithub).toHaveAttribute("href", repositoryMock.html_url);
  });

  it("should show an icon of the primary language of the repository", async () => {
    const { repositoryMock } = renderComponent();

    const icon = await screen.findByRole("img", {
      name: new RegExp(repositoryMock.language, "i"),
    });

    expect(icon).toHaveClass("js-icon");
  });

  it("should show an icon to the code editor page", async () => {
    const { repositoryMock } = renderComponent();

    await screen.findByRole("img", {
      name: new RegExp(repositoryMock.language, "i"),
    });

    const link = screen.getByRole("link", {
      name: new RegExp(`${repositoryMock.owner.login}/`, "i"),
    });

    expect(link).toHaveAttribute(
      "href",
      `/repositories/${repositoryMock.full_name}`
    );
  });
});
