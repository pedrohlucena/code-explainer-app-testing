import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router";
import HomeRoute from "./HomeRoute";

const handlers = [
  rest.get("/api/repositories", (req, res, ctx) => {
    const language = req.url.searchParams.get("q").split("language:")[1];

    return res(
      ctx.json({
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      })
    );
  }),
];

describe("<HomeRoute/>", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

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
