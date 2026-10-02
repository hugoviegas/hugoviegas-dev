import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ADMIN_PATH } from "@/config/admin";
import { AdminNavProvider } from "../AdminNavigation";
import { AdminSummaryProvider } from "../AdminSummary";
import { AdminToastProvider } from "../AdminToasts";

// Renders an admin view inside the providers the shell gives it.
export const renderAdmin = (ui: ReactNode, path = ADMIN_PATH) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AdminToastProvider>
        <AdminSummaryProvider autoLoad={false}>
          <AdminNavProvider>{ui}</AdminNavProvider>
        </AdminSummaryProvider>
      </AdminToastProvider>
    </MemoryRouter>,
  );
