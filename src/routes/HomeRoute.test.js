import { render, screen } from "@testing-library/react";
import { createServer } from "../test/server";
import { MemoryRouter } from "react-router";
import HomeRoute from "./HomeRoute";

createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];

      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

describe("<HomeRoute/>", () => {
  it("should render two links for each language table", async () => {
    render(
      <MemoryRouter>
        <HomeRoute />
      </MemoryRouter>
    );

    const languages = [
      "javascript",
      "typescript",
      "rust",
      "go",
      "python",
      "java",
    ];

    for (const language of languages) {
      const links = await screen.findAllByRole("link", {
        name: new RegExp(`${language}_`, "i"),
      });

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent(`${language}_one`);
      expect(links[1]).toHaveTextContent(`${language}_two`);
      expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
      expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
    }
  });
});
