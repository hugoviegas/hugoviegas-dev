import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentCollection } from "@/content/types";
import { loadExistingContent } from "./adminContent";
import { ADMIN_COLLECTIONS, collectionDefs } from "./collectionConfig";
import CollectionPanel from "./CollectionPanel";
import FilesPanel from "./FilesPanel";
import SeedImport from "./SeedImport";
import SettingsPanel from "./SettingsPanel";
import { useAdminT } from "./adminStrings";

type Counts = Partial<Record<ContentCollection, { published: number; drafts: number }>>;

const Overview = () => {
  const t = useAdminT();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExistingContent()
      .then(({ docs }) => {
        const next: Counts = {};
        for (const name of ADMIN_COLLECTIONS) {
          const items = Object.values(docs[name] ?? {});
          const published = items.filter((item) => item.data.published === true).length;
          next[name] = { published, drafts: items.length - published };
        }
        setCounts(next);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  return (
    <section aria-labelledby="overview-title" className="space-y-4">
      <h3 id="overview-title" className="heading-card">
        {t("tab.overview")}
      </h3>
      <p className="text-sm text-muted-foreground">{t("overviewIntro")}</p>
      {error && (
        <p role="alert" className="text-destructive">
          {t("loadError")} {error}
        </p>
      )}
      {!counts && !error && <p role="status">{t("loadingContent")}</p>}
      {counts && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2">
                <span className="sr-only">{t("collectionLabel")}</span>
              </th>
              <th scope="col" className="py-2">{t("publishedLabel")}</th>
              <th scope="col" className="py-2">{t("draftsLabel")}</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_COLLECTIONS.map((name) => (
              <tr key={name} className="border-b border-border/60">
                <th scope="row" className="py-2 font-medium">
                  {t(collectionDefs[name].label)}
                </th>
                <td className="py-2">{counts[name]?.published ?? 0}</td>
                <td className="py-2">{counts[name]?.drafts ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

// Owner-only content admin. Tabs are keyboard accessible (arrow keys).
const AdminDashboard = () => {
  const t = useAdminT();
  return (
    <Tabs defaultValue="overview" className="w-full space-y-6 text-left">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
        <TabsTrigger value="overview">{t("tab.overview")}</TabsTrigger>
        {ADMIN_COLLECTIONS.map((name) => (
          <TabsTrigger key={name} value={name}>
            {t(collectionDefs[name].label)}
          </TabsTrigger>
        ))}
        <TabsTrigger value="files">{t("tab.files")}</TabsTrigger>
        <TabsTrigger value="settings">{t("tab.settings")}</TabsTrigger>
        <TabsTrigger value="import">{t("tab.import")}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Overview />
      </TabsContent>
      {ADMIN_COLLECTIONS.map((name) => (
        <TabsContent key={name} value={name}>
          <CollectionPanel collection={name} />
        </TabsContent>
      ))}
      <TabsContent value="files">
        <FilesPanel />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsPanel />
      </TabsContent>
      <TabsContent value="import">
        <SeedImport />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboard;
