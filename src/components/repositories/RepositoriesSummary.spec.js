import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

const repositoryMock = {
  stargazers_count: 5,
  open_issues: 30,
  forks: 1,
  language: "Typescript",
};

describe("<RepositoriesSummary/>", () => {
  it("should displays information about the repository", () => {
    render(<RepositoriesSummary repository={repositoryMock} />);

    for (const key in repositoryMock) {
      const info = repositoryMock[key];

      const repositoryInfoEl = screen.getByText(new RegExp(info, "i"));

      expect(repositoryInfoEl).toBeInTheDocument();
    }
  });
});
