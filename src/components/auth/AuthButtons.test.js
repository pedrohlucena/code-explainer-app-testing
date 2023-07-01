import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createServer } from "../../test/server";
import { SWRConfig } from "swr";
import AuthButtons from "./AuthButtons";

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

describe("<AuthButtons />", () => {
  describe("when user is not signed in", () => {
    createServer([
      {
        path: "/api/user",
        res: () => {
          return { user: null };
        },
      },
    ]);

    it("should display sign in and sign up buttons", async () => {
      await renderComponent();

      const signInBtn = screen.getByRole("link", { name: /Sign In/i });
      const signUpBtn = screen.getByRole("link", { name: /Sign Up/i });

      expect(signInBtn).toBeInTheDocument();
      expect(signUpBtn).toBeInTheDocument();

      expect(signInBtn).toHaveAttribute("href", "/signin");
      expect(signUpBtn).toHaveAttribute("href", "/signup");
    });

    it("should not display sign out button", async () => {
      await renderComponent();

      const signOutBtn = screen.queryByRole("link", { name: /Sign Out/i });

      expect(signOutBtn).not.toBeInTheDocument();
    });
  });

  describe("when user is signed in", () => {
    createServer([
      {
        path: "/api/user",
        res: () => {
          return { user: { id: 3, email: "abc@gmail.com" } };
        },
      },
    ]);

    it("should not display sign in and sign up buttons", async () => {
      await renderComponent();

      const signInBtn = screen.queryByRole("link", { name: /Sign In/i });
      const signUpBtn = screen.queryByRole("link", { name: /Sign Up/i });

      expect(signInBtn).not.toBeInTheDocument();
      expect(signUpBtn).not.toBeInTheDocument();
    });

    it("should display sign out button", async () => {
      await renderComponent();

      const signOutBtn = screen.getByRole("link", { name: /Sign Out/i });

      expect(signOutBtn).toBeInTheDocument();
      expect(signOutBtn).toHaveAttribute("href", "/signout");
    });
  });
});
